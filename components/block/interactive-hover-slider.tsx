"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import * as THREE from "three";
import gsap from "gsap";
import {
  WebGLSurface,
  useEffectReducedMotion,
} from "@/lib/effects/shared/webgl-surface";

const vertexShader = /* glsl */ `
uniform vec2 uVelocity;
uniform vec2 uViewport;
uniform float uCurvature;

varying vec2 vUv;

float circularArc(float d) {
 float maxAngle = 1.15;
 float theta = clamp(d, 0.0, 1.0) * maxAngle;
 return (1.0 - cos(theta)) / (1.0 - cos(maxAngle));
}

void main() {
 vUv = uv;

 vec4 worldPos = modelMatrix * vec4(position, 1.0);

 float nx = worldPos.x / uViewport.x;
 float ny = worldPos.y / uViewport.y;

 float cx = clamp(nx, -1.0, 1.0);
 float cy = clamp(ny, -1.0, 1.0);

 float distY = abs(cy);
 float distX = abs(cx);

 float curveY = circularArc(distY);
 float curveX = circularArc(distX);

 float edgeLift = curveY * uCurvature + curveX * (uCurvature * 0.1);

 float finalZOffset = edgeLift;

 float focalLength = max(uViewport.y * 2.2, 900.0);
 float perspective = focalLength / (focalLength - finalZOffset);

 vec3 finalPos = worldPos.xyz;
 finalPos.xy *= perspective;
 finalPos.z += finalZOffset;

 gl_Position = projectionMatrix * viewMatrix * vec4(finalPos, 1.0);
}
`;

const fragmentShader = /* glsl */ `
 uniform sampler2D uTexture;
 uniform vec2 uPlaneSize;
 uniform vec2 uImageSize;
 uniform float uAlpha;
 uniform float uZoom;
 varying vec2 vUv;

 vec2 coverUv(vec2 uv, vec2 planeSize, vec2 imageSize) {
 float planeRatio = planeSize.x / planeSize.y;
 float imageRatio = imageSize.x / imageSize.y;
 vec2 scale = vec2(1.0);
 if (planeRatio > imageRatio) {
 scale.y = imageRatio / planeRatio;
 } else {
 scale.x = planeRatio / imageRatio;
 }
 uv = (uv - 0.5) * scale + 0.5;
 return (uv - 0.5) / uZoom + 0.5;
 }

 void main() {
 vec2 uv = coverUv(vUv, uPlaneSize, uImageSize);
 if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;
 vec4 tex = texture2D(uTexture, uv);
 gl_FragColor = vec4(tex.rgb, tex.a * uAlpha);
 }
`;

const clamp = (v: number, mn: number, mx: number) => Math.min(Math.max(v, mn), mx);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export type SliderItem = {
  id: string;
  title: string;
  focus: string;
  year: string;
  img: string;
};

type SliderApi = {
  setActive: (index: number) => void;
  show: (index: number) => void;
  hide: () => void;
  onRowChange: (index: number) => void;
};

