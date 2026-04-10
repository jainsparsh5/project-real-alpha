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
    id: "sleepy",
    label: "SLEEPY",
    icon: MoonIcon,
    description: "Rest mode recommended",
  },
  {
    id: "energized",
    label: "ENERGIZED",
    icon: BoltIcon,
    description: "Peak output window active",
  },
  {
    id: "foggy",
    label: "FOGGY",
    icon: BatteryIcon,
    description: "Mental clarity low - take a break",
  },
] as const;

const progressTicks = [0, 1, 2, 3, 4, 5];

export default function LaunchpadDashboard() {
  const [sleepHours, setSleepHours] = useState(7.5);
  const [wakeTime, setWakeTime] = useState("");
  const [manifest, setManifest] = useState("");
  const [state, setState] =
    useState<(typeof cognitiveStates)[number]["id"]>("energized");
  const [launched, setLaunched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const currentDateLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(new Date());
  }, []);

  const wakeTimeLabel = useMemo(() => {
    if (!wakeTime) {
      return "Set wake up time";
    }

    const [hours, minutes] = wakeTime.split(":").map(Number);
    const meridiem = hours >= 12 ? "PM" : "AM";
    const normalizedHours = hours % 12 === 0 ? 12 : hours % 12;
    const paddedMinutes = minutes.toString().padStart(2, "0");

    return `${normalizedHours}:${paddedMinutes} ${meridiem}`;
  }, [wakeTime]);

  const manifestLength = manifest.trim().length;
  const minimumReached = manifestLength >= 20;

  const resilienceBoost = useMemo(() => {
    const baseline = state === "energized" ? 14 : state === "sleepy" ? 8 : 6;
    return baseline + Math.min(8, Math.floor(manifestLength / 24));
  }, [manifestLength, state]);

  const activeState = cognitiveStates.find((item) => item.id === state)!;

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-sm border border-white/4 bg-[radial-gradient(circle_at_top_left,rgba(143,245,255,0.06),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.018),rgba(255,255,255,0.008)),#101011] px-5 py-8 shadow-[0_32px_90px_rgba(0,0,0,0.34)] sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] bg-[radial-gradient(circle_at_40%_20%,rgba(255,255,255,0.03),transparent_35%),linear-gradient(180deg,transparent,rgba(255,255,255,0.02),transparent)] lg:block" />
        <div className="pointer-events-none absolute right-[14%] top-8 hidden h-28 w-28 rounded-full border border-white/2 lg:block" />
        <div className="pointer-events-none absolute right-[12%] top-14 hidden h-px w-44 bg-white/4 lg:block" />
        <div className="pointer-events-none absolute right-[18%] top-[7.4rem] hidden h-20 w-36 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent)] mask-[repeating-linear-gradient(90deg,#000_0_7px,transparent_7px_18px)] lg:block" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-display text-[0.78rem] uppercase tracking-[0.42em] text-primary/80">
              Start your day with intention
            </p>
            <h1 className="mt-4 font-display text-[3rem] font-semibold tracking-[-0.05em] text-white sm:text-[4.6rem] sm:leading-[0.94]">
              Rise &amp; Grind
            </h1>

            <div className="mt-3 text-white/58">
              <span className="font-display text-[2rem] tracking-[-0.04em] sm:text-[2.7rem]">
                {currentDateLabel}
              </span>
            </div>
          </div>

          <div className="w-full max-w-[320px] self-start lg:self-end">
            <div className="rounded-sm border border-white/6 bg-black/54 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.24)] backdrop-blur-sm">
              <p className="font-display text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-primary/80">
                Wake Time
              </p>
              <label className="mt-3 block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/28">
                Set wake up time
              </label>
              <input
                aria-label="Set wake up time"
                className="mt-2 w-full rounded-[0.18rem] border border-white/8 bg-black/82 px-3 py-3 font-display text-[1.15rem] tracking-[-0.03em] text-white outline-none transition focus:border-primary/60 focus:shadow-[0_0_0_1px_rgba(143,245,255,0.12)]"
                type="time"
                value={wakeTime}
                onChange={(event) => setWakeTime(event.target.value)}
              />
              <p className="mt-3 text-[0.76rem] uppercase tracking-[0.2em] text-white/34">
                {wakeTime ? `King woke up at ${wakeTimeLabel}` : "Set wake up time"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[220px_1fr]">
        <div className="grid gap-4">
          <article className="rounded-sm bg-surface-high p-5 shadow-[0_20px_44px_rgba(0,0,0,0.22)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-primary/70">
                  How well did you sleep last night?
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
                    className="h-0.75 flex-1 rounded-full bg-white/16"
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

          <article className="rounded-sm bg-surface-high p-5 shadow-[0_20px_44px_rgba(0,0,0,0.22)]">
            <p className="font-display text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-primary/70">
              Energy Check
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {cognitiveStates.map(({ id, label, icon: Icon, description }) => {
                const selected = id === state;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setState(id)}
                    className={`group flex min-h-22 flex-col items-start justify-between rounded-[0.2rem] border px-3 py-3 text-left ${
                      selected
                        ? "border-primary/48 bg-black/78 text-white shadow-[0_0_0_1px_rgba(143,245,255,0.14),0_0_28px_rgba(143,245,255,0.08)]"
                        : "border-white/6 bg-black/58 text-white/38 hover:border-white/14 hover:text-white/72"
                    }`}
                    aria-pressed={selected}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <div>
                      <div className="font-display text-[0.58rem] uppercase tracking-[0.18em]">
                        {id === "sleepy" ? "😴 " : id === "energized" ? "⚡ " : "😵 "}
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
          className="rounded-sm bg-surface-high p-5 shadow-[0_20px_44px_rgba(0,0,0,0.22)] sm:p-6"
          onSubmit={async (event) => {
            event.preventDefault();

            if (!minimumReached || isSubmitting) {
              return;
            }

            setIsSubmitting(true);
            setSubmitError("");
            setSubmitSuccess("");

            try {
              const response = await fetch("/api/leads", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  sleepHours,
                  wakeTime,
                  manifest,
                  state,
                  resilienceBoost,
                }),
              });

              const payload = (await response.json()) as {
                success?: boolean;
                message?: string;
              };

              if (!response.ok || !payload.success) {
                throw new Error(payload.message || "Could not save your entry.");
              }

              setLaunched(true);
              setSubmitSuccess("Entry saved to backend.");
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "Failed to connect to backend.";

              setSubmitError(message);
              setLaunched(false);
            } finally {
              setIsSubmitting(false);
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
              className="manifest-scrollbar min-h-43 w-full resize-none bg-transparent text-lg leading-8 text-white/92 outline-none placeholder:text-white/22"
              placeholder="Write one thing you're grateful for today..."
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
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-white/5 text-primary">
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
              disabled={!minimumReached || isSubmitting}
              className={`inline-flex min-h-12 items-center justify-center rounded-[0.2rem] px-8 text-[0.82rem] font-semibold uppercase tracking-[0.24em] ${
                minimumReached && !isSubmitting
                  ? "bg-[linear-gradient(135deg,var(--primary),var(--primary-container))] text-[#0b1112] shadow-[0_0_28px_rgba(143,245,255,0.16)] hover:-translate-y-px"
                  : "cursor-not-allowed bg-white/8 text-white/26"
              }`}
            >
              {isSubmitting
                ? "Saving..."
                : launched
                  ? "Day Active"
                  : "Commence Day"}
            </button>
          </div>

          {submitError ? (
            <p className="mt-3 text-sm text-red-300">{submitError}</p>
          ) : null}

          {submitSuccess ? (
            <p className="mt-3 text-sm text-primary">{submitSuccess}</p>
          ) : null}
        </form>
      </section>

      <section className="grid gap-4 rounded-sm border border-white/3 bg-black/22 px-4 py-5 sm:grid-cols-2 xl:grid-cols-4">
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
