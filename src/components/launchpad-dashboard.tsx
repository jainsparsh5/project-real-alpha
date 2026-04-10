"use client";

import { useMemo, useState } from "react";

import {
  BatteryIcon,
  BoltIcon,
  MoonIcon,
  SparkIcon,
} from "@/components/command-icons";

const cognitiveStates = [
  {
    id: "focused",
    label: "Focused",
    icon: SparkIcon,
    description: "Precision mode engaged",
  },
  {
    id: "tired",
    label: "Tired",
    icon: BatteryIcon,
    description: "Recovery bandwidth limited",
  },
  {
    id: "energized",
    label: "Energized",
    icon: BoltIcon,
    description: "Peak-output window active",
  },
] as const;

const progressTicks = [0, 1, 2, 3, 4, 5];

export default function LaunchpadDashboard() {
  const [sleepHours, setSleepHours] = useState(7.5);
  const [manifest, setManifest] = useState("");
  const [state, setState] =
    useState<(typeof cognitiveStates)[number]["id"]>("energized");
  const [launched, setLaunched] = useState(false);

  const manifestLength = manifest.trim().length;
  const minimumReached = manifestLength >= 20;

  const resilienceBoost = useMemo(() => {
    const baseline = state === "energized" ? 14 : state === "focused" ? 10 : 6;
    return baseline + Math.min(8, Math.floor(manifestLength / 24));
  }, [manifestLength, state]);

  const activeState = cognitiveStates.find((item) => item.id === state)!;

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-[0.25rem] border border-white/[0.04] bg-[radial-gradient(circle_at_top_left,rgba(143,245,255,0.06),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.018),rgba(255,255,255,0.008)),#101011] px-5 py-8 shadow-[0_32px_90px_rgba(0,0,0,0.34)] sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] bg-[radial-gradient(circle_at_40%_20%,rgba(255,255,255,0.03),transparent_35%),linear-gradient(180deg,transparent,rgba(255,255,255,0.02),transparent)] lg:block" />
        <div className="pointer-events-none absolute right-[14%] top-8 hidden h-28 w-28 rounded-full border border-white/[0.02] lg:block" />
        <div className="pointer-events-none absolute right-[12%] top-14 hidden h-px w-44 bg-white/[0.04] lg:block" />
        <div className="pointer-events-none absolute right-[18%] top-[7.4rem] hidden h-20 w-36 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent)] [mask-image:repeating-linear-gradient(90deg,#000_0_7px,transparent_7px_18px)] lg:block" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-display text-[0.78rem] uppercase tracking-[0.42em] text-primary/80">
              Initial Deployment
            </p>
            <h1 className="mt-4 font-display text-[3rem] font-semibold tracking-[-0.05em] text-white sm:text-[4.6rem] sm:leading-[0.94]">
              Rise &amp; Grind
            </h1>

            <div className="mt-3 flex flex-col gap-2 text-white/58 sm:flex-row sm:items-end sm:gap-4">
              <span className="font-display text-[2rem] tracking-[-0.04em] sm:text-[2.7rem]">
                06:45 AM
              </span>
              <span className="pb-1 text-[0.74rem] font-semibold uppercase tracking-[0.22em] text-white/26">
                Monday // October 21
              </span>
            </div>
          </div>

          <div className="w-full max-w-[280px] self-start lg:self-end">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.12]">
              <div className="h-full w-full bg-[linear-gradient(90deg,var(--primary),rgba(255,255,255,0.9))] shadow-[0_0_16px_rgba(143,245,255,0.42)]" />
            </div>
            <div className="mt-2 text-right text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/28">
              System Uptime: 100%
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[220px_1fr]">
        <div className="grid gap-4">
          <article className="rounded-[0.25rem] bg-surface-high p-5 shadow-[0_20px_44px_rgba(0,0,0,0.22)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-primary/70">
                  Rest Cycle
                </p>
                <p className="mt-2 text-sm text-white/46">Sleep Duration Input</p>
              </div>
              <MoonIcon className="h-4.5 w-4.5 text-white/50" />
            </div>

            <div className="mt-6 flex items-end gap-3">
              <div className="bg-black/72 px-4 py-2.5 font-display text-[2.2rem] font-semibold leading-none tracking-[-0.04em] text-white">
                {sleepHours.toFixed(1)}
              </div>
              <span className="pb-2 text-xl uppercase tracking-[0.02em] text-white/28">
                HRS
              </span>
            </div>

            <div className="mt-6">
              <input
                aria-label="Sleep duration in hours"
                className="sleep-slider"
                type="range"
                min="4"
                max="10"
                step="0.5"
                value={sleepHours}
                onChange={(event) => setSleepHours(Number(event.target.value))}
              />

              <div className="mt-4 flex gap-2">
                {progressTicks.map((tick) => (
                  <span
                    key={tick}
                    className="h-[3px] flex-1 rounded-full bg-white/16"
                    style={{
                      background:
                        tick <= Math.round(sleepHours - 4)
                          ? "rgba(143, 245, 255, 0.92)"
                          : "rgba(255,255,255,0.15)",
                    }}
                  />
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-[0.25rem] bg-surface-high p-5 shadow-[0_20px_44px_rgba(0,0,0,0.22)]">
            <p className="font-display text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-primary/70">
              Cognitive Load
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {cognitiveStates.map(({ id, label, icon: Icon, description }) => {
                const selected = id === state;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setState(id)}
                    className={`group flex min-h-[88px] flex-col items-start justify-between rounded-[0.2rem] border px-3 py-3 text-left ${
                      selected
                        ? "border-primary/48 bg-black/78 text-white shadow-[0_0_0_1px_rgba(143,245,255,0.14),0_0_28px_rgba(143,245,255,0.08)]"
                        : "border-white/[0.06] bg-black/58 text-white/38 hover:border-white/[0.14] hover:text-white/72"
                    }`}
                    aria-pressed={selected}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <div>
                      <div className="font-display text-[0.58rem] uppercase tracking-[0.18em]">
                        {label}
                      </div>
                      <div className="mt-1 text-[0.56rem] uppercase tracking-[0.12em] text-white/30 group-hover:text-white/42">
                        {description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </article>
        </div>

        <form
          className="rounded-[0.25rem] bg-surface-high p-5 shadow-[0_20px_44px_rgba(0,0,0,0.22)] sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (minimumReached) {
              setLaunched(true);
            }
          }}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-display text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-primary/70">
                Gratitude Manifest
              </p>
            </div>
            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/22">
              Minimum 20 Words Required
            </div>
          </div>

          <div className="mt-4 rounded-[0.15rem] bg-black/78 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
            <textarea
              className="manifest-scrollbar min-h-[172px] w-full resize-none bg-transparent text-lg leading-8 text-white/92 outline-none placeholder:text-white/22"
              placeholder="Document the specific anchors of your gratitude for this deployment..."
              value={manifest}
              onChange={(event) => {
                setManifest(event.target.value);
                if (launched) {
                  setLaunched(false);
                }
              }}
            />
          </div>

          <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3 text-sm text-white/34">
              <div className="flex h-10 w-10 items-center justify-center rounded-[0.25rem] bg-white/[0.05] text-primary">
                <SparkIcon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p>
                  Focusing on the positive increases cognitive resilience by{" "}
                  <span className="text-white/72">{resilienceBoost}%</span>.
                </p>
                <p className="mt-1 text-[0.72rem] uppercase tracking-[0.16em] text-white/22">
                  {activeState.label} protocol selected · {manifestLength} chars
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={!minimumReached}
              className={`inline-flex min-h-[48px] items-center justify-center rounded-[0.2rem] px-8 text-[0.82rem] font-semibold uppercase tracking-[0.24em] ${
                minimumReached
                  ? "bg-[linear-gradient(135deg,var(--primary),var(--primary-container))] text-[#0b1112] shadow-[0_0_28px_rgba(143,245,255,0.16)] hover:translate-y-[-1px]"
                  : "cursor-not-allowed bg-white/[0.08] text-white/26"
              }`}
            >
              {launched ? "Day Active" : "Commence Day"}
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-4 rounded-[0.25rem] border border-white/[0.03] bg-black/22 px-4 py-5 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-[0.56rem] uppercase tracking-[0.22em] text-white/18">
            Kernel Version
          </p>
          <p className="mt-1 font-display text-lg tracking-[-0.03em] text-white/82">
            ALPHA_v2.0.4
          </p>
        </div>

        <div>
          <p className="text-[0.56rem] uppercase tracking-[0.22em] text-white/18">
            Global Rank
          </p>
          <p className="mt-1 font-display text-lg tracking-[-0.03em] text-white/82">
            #1,402 / 50K
          </p>
        </div>

        <div>
          <p className="text-[0.56rem] uppercase tracking-[0.22em] text-white/18">
            Daily Streak
          </p>
          <p className="mt-1 font-display text-lg tracking-[-0.03em] text-white/82">
            42 Days Active
          </p>
        </div>

        <div className="flex items-center justify-start gap-2 xl:justify-end">
          <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px_rgba(143,245,255,0.8)]" />
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/54">
            Uplink Stable
          </p>
        </div>
      </section>
    </div>
  );
}