function HoverSliderScene({
  items,
  compact,
  onSelect,
  showHeader,
}: {
  items: SliderItem[];
  compact: boolean;
  onSelect?: (item: SliderItem, index: number) => void;
  showHeader: boolean;
}) {
  const reducedMotion = useEffectReducedMotion();
  const mountRef = useRef<HTMLElement>(null);
  const glRef = useRef<SliderApi | null>(null);
  const isDesktopRef = useRef(false);
  const stateRef = useRef({ activeIndex: 0, hovering: false, hasClicked: false });

  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!items.length) return;
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let repaint = () => {};
    let W = Math.max(1, mount.clientWidth);
    let H = Math.max(1, mount.clientHeight);

    const CARD_ASPECT = 1.7;
    const GAP = 14;
    const VISIBLE = 7;
    const HALF = 3;

    const getCardH = () =>
      Math.round(H * (compact ? 0.39 : W < 768 ? 0.34 : 0.46));
    const getCardW = () => {
      const cardW = getCardH() * CARD_ASPECT;
      return Math.round(W < 768 ? Math.min(cardW, W * 0.88) : cardW);
    };

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    Object.assign(renderer.domElement.style, {
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      bottom: W < 768 ? "auto" : "0",
      width: "100%",
      height: "100%",
      zIndex: "15",
      pointerEvents: "none",
    });
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera();
    const updateCamera = () => {
      camera.left = -W / 2;
      camera.right = W / 2;
      camera.top = H / 2;
      camera.bottom = -H / 2;
      camera.near = -2000;
      camera.far = 2000;
      camera.updateProjectionMatrix();
    };
    camera.position.z = 1000;
    updateCamera();
    renderer.setSize(W, H, false);

    const loader = new THREE.TextureLoader();
    const texCache: Record<string, THREE.Texture> = {};
    const getTexture = (src: string) => {
      if (texCache[src]) return texCache[src];
      const tex = loader.load(src, (t) => {
        if (disposed) {
          t.dispose();
          return;
        }
        t.colorSpace = THREE.SRGBColorSpace;
        t.minFilter = THREE.LinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.userData.iw = t.image?.width || 1;
        t.userData.ih = t.image?.height || 1;
        repaint();
      });
      tex.userData.iw = 1;
      tex.userData.ih = 1;
      texCache[src] = tex;
      return tex;
    };
    items.forEach((item) => getTexture(item.img));

    const syncImageSize = (
      mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>,
    ) => {
      const t = mesh.material.uniforms.uTexture.value as THREE.Texture | undefined;
      const img = t?.image as { width?: number; height?: number } | undefined;
      if (!t || !img) return;
      mesh.material.uniforms.uImageSize.value.set(
        img.width || t.userData.iw || 1,
        img.height || t.userData.ih || 1,
      );
    };

    const geo = new THREE.PlaneGeometry(1, 1, 80, 80);
    let CW = getCardW(),
      CH = getCardH();

    const makeMat = (tex: THREE.Texture) =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: tex },
          uPlaneSize: { value: new THREE.Vector2(CW, CH) },
          uImageSize: { value: new THREE.Vector2(tex.userData.iw, tex.userData.ih) },
          uVelocity: { value: new THREE.Vector2(0, 0) },
          uAlpha: { value: 0 },
          uZoom: { value: 1.06 },
          uViewport: { value: new THREE.Vector2(W / 2, H / 2) },
          uCurvature: { value: 0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

    const firstTex = getTexture(items[0].img);
    const meshes = Array.from(
      { length: VISIBLE },
      (_, i): THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> => {
        const mesh = new THREE.Mesh(geo, makeMat(firstTex));
        mesh.renderOrder = i;
        scene.add(mesh);
        return mesh;
      },
    );

    const curveAnim = { value: 0, zoom: 1.06 };
    const anim = { alpha: 0 };
    const ACTIVE_CURVE = 400;
    const SOFT_CURVE = 80;
    let floatIdx = 0;
    let prevFloat = 0;
    const vel = new THREE.Vector2(0, 0);
    let raf = 0;

    const getCurveForTravel = (targetIdx: number) => {
      const travel = Math.abs(targetIdx - floatIdx);
      const p = clamp((travel - 0.35) / 3.5, 0, 1);
      const eased = p * p * (3 - 2 * p);
      return lerp(SOFT_CURVE, ACTIVE_CURVE, eased);
    };

    const releaseCurve = (targetIdx = stateRef.current.activeIndex) => {
      if (reducedMotion) {
        curveAnim.value = 0;
        return;
      }
      const peakCurve = getCurveForTravel(targetIdx);
      gsap.killTweensOf(curveAnim);
      curveAnim.zoom = 1.06;
      gsap
        .timeline()
        .to(curveAnim, {
          value: peakCurve,
          zoom: 1.06,
          duration: 0.12,
          ease: "power2.out",
        })
        .to(curveAnim, {
          value: 0,
          zoom: 1.06,
          duration: 1.25,
          ease: "power2.inOut",
        });
    };

    const show = (targetIdx: number) => {
      if (reducedMotion) {
        anim.alpha = 1;
        curveAnim.value = 0;
        return;
      }
      gsap.killTweensOf(anim);
      gsap.to(anim, { alpha: 1, duration: 0.45, ease: "power3.out" });
      releaseCurve(targetIdx);
    };

    const hide = () => {
      if (reducedMotion) {
        anim.alpha = 0;
        curveAnim.value = 0;
        return;
      }
      gsap.killTweensOf(anim);
      gsap.killTweensOf(curveAnim);
      gsap.to(anim, { alpha: 0, duration: 0.35, ease: "power2.out" });
      gsap.to(curveAnim, { value: 0, zoom: 1.06, duration: 0.55, ease: "power2.inOut" });
    };

    const onRowChange = (targetIdx: number) => {
      releaseCurve(targetIdx);
    };

    const onResize = () => {
      const wasDesktop = isDesktopRef.current;
      W = Math.max(1, mount.clientWidth);
      H = Math.max(1, mount.clientHeight);
      isDesktopRef.current = W >= 768;
      Object.assign(renderer.domElement.style, {
        position: "absolute",
        bottom: W < 768 ? "auto" : "0",
        height: "100%",
      });
      renderer.setSize(W, H, false);
      updateCamera();
      CW = getCardW();
      CH = getCardH();
      meshes.forEach((m) => {
        m.material.uniforms.uPlaneSize.value.set(CW, CH);
        m.material.uniforms.uViewport.value.set(W / 2, H / 2);
      });

      if (!wasDesktop && isDesktopRef.current) {
        stateRef.current.hasClicked = true;
        stateRef.current.hovering = true;
        stateRef.current.activeIndex = 0;
        setHighlightedIndex(0);
        show(0);
      }
    };
    const observer = new ResizeObserver(() => {
      onResize();
      repaint();
    });
    observer.observe(mount);
    onResize();

    {
      stateRef.current.hasClicked = true;
      stateRef.current.hovering = true;
      setHighlightedIndex(0);
      show(0);
    }

    const tick = () => {
      if (!reducedMotion) raf = requestAnimationFrame(tick);

      const targetIdx = stateRef.current.activeIndex;

      const diff = targetIdx - floatIdx;
      const dist = Math.abs(diff);

      const t = clamp(0.18 - dist * 0.06, 0.05, 0.18);

      floatIdx = reducedMotion ? targetIdx : floatIdx + diff * t;

      const delta = floatIdx - prevFloat;

      vel.y = lerp(vel.y, delta * 60, 0.16);
      vel.x = lerp(vel.x, 0, 0.14);

      prevFloat = floatIdx;

      const centreInt = Math.round(floatIdx);
      const drift = floatIdx - centreInt;

      for (let i = 0; i < VISIBLE; i++) {
        const offset = i - HALF;
        const itemIdx =
          (((centreInt + offset) % items.length) + items.length) % items.length;
        const posY = (-offset + drift) * (CH + GAP);
        const dist = Math.abs(offset - drift);

        const scaleH = Math.max(0.76, 1.0 - dist * 0.06);
        const sw = CW;
        const sh = CH * scaleH;

        const baseOpacity = 0.88;
        const opacity = Math.max(0, baseOpacity - dist * 0.22) * anim.alpha;

        const wantTex = getTexture(items[itemIdx].img);
        if (meshes[i].material.uniforms.uTexture.value !== wantTex) {
          meshes[i].material.uniforms.uTexture.value = wantTex;
        }
        syncImageSize(meshes[i]);

        meshes[i].position.set(compact ? W * 0.24 : W * 0.26, posY, i);
        meshes[i].scale.set(sw, sh, 1);
        meshes[i].rotation.z = 0;
        meshes[i].material.uniforms.uVelocity.value.set(vel.x, vel.y * 0.28);
        meshes[i].material.uniforms.uAlpha.value = opacity;
        meshes[i].material.uniforms.uZoom.value =
          curveAnim.zoom - clamp(1.0 - dist, 0, 1) * 0.04;
        meshes[i].material.uniforms.uPlaneSize.value.set(sw, sh);
        meshes[i].material.uniforms.uCurvature.value = curveAnim.value;
        meshes[i].material.uniforms.uViewport.value.set(W / 2, H / 2);
      }

      renderer.render(scene, camera);
    };

    repaint = () => {
      if (reducedMotion && !disposed) tick();
    };
    tick();

    glRef.current = {
      setActive: (i) => {
        stateRef.current.activeIndex = i;
        repaint();
      },
      show,
      hide,
      onRowChange,
    };

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      gsap.killTweensOf(anim);
      gsap.killTweensOf(curveAnim);
      geo.dispose();
      meshes.forEach((m) => m.material.dispose());
      Object.values(texCache).forEach((t) => t.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      glRef.current = null;
    };
  }, [items, reducedMotion, compact]);

  const onEnter = useCallback((index: number) => {
    if (isDesktopRef.current) {
      const wasHovering = stateRef.current.hovering;
      stateRef.current.hasClicked = true;
      stateRef.current.hovering = true;
      stateRef.current.activeIndex = index;
      setHighlightedIndex(index);
      glRef.current?.setActive(index);
      if (!wasHovering) glRef.current?.show(index);
      else glRef.current?.onRowChange(index);
      return;
    }
    if (!stateRef.current.hasClicked) {
      setHighlightedIndex(index);
      return;
    }
    const wasHovering = stateRef.current.hovering;
    stateRef.current.hovering = true;
    stateRef.current.activeIndex = index;
    setHighlightedIndex(index);
    glRef.current?.setActive(index);
    if (!wasHovering) glRef.current?.show(index);
    else glRef.current?.onRowChange(index);
  }, []);

  const onLeave = useCallback((event: React.PointerEvent) => {
    if (event.pointerType === "touch") return;
    if (stateRef.current.hasClicked) return;
    stateRef.current.hovering = false;
    setHighlightedIndex(null);
    glRef.current?.hide();
  }, []);

  const activateRow = useCallback(
    (index: number) => {
      const wasHovering = stateRef.current.hovering;
      stateRef.current.hasClicked = true;
      stateRef.current.hovering = true;
      stateRef.current.activeIndex = index;
      setHighlightedIndex(index);
      glRef.current?.setActive(index);
      if (!wasHovering) glRef.current?.show(index);
      else glRef.current?.onRowChange(index);
      onSelect?.(items[index], index);
    },
    [items, onSelect],
  );

  return (
    <section
      ref={mountRef}
      onPointerLeave={onLeave}
      className={`relative isolate h-full w-full overflow-hidden bg-black text-[var(--bone)] ${
        compact ? "px-3 py-3" : "px-6 py-8 md:px-16 md:py-10"
      }`}
      style={{ cursor: "crosshair" }}
    >
      {showHeader ? (
        <header className="relative z-20 flex items-start justify-between text-[11px] text-[var(--bone)]/55 max-sm:px-2">
          <div>IIC BMSIT</div>
          {!compact && (
            <nav className="absolute left-1/2 top-0 flex -translate-x-1/2 gap-3 max-sm:gap-5">
              <span>Featured Events,</span>
              <span>Archive</span>
              <span>About</span>
            </nav>
          )}
          {!compact && (
            <div className="flex items-center gap-2 max-sm:hidden">
              <span className="inline-block h-2 w-2 bg-emerald-400" />
              <span>Selected work</span>
            </div>
          )}
        </header>
      ) : null}

      <div
        className={`relative z-20 overflow-x-auto pb-4 ${
          compact
            ? "mt-4 w-1/2"
            : showHeader
              ? "mt-10 w-full md:w-1/2"
              : "mt-0 w-full md:w-1/2"
        }`}
      >
        <div
          className={`grid gap-3 text-[10px] uppercase tracking-widest ${
            compact ? "pb-2" : "pb-4"
          }`}
          style={{
            gridTemplateColumns: compact ? "minmax(0,1fr)" : "minmax(0,1fr) 3.5rem",
            color: "rgba(244,241,232,0.45)",
            borderBottom: "1px solid rgba(244,241,232,0.14)",
          }}
        >
          <div>Title</div>
          {!compact && <div className="text-right">Year</div>}
        </div>

        {items.map((item, index) => {
          const active = highlightedIndex === index;
          return (
            <button
              key={item.id}
              onPointerEnter={() => onEnter(index)}
              onPointerDown={() => activateRow(index)}
              onClick={() => activateRow(index)}
              type="button"
              aria-label={`Event ${item.id}: ${item.title}, ${item.year}`}
              aria-pressed={active}
              onFocus={() => activateRow(index)}
              className="w-full border-0 bg-transparent text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
              style={{
                display: "grid",
                gridTemplateColumns: compact
                  ? "minmax(0,1fr)"
                  : "minmax(0,1fr) 3.5rem",
                gap: "12px",
                alignItems: "baseline",
                padding: compact ? "5px 0" : "7px 0",
                borderBottom: "1px solid rgba(244,241,232,0.14)",
                cursor: "crosshair",
                transition: "color 0.15s",
                color: active ? "#34d399" : "rgba(244,241,232,0.6)",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.6rem",
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontSize: compact ? 10 : 12,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </span>
                {active && !compact ? (
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      color: "rgba(52,211,153,0.75)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    [click to open]
                  </span>
                ) : null}
              </span>
              {!compact && (
                <span style={{ fontSize: 11, textAlign: "right" }}>{item.year}</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

const defaultItems: SliderItem[] = [
  {
    id: "01",
    title: "Soft Forms",
    focus: "Visual study",
    year: "2026",
    img: "/cdn/effects/interactive-hover-slider/interactive-hover-slider-img01.webp?v=3",
  },
  {
    id: "02",
    title: "Botanical",
    focus: "Art direction",
    year: "2026",
    img: "/cdn/effects/interactive-hover-slider/interactive-hover-slider-img02.webp?v=3",
  },
  {
    id: "03",
    title: "Afterlight",
    focus: "Identity",
    year: "2026",
    img: "/cdn/effects/interactive-hover-slider/interactive-hover-slider-img03.webp?v=3",
  },
  {
    id: "04",
    title: "Glasswork",
    focus: "Materials",
    year: "2026",
    img: "/cdn/effects/interactive-hover-slider/interactive-hover-slider-img04.png?v=3",
  },
  {
    id: "05",
    title: "Motion Study",
    focus: "Experiment",
    year: "2026",
    img: "/cdn/effects/interactive-hover-slider/interactive-hover-slider-img05.png?v=3",
  },
];

type InteractiveHoverSliderProps = {
  items?: SliderItem[];
  compact?: boolean;
  showHeader?: boolean;
  className?: string;
  style?: CSSProperties;
  onSelect?: (item: SliderItem, index: number) => void;
};

export function InteractiveHoverSlider({
  items = defaultItems,
  compact = false,
  showHeader = true,
  className,
  style,
  onSelect,
}: InteractiveHoverSliderProps = {}) {
  return (
    <WebGLSurface
      className={className}
      style={style}
      imageSrc={items[0]?.img}
      label="IIC events image showcase"
    >
      {items.length > 0 && (
        <HoverSliderScene
          items={items}
          compact={compact}
          showHeader={showHeader}
          onSelect={onSelect}
        />
      )}
    </WebGLSurface>
  );
}

export default InteractiveHoverSlider;
