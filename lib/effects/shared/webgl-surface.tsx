"use client";

import {
  Component,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const subscribeMotion = (notify: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

export function useEffectReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}

let webglAvailable: boolean | null = null;
const availabilityListeners = new Set<() => void>();
function detectWebglAvailability() {
  if (webglAvailable !== null) return;
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    webglAvailable = Boolean(context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglAvailable = false;
  }
  availabilityListeners.forEach((notify) => notify());
}
const subscribeAvailability = (notify: () => void) => {
  // Detection is deferred a tick: context creation can transiently fail during
  // early page load (common on phones), and the result is sticky, so a false
  // negative would permanently lock every WebGL surface into its static image.
  if (webglAvailable === null) setTimeout(detectWebglAvailability, 0);
  availabilityListeners.add(notify);
  return () => availabilityListeners.delete(notify);
};

class SurfaceBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

type WebGLSurfaceProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  imageSrc?: string;
  label?: string;
  /** Extra classes for the static fallback image (e.g. phone adjustments). */
  fallbackClassName?: string;
};

export function WebGLSurface({
  children,
  className,
  style,
  imageSrc,
  label = "ObsidianUI visual effect",
  fallbackClassName,
}: WebGLSurfaceProps) {
  const supported = useSyncExternalStore(
    subscribeAvailability,
    () => webglAvailable === true,
    () => false,
  );
  const fallback = (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "absolute inset-0 bg-cover bg-center",
        fallbackClassName,
      )}
      style={{
        backgroundImage: imageSrc ? `url(${JSON.stringify(imageSrc)})` : undefined,
      }}
    />
  );
  return (
    <div
      className={cn(
        "relative isolate h-[28rem] w-full overflow-hidden bg-black",
        className,
      )}
      style={{ containerType: "size", ...style }}
    >
      {fallback}
      {supported && <SurfaceBoundary fallback={fallback}>{children}</SurfaceBoundary>}
    </div>
  );
}
