"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  BatteryIcon,
  BoltIcon,
  MoonIcon,
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
const defaultSleepDurationHours = 7.5;

type RiseAndGrindEntry = {
  wakeUpTime: string;
  sleepDurationHours: number;
  mood?: (typeof cognitiveStates)[number]["id"];
  state?: (typeof cognitiveStates)[number]["id"];
  gratitude: string;
};

export default function LaunchpadDashboard() {
  const { isLoaded, isSignedIn } = useAuth();
  const [sleepDurationHours, setSleepDurationHours] = useState(
    defaultSleepDurationHours
  );
  const [wakeTime, setWakeTime] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [entryDate, setEntryDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [state, setState] =
    useState<(typeof cognitiveStates)[number]["id"]>("energized");
  const [launched, setLaunched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEntry, setIsLoadingEntry] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const resetEntryFormState = useCallback(() => {
    setWakeTime("");
    setSleepDurationHours(defaultSleepDurationHours);
    setState("energized");
    setGratitude("");
    setLaunched(false);
    setSubmitSuccess("");
    setSubmitError("");
  }, []);

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

  const gratitudeLength = gratitude.trim().length;
  const minimumReached = gratitudeLength >= 8;

  const wakeSet = wakeTime.length > 0;

  useEffect(() => {
    if (!entryDate || !isLoaded || !isSignedIn) {
      return;
    }

    let isCancelled = false;

    const loadEntryForDate = async () => {
      setIsLoadingEntry(true);

      try {
        const response = await fetch(
          `/api/riseandgrind?date=${encodeURIComponent(entryDate)}`,
          {
            cache: "no-store",
          }
        );

        if (response.status === 401) {
          if (!isCancelled) {
            resetEntryFormState();
          }
          return;
        }

        const payload = (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: RiseAndGrindEntry[];
        };

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Could not load saved entry.");
        }

        if (isCancelled) {
          return;
        }

        const entry = payload.data?.[0];

        if (!entry) {
          resetEntryFormState();
          return;
        }

        const entryMood = entry.mood || entry.state;
        const moodIsValid = cognitiveStates.some(({ id }) => id === entryMood);

        setWakeTime(entry.wakeUpTime || "");
        setSleepDurationHours(
          Number.isFinite(Number(entry.sleepDurationHours))
            ? Number(entry.sleepDurationHours)
            : defaultSleepDurationHours
        );
        setState(moodIsValid ? entryMood! : "energized");
        setGratitude(entry.gratitude || "");
        setLaunched(true);
        setSubmitSuccess("Loaded your saved entry for this date.");
        setSubmitError("");
      } catch (error) {
        if (!isCancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to load saved entry.";
          setSubmitError(message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingEntry(false);
        }
      }
    };

    void loadEntryForDate();

    return () => {
      isCancelled = true;
    };
  }, [entryDate, isLoaded, isSignedIn, resetEntryFormState]);

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
                Wake and Date
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

              <label className="mt-3 block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/28">
                Select date
              </label>
              <input
                aria-label="Select entry date"
                className="mt-2 w-full rounded-[0.18rem] border border-white/8 bg-black/82 px-3 py-3 font-display text-[1.15rem] tracking-[-0.03em] text-white outline-none transition focus:border-primary/60 focus:shadow-[0_0_0_1px_rgba(143,245,255,0.12)]"
                type="date"
                value={entryDate}
                onChange={(event) => setEntryDate(event.target.value)}
              />

              <p className="mt-3 text-[0.76rem] uppercase tracking-[0.2em] text-white/34">
                {wakeSet ? `Wake ${wakeTimeLabel}` : "Set wake time"}
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
                {sleepDurationHours.toFixed(1)}
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
                value={sleepDurationHours}
                onChange={(event) =>
                  setSleepDurationHours(Number(event.target.value))
                }
              />

              <div className="mt-4 flex gap-2">
                {progressTicks.map((tick) => (
                  <span
                    key={tick}
                    className="h-0.75 flex-1 rounded-full bg-white/16"
                    style={{
                      background:
                        tick <= Math.round(sleepDurationHours - 4)
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

            if (!isLoaded) {
              return;
            }

            if (!isSignedIn) {
              const redirectUrl = encodeURIComponent("/");
              window.location.assign(`/sign-in?redirect_url=${redirectUrl}`);
              return;
            }

            if (
              !minimumReached ||
              isSubmitting ||
              isLoadingEntry ||
              !wakeSet ||
              !entryDate
            ) {
              return;
            }

            setIsSubmitting(true);
            setSubmitError("");
            setSubmitSuccess("");

            try {
              const response = await fetch("/api/riseandgrind", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  wakeUpTime: wakeTime,
                  sleepDurationHours,
                  date: entryDate,
                  mood: state,
                  gratitude,
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
              setSubmitSuccess("Entry saved for this date.");
              setSubmitError("");
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
              Minimum 8 Characters Required
            </div>
          </div>

          <div className="mt-4 rounded-[0.15rem] bg-black/78 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
            <textarea
              className="manifest-scrollbar min-h-43 w-full resize-none bg-transparent text-lg leading-8 text-white/92 outline-none placeholder:text-white/22"
              placeholder="Write one thing you're grateful for today..."
              value={gratitude}
              onChange={(event) => {
                setGratitude(event.target.value);
                if (launched) {
                  setLaunched(false);
                }
              }}
            />
          </div>

          <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3 text-sm text-white/34">
              <div>
                <p>
                  Mood selected: <span className="text-white/72">{state}</span>
                </p>
                <p className="mt-1 text-[0.72rem] uppercase tracking-[0.16em] text-white/22">
                  {sleepDurationHours.toFixed(1)} hrs planned sleep
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                !minimumReached ||
                isSubmitting ||
                isLoadingEntry ||
                !wakeSet ||
                !entryDate
              }
              className={`inline-flex min-h-12 items-center justify-center rounded-[0.2rem] px-8 text-[0.82rem] font-semibold uppercase tracking-[0.24em] ${
                minimumReached &&
                !isSubmitting &&
                !isLoadingEntry &&
                wakeSet &&
                !!entryDate
                  ? "bg-[linear-gradient(135deg,var(--primary),var(--primary-container))] text-[#0b1112] shadow-[0_0_28px_rgba(143,245,255,0.16)] hover:-translate-y-px"
                  : "cursor-not-allowed bg-white/8 text-white/26"
              }`}
            >
              {isLoadingEntry
                ? "Loading..."
                : isSubmitting
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
    </div>
  );
}
