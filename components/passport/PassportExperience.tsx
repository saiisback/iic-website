"use client";

import { useEffect, useReducer } from "react";

import { QR } from "@/components/primitives/QR";
import { fmtDate, fmtXp } from "@/lib/format";
import type { EventItem, Member } from "@/lib/types";

import {
  PASSPORT_SPREAD_COUNT,
  passportActionForKey,
  passportReducer,
  initialPassportState,
} from "./passport-state";
import { PassportCover, type PassportCoverStyles } from "./PassportCover";
import styles from "./PassportExperience.module.css";

const passportCoverStyles: PassportCoverStyles = {
  coverScene: styles.coverScene,
  coverButton: styles.coverButton,
  closedPassport: styles.closedPassport,
  coverTexture: styles.coverTexture,
  coverFrame: styles.coverFrame,
  coverKicker: styles.coverKicker,
  coverEmblem: styles.coverEmblem,
  coverMonogram: styles.coverMonogram,
  coverInstitute: styles.coverInstitute,
  coverTitle: styles.coverTitle,
  coverMeta: styles.coverMeta,
  openHint: styles.openHint,
};

type PassportExperienceProps = {
  member: Member;
  attended: EventItem[];
  upcoming: EventItem[];
};

export function PassportExperience({
  member,
  attended,
  upcoming,
}: PassportExperienceProps) {
  const [state, dispatch] = useReducer(passportReducer, initialPassportState);

  useEffect(() => {
    if (!state.isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const action = passportActionForKey(event.key);
      if (!action) return;

      event.preventDefault();
      dispatch(action);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.isOpen]);

  return (
    <main className={styles.stage}>
      <div className={styles.atmosphere} aria-hidden="true" />

      {!state.isOpen ? (
        <PassportCover
          onOpen={() => dispatch({ type: "open" })}
          styles={passportCoverStyles}
        />
      ) : (
        <section className={styles.openScene} aria-label="Open innovation passport">
          <p className={styles.srOnly} aria-live="polite">
            Passport spread {state.spread + 1} of {PASSPORT_SPREAD_COUNT}
          </p>

          <div className={styles.bookShell}>
            <div className={styles.book}>
              <article className={`${styles.page} ${styles.baseLeft}`}>
                <div className={styles.securityPattern} aria-hidden="true" />
                <p className={styles.eyebrow}>BMS Institute of Technology</p>
                <div className={styles.crest} aria-hidden="true">
                  <span>IIC</span>
                </div>
                <h1 className={styles.authority}>Innovation &amp; Incubation Council</h1>
                <p className={styles.documentType}>Member innovation passport</p>
                <dl className={styles.validityGrid}>
                  <div>
                    <dt>Issued</dt>
                    <dd>{fmtDate(member.memberSince)}</dd>
                  </div>
                  <div>
                    <dt>Authority</dt>
                    <dd>IIC · BMSIT</dd>
                  </div>
                </dl>
                <div className={styles.signature}>
                  <span>Innovation office</span>
                  <small>Issuing authority</small>
                </div>
                <span className={styles.pageNumber}>01</span>
              </article>

              <article className={`${styles.page} ${styles.baseRight}`}>
                <div className={styles.securityPattern} aria-hidden="true" />
                <p className={styles.eyebrow}>Upcoming clearances</p>
                <h2 className={styles.pageTitle}>Next entries</h2>
                <div className={styles.upcomingList}>
                  {upcoming.slice(0, 3).map((event) => (
                    <div className={styles.upcomingEntry} key={event.id}>
                      <time dateTime={event.date}>{fmtDate(event.date)}</time>
                      <strong>{event.title}</strong>
                      <span>{event.location}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.verificationRow}>
                  <QR seed={`${member.id}-${member.xp}`} size={72} tone="paper" />
                  <div>
                    <span>Digitally verified</span>
                    <strong>{member.id}</strong>
                    <small>IIC · BMSIT / 2026</small>
                  </div>
                </div>
                <span className={styles.pageNumber}>06</span>
              </article>

              <div
                className={`${styles.sheet} ${styles.sheetOne}`}
                data-flipped={state.spread > 0}
                aria-hidden={state.spread > 1}
              >
                <article className={`${styles.page} ${styles.sheetFront}`}>
                  <div className={styles.securityPattern} aria-hidden="true" />
                  <div className={styles.identityHeader}>
                    <span>IN / IIC-BMSIT</span>
                    <span>{member.id}</span>
                  </div>
                  <div className={styles.identityLayout}>
                    <div className={styles.portrait} aria-label={`Portrait monogram for ${member.name}`}>
                      <span>{member.name.slice(0, 1)}</span>
                    </div>
                    <div>
                      <p className={styles.eyebrow}>Passport holder</p>
                      <h2 className={styles.holderName}>{member.name}</h2>
                      <p className={styles.handle}>{member.handle}</p>
                    </div>
                  </div>
                  <dl className={styles.identityFields}>
                    <div>
                      <dt>Member no.</dt>
                      <dd>{member.id}</dd>
                    </div>
                    <div>
                      <dt>Tier</dt>
                      <dd>{member.tier.code}</dd>
                    </div>
                    <div>
                      <dt>Member since</dt>
                      <dd>{fmtDate(member.memberSince)}</dd>
                    </div>
                    <div>
                      <dt>Standing</dt>
                      <dd>ACTIVE</dd>
                    </div>
                  </dl>
                  <p className={styles.machineLine}>
                    IIC&lt;{member.id.replaceAll("-", "")}&lt;&lt;{member.name.replaceAll(" ", "<")}
                  </p>
                  <span className={styles.pageNumber}>02</span>
                </article>

                <article className={`${styles.page} ${styles.sheetBack}`}>
                  <div className={styles.securityPattern} aria-hidden="true" />
                  <p className={styles.eyebrow}>Validated participation</p>
                  <h2 className={styles.pageTitle}>Field record</h2>
                  <div className={styles.statRow}>
                    <div>
                      <strong>{member.stats.attended}</strong>
                      <span>sessions</span>
                    </div>
                    <div>
                      <strong>{member.stats.hours}</strong>
                      <span>hours</span>
                    </div>
                    <div>
                      <strong>{member.stats.streak}</strong>
                      <span>week streak</span>
                    </div>
                  </div>
                  <div className={styles.stampField} aria-label="Participation verified">
                    <div className={styles.stamp}>
                      <span>VERIFIED</span>
                      <strong>BMSIT</strong>
                      <small>INNOVATION OFFICE</small>
                    </div>
                  </div>
                  <p className={styles.annotation}>
                    Participation entries are validated against the IIC member registry.
                  </p>
                  <span className={styles.pageNumber}>03</span>
                </article>
              </div>

              <div
                className={`${styles.sheet} ${styles.sheetTwo}`}
                data-flipped={state.spread > 1}
                aria-hidden={state.spread < 1}
              >
                <article className={`${styles.page} ${styles.sheetFront}`}>
                  <div className={styles.securityPattern} aria-hidden="true" />
                  <p className={styles.eyebrow}>Stamped entries</p>
                  <h2 className={styles.pageTitle}>Participation log</h2>
                  <div className={styles.entryList}>
                    {attended.slice(0, 4).map((event, index) => (
                      <div className={styles.entry} key={event.id}>
                        <span className={styles.entryIndex}>{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <strong>{event.title}</strong>
                          <span>{event.code} · {event.location}</span>
                        </div>
                        <time dateTime={event.date}>{fmtDate(event.date)}</time>
                      </div>
                    ))}
                  </div>
                  <span className={styles.pageNumber}>04</span>
                </article>

                <article className={`${styles.page} ${styles.sheetBack}`}>
                  <div className={styles.securityPattern} aria-hidden="true" />
                  <p className={styles.eyebrow}>Innovation standing</p>
                  <h2 className={styles.pageTitle}>Current status</h2>
                  <div className={styles.tierSeal}>
                    <span>Tier {member.tier.index}</span>
                    <strong>{member.tier.code}</strong>
                  </div>
                  <div className={styles.xpBlock}>
                    <span>Verified experience</span>
                    <strong>{fmtXp(member.xp)} XP</strong>
                    <div className={styles.xpTrack}>
                      <span />
                    </div>
                  </div>
                  <dl className={styles.statusMeta}>
                    <div>
                      <dt>Registry</dt>
                      <dd>IIC/BMSIT/026</dd>
                    </div>
                    <div>
                      <dt>Classification</dt>
                      <dd>ACTIVE MEMBER</dd>
                    </div>
                  </dl>
                  <span className={styles.pageNumber}>05</span>
                </article>
              </div>

              <div className={styles.binding} aria-hidden="true" />
            </div>
          </div>

          <nav className={styles.controls} aria-label="Passport page controls">
            <button
              type="button"
              onClick={() => dispatch({ type: "previous" })}
              aria-label={state.spread === 0 ? "Close passport" : "Previous passport spread"}
            >
              <span aria-hidden="true">←</span>
            </button>
            <span aria-hidden="true">
              {String(state.spread + 1).padStart(2, "0")} / {String(PASSPORT_SPREAD_COUNT).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => dispatch({ type: "next" })}
              aria-label="Next passport spread"
              disabled={state.spread === PASSPORT_SPREAD_COUNT - 1}
            >
              <span aria-hidden="true">→</span>
            </button>
          </nav>
        </section>
      )}
    </main>
  );
}
