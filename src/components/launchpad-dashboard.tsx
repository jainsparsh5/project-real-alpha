"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ActivityIcon,
  BatteryIcon,
  BoltIcon,
  FlameIcon,
  LotusIcon,
  MoonIcon,
  SparkIcon,
  StackIcon,
  TrophyIcon,
  WaveIcon,
} from "@/components/command-icons";

const cognitiveStates = [
  {
    id: "sleepy",
    label: "Sleepy",
    icon: MoonIcon,
    description: "Lower intensity, protect recovery.",
    score: 14,
  },
  {
    id: "energized",
    label: "Energized",
    icon: BoltIcon,
    description: "Push the primary objective.",
    score: 28,
  },
  {
    id: "foggy",
    label: "Foggy",
    icon: BatteryIcon,
    description: "Reduce noise, regain clarity.",
    score: 18,
  },
] as const;

const protocolPillars = [
  {
    id: "sleep",
    label: "Sleep",
    icon: MoonIcon,
    metric: "Bedtime lock",
    detail: "Protect the final 30 minutes and keep wake time honest.",
  },
  {
    id: "body",
    label: "Body",
    icon: FlameIcon,
    metric: "Training signal",
    detail: "Gym, walk, mobility, or clean nutrition action.",
  },
  {
    id: "focus",
    label: "Focus",
    icon: StackIcon,
    metric: "Deep block",
    detail: "One clean work sprint before drift takes the wheel.",
  },
  {
    id: "connection",
    label: "Connection",
    icon: WaveIcon,
    metric: "Brotherhood touch",
    detail: "One message, call, or honest check-in with a real person.",
  },
] as const;

const eveningChecks = [
  "Moved body",
  "Protected focus",
  "Controlled impulses",
  "Reached out",
];

const progressTicks = [0, 1, 2, 3, 4, 5];
const defaultSleepDurationHours = 7.5;

type Mood = (typeof cognitiveStates)[number]["id"];
type ProtocolPillar = (typeof protocolPillars)[number]["id"];

type RiseAndGrindEntry = {
  wakeUpTime: string;
  sleepDurationHours: number;
  mood?: Mood;
  state?: Mood;
  gratitude: string;
};

type CoachCard = {
  readout: string;
  todayPlan: string[];
  habitTweaks: string[];
  riskFlags: string[];
  brotherhoodChallenge: string;
  checkInQuestion: string;
  safetyNote: string;
};

type CoachCardDocument = {
  card?: CoachCard;
  source?: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function SkeletonBlock({
  className,
  label,
}: {
  className: string;
  label?: string;
}) {
  return (
    <span
      aria-label={label}
      className={cx(
        "block animate-pulse rounded-[0.16rem] bg-[linear-gradient(90deg,rgba(255,255,255,0.045),rgba(143,245,255,0.09),rgba(255,255,255,0.045))] bg-[length:220%_100%]",
        className
      )}
    />
  );
}

function CoachCardSkeleton() {
  return (
    <div className="min-h-[440px]">
      <div className="flex gap-2">
        <SkeletonBlock className="h-6 w-24" />
        <SkeletonBlock className="h-6 w-36" />
      </div>

      <div className="mt-5 space-y-3">
        <SkeletonBlock className="h-5 w-full" />
        <SkeletonBlock className="h-5 w-11/12" />
        <SkeletonBlock className="h-5 w-8/12" />
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-[0.18rem] bg-white/[0.035] p-4">
            <SkeletonBlock className="h-4 w-24" />
            <div className="mt-5 space-y-3">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-10/12" />
              <SkeletonBlock className="h-4 w-9/12" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[0.18rem] bg-primary/10 p-4">
          <SkeletonBlock className="h-4 w-40" />
          <SkeletonBlock className="mt-5 h-5 w-11/12" />
          <SkeletonBlock className="mt-3 h-5 w-8/12" />
        </div>
        <div className="rounded-[0.18rem] bg-white/[0.035] p-4">
          <SkeletonBlock className="h-4 w-40" />
          <SkeletonBlock className="mt-5 h-5 w-full" />
          <SkeletonBlock className="mt-3 h-5 w-7/12" />
        </div>
      </div>
    </div>
  );
}

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
  const [state, setState] = useState<Mood>("energized");
  const [focusPillar, setFocusPillar] = useState<ProtocolPillar>("focus");
  const [launched, setLaunched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEntry, setIsLoadingEntry] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [coachCard, setCoachCard] = useState<CoachCard | null>(null);
  const [coachSource, setCoachSource] = useState("");
  const [isLoadingCoachCard, setIsLoadingCoachCard] = useState(false);
  const [isGeneratingCoachCard, setIsGeneratingCoachCard] = useState(false);
  const [coachError, setCoachError] = useState("");
  const [coachSuccess, setCoachSuccess] = useState("");

  const resetEntryFormState = useCallback(() => {
    setWakeTime("");
    setSleepDurationHours(defaultSleepDurationHours);
    setState("energized");
    setGratitude("");
    setFocusPillar("focus");
    setLaunched(false);
    setSubmitSuccess("");
    setSubmitError("");
  }, []);

  const resetCoachCardState = useCallback(() => {
    setCoachCard(null);
    setCoachSource("");
    setCoachSuccess("");
    setCoachError("");
  }, []);

  const currentDateLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(new Date(`${entryDate}T00:00:00`));
  }, [entryDate]);

  const wakeTimeLabel = useMemo(() => {
    if (!wakeTime) {
      return "Unset";
    }

    const [hours, minutes] = wakeTime.split(":").map(Number);
    const meridiem = hours >= 12 ? "PM" : "AM";
    const normalizedHours = hours % 12 === 0 ? 12 : hours % 12;
    const paddedMinutes = minutes.toString().padStart(2, "0");

    return `${normalizedHours}:${paddedMinutes} ${meridiem}`;
  }, [wakeTime]);

  const selectedState = cognitiveStates.find(({ id }) => id === state);
  const selectedPillar = protocolPillars.find(({ id }) => id === focusPillar);
  const gratitudeLength = gratitude.trim().length;
  const minimumReached = gratitudeLength >= 8;
  const wakeSet = wakeTime.length > 0;
  const readinessScore = Math.min(
    100,
    Math.round(
      Math.max(10, Math.min(42, sleepDurationHours * 5)) +
        (selectedState?.score || 0) +
        (wakeSet ? 12 : 0) +
        (minimumReached ? 18 : Math.min(12, gratitudeLength))
    )
  );
  const completionLabel = launched ? "Command Saved" : "Morning Open";
  const isEntryHydrating = isLoadingEntry && !isSubmitting;
  const isCoachCardBusy = isLoadingCoachCard || isGeneratingCoachCard;

  const loadCoachCardForDate = useCallback(
    async (date: string) => {
      if (!date || !isLoaded || !isSignedIn) {
        resetCoachCardState();
        return;
      }

      setIsLoadingCoachCard(true);
      resetCoachCardState();
      setCoachError("");

      try {
        const response = await fetch(
          `/api/coach/daily?date=${encodeURIComponent(date)}&phase=morning`,
          {
            cache: "no-store",
          }
        );

        if (response.status === 401) {
          resetCoachCardState();
          return;
        }

        const payload = (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: CoachCardDocument[];
        };

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "Could not load coach card.");
        }

        const savedCard = payload.data?.[0];

        if (!savedCard?.card) {
          resetCoachCardState();
          return;
        }

        setCoachCard(savedCard.card);
        setCoachSource(savedCard.source || "stored");
        setCoachSuccess("Coach card loaded.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load coach card.";

        setCoachError(message);
      } finally {
        setIsLoadingCoachCard(false);
      }
    },
    [isLoaded, isSignedIn, resetCoachCardState]
  );

  const generateCoachCard = useCallback(
    async ({ force = false }: { force?: boolean } = {}) => {
      if (!isLoaded) {
        return;
      }

      if (!isSignedIn) {
        const redirectUrl = encodeURIComponent("/");
        window.location.assign(`/sign-in?redirect_url=${redirectUrl}`);
        return;
      }

      if (!entryDate || isGeneratingCoachCard) {
        return;
      }

      setIsGeneratingCoachCard(true);
      resetCoachCardState();
      setCoachError("");
      setCoachSuccess("");

      try {
        const response = await fetch("/api/coach/daily", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: entryDate,
            phase: "morning",
            force,
            userNote: [
              gratitude.trim(),
              selectedPillar ? `Today pillar: ${selectedPillar.label}` : "",
            ]
              .filter(Boolean)
              .join("\n"),
          }),
        });

        if (response.status === 401) {
          const redirectUrl = encodeURIComponent("/");
          window.location.assign(`/sign-in?redirect_url=${redirectUrl}`);
          return;
        }

        const payload = (await response.json()) as {
          success?: boolean;
          generated?: boolean;
          source?: string;
          message?: string;
          data?: CoachCardDocument;
        };

        if (!response.ok || !payload.success || !payload.data?.card) {
          throw new Error(payload.message || "Could not generate coach card.");
        }

        setCoachCard(payload.data.card);
        setCoachSource(payload.source || payload.data.source || "stored");
        setCoachSuccess(
          payload.generated ? "Coach card ready." : "Saved coach card loaded."
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to generate coach card.";

        setCoachError(message);
      } finally {
        setIsGeneratingCoachCard(false);
      }
    },
    [
      entryDate,
      gratitude,
      isGeneratingCoachCard,
      isLoaded,
      isSignedIn,
      selectedPillar,
      resetCoachCardState,
    ]
  );

  const saveMorningCommand = async () => {
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
      setSubmitSuccess("Morning command saved.");
      setSubmitError("");
      void generateCoachCard({ force: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to connect to backend.";

      setSubmitError(message);
      setLaunched(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!entryDate || !isLoaded || !isSignedIn) {
      return;
    }

    let isCancelled = false;

    const loadEntryForDate = async () => {
      setIsLoadingEntry(true);
      resetEntryFormState();

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
        setSubmitSuccess("Saved command loaded.");
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

  useEffect(() => {
    void loadCoachCardForDate(entryDate);
  }, [entryDate, loadCoachCardForDate]);

  return (
    <div className="flex flex-col gap-5">
      <section className="relative overflow-hidden rounded-sm bg-[#101011] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.34),inset_0_0_0_1px_rgba(255,255,255,0.035)] sm:p-7">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--primary),rgba(154,253,168,0.78),rgba(255,255,255,0.18))]" />
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-primary/76">
              Daily Operating System
            </p>
            <h1 className="mt-3 max-w-4xl font-display text-[2.65rem] font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-[4.6rem]">
              AI Brotherhood Coach
            </h1>
            <div className="mt-5 flex flex-wrap gap-2">
              {isEntryHydrating ? (
                <>
                  <SkeletonBlock className="h-8 w-36" />
                  <SkeletonBlock className="h-8 w-28" />
                  <SkeletonBlock className="h-8 w-24" />
                  <SkeletonBlock className="h-8 w-28" />
                </>
              ) : (
                [
                  currentDateLabel,
                  `Wake ${wakeTimeLabel}`,
                  selectedState?.label || "State",
                  selectedPillar?.label || "Focus",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-[0.18rem] bg-white/[0.045] px-3 py-2 font-display text-[0.62rem] uppercase tracking-[0.18em] text-white/56"
                  >
                    {item}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[0.2rem] bg-black/56 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035)]">
              <p className="font-display text-[0.58rem] uppercase tracking-[0.2em] text-white/34">
                Readiness
              </p>
              {isEntryHydrating ? (
                <div className="mt-5">
                  <SkeletonBlock className="h-12 w-24" />
                </div>
              ) : (
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-display text-5xl font-semibold tracking-[-0.05em] text-white">
                    {readinessScore}
                  </span>
                  <span className="pb-2 text-sm uppercase text-white/30">
                    /100
                  </span>
                </div>
              )}
            </div>

            <div className="rounded-[0.2rem] bg-black/56 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035)]">
              <p className="font-display text-[0.58rem] uppercase tracking-[0.2em] text-white/34">
                Status
              </p>
              {isEntryHydrating ? (
                <div className="mt-5 space-y-4">
                  <SkeletonBlock className="h-8 w-32" />
                  <SkeletonBlock className="h-4 w-36" />
                </div>
              ) : (
                <>
                  <div className="mt-5 inline-flex rounded-[0.18rem] bg-primary/12 px-3 py-2 font-display text-[0.65rem] uppercase tracking-[0.18em] text-primary">
                    {completionLabel}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/42">
                    {coachCard ? "Coach online" : "Coach awaiting signal"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">
        <form
          className="rounded-sm bg-surface-high p-5 shadow-[0_20px_44px_rgba(0,0,0,0.22)]"
          onSubmit={(event) => {
            event.preventDefault();
            void saveMorningCommand();
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-primary/70">
                Morning Command
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-white">
                Set the day
              </h2>
            </div>
            <SparkIcon className="h-5 w-5 text-primary/70" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <label className="block">
              <span className="font-display text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/34">
                Wake Time
              </span>
              <input
                aria-label="Set wake up time"
                className="mt-2 w-full rounded-[0.18rem] border border-white/8 bg-black/70 px-3 py-3 font-display text-[1.02rem] tracking-[-0.03em] text-white outline-none transition focus:border-primary/60 focus:shadow-[0_0_0_1px_rgba(143,245,255,0.12)]"
                type="time"
                value={wakeTime}
                onChange={(event) => {
                  setWakeTime(event.target.value);
                  setLaunched(false);
                }}
              />
            </label>

            <label className="block">
              <span className="font-display text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/34">
                Date
              </span>
              <input
                aria-label="Select entry date"
                className="mt-2 w-full rounded-[0.18rem] border border-white/8 bg-black/70 px-3 py-3 font-display text-[1.02rem] tracking-[-0.03em] text-white outline-none transition focus:border-primary/60 focus:shadow-[0_0_0_1px_rgba(143,245,255,0.12)]"
                type="date"
                value={entryDate}
                onChange={(event) => setEntryDate(event.target.value)}
              />
            </label>
          </div>

          <div className="mt-5 rounded-[0.18rem] bg-black/48 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/34">
                  Sleep
                </p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="font-display text-4xl font-semibold tracking-[-0.04em] text-white">
                    {sleepDurationHours.toFixed(1)}
                  </span>
                  <span className="pb-1 text-sm uppercase text-white/30">hrs</span>
                </div>
              </div>
              <MoonIcon className="h-5 w-5 text-white/42" />
            </div>
            <input
              aria-label="Sleep duration in hours"
              className="sleep-slider mt-5"
              type="range"
              min="4"
              max="10"
              step="0.5"
              value={sleepDurationHours}
              onChange={(event) => {
                setSleepDurationHours(Number(event.target.value));
                setLaunched(false);
              }}
            />
            <div className="mt-4 flex gap-2">
              {progressTicks.map((tick) => (
                <span
                  key={tick}
                  className="h-0.75 flex-1 rounded-full"
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

          <div className="mt-5">
            <p className="font-display text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/34">
              State
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {cognitiveStates.map(({ id, label, icon: Icon, description }) => {
                const selected = id === state;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setState(id);
                      setLaunched(false);
                    }}
                    className={cx(
                      "group flex min-h-24 flex-col items-start justify-between rounded-[0.18rem] px-3 py-3 text-left",
                      selected
                        ? "bg-black/76 text-white shadow-[inset_0_0_0_1px_rgba(143,245,255,0.42),0_0_28px_rgba(143,245,255,0.08)]"
                        : "bg-black/44 text-white/42 hover:bg-black/62 hover:text-white/74"
                    )}
                    aria-pressed={selected}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span className="font-display text-[0.56rem] uppercase tracking-[0.16em]">
                      {label}
                    </span>
                    <span className="text-[0.56rem] leading-4 text-white/32 group-hover:text-white/44">
                      {description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5">
            <p className="font-display text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/34">
              Pillar Focus
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {protocolPillars.map(({ id, label, icon: Icon }) => {
                const selected = id === focusPillar;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setFocusPillar(id);
                      setLaunched(false);
                    }}
                    className={cx(
                      "flex items-center gap-2 rounded-[0.18rem] px-3 py-3 text-left font-display text-[0.62rem] uppercase tracking-[0.18em]",
                      selected
                        ? "bg-primary/14 text-primary shadow-[inset_0_0_0_1px_rgba(143,245,255,0.24)]"
                        : "bg-black/44 text-white/42 hover:bg-black/62 hover:text-white/74"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="mt-5 block">
            <span className="font-display text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/34">
              Gratitude / Grounding
            </span>
            <textarea
              className="manifest-scrollbar mt-2 min-h-36 w-full resize-none rounded-[0.18rem] bg-black/70 p-4 text-base leading-7 text-white/90 outline-none placeholder:text-white/24 focus:shadow-[0_0_0_1px_rgba(143,245,255,0.28)]"
              placeholder="Name one thing worth protecting today..."
              value={gratitude}
              onChange={(event) => {
                setGratitude(event.target.value);
                setLaunched(false);
              }}
            />
          </label>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[0.72rem] uppercase tracking-[0.16em] text-white/30">
              {gratitudeLength}/8 minimum signal
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
              className={cx(
                "inline-flex min-h-12 items-center justify-center gap-2 rounded-[0.2rem] px-6 text-[0.76rem] font-semibold uppercase tracking-[0.2em]",
                minimumReached &&
                  !isSubmitting &&
                  !isLoadingEntry &&
                  wakeSet &&
                  !!entryDate
                  ? "bg-[linear-gradient(135deg,var(--primary),var(--primary-container))] text-[#0b1112] shadow-[0_0_28px_rgba(143,245,255,0.16)] hover:-translate-y-px"
                  : "cursor-not-allowed bg-white/8 text-white/26"
              )}
            >
              <TrophyIcon className="h-4 w-4" />
              {isLoadingEntry
                ? "Loading"
                : isSubmitting
                  ? "Saving"
                  : launched
                    ? "Saved"
                    : "Lock Command"}
            </button>
          </div>

          <div aria-live="polite" className="mt-3 min-h-5">
            {submitError ? (
              <p className="text-sm text-red-300">{submitError}</p>
            ) : submitSuccess ? (
              <p className="text-sm text-primary">{submitSuccess}</p>
            ) : null}
          </div>
        </form>

        <article className="rounded-sm bg-surface-high p-5 shadow-[0_20px_44px_rgba(0,0,0,0.22)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="font-display text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-primary/70">
                Coach Card
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                Today&apos;s orders
              </h2>
            </div>

            <button
              type="button"
              onClick={() => void generateCoachCard({ force: true })}
              disabled={
                !isLoaded ||
                isGeneratingCoachCard ||
                isLoadingCoachCard ||
                !entryDate ||
                !launched
              }
              className={cx(
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.2rem] px-5 text-[0.72rem] font-semibold uppercase tracking-[0.18em]",
                isLoaded &&
                  !isGeneratingCoachCard &&
                  !isLoadingCoachCard &&
                  !!entryDate &&
                  launched
                  ? "bg-[linear-gradient(135deg,var(--primary),var(--primary-container))] text-[#0b1112] shadow-[0_0_26px_rgba(143,245,255,0.14)] hover:-translate-y-px"
                  : "cursor-not-allowed bg-white/8 text-white/26"
              )}
            >
              <SparkIcon className="h-4 w-4" />
              {isGeneratingCoachCard
                ? "Generating"
                : coachCard
                  ? "Regenerate"
                  : "Generate"}
            </button>
          </div>

          <div
            aria-busy={isCoachCardBusy}
            className="mt-5 min-h-[520px] rounded-[0.18rem] bg-black/66 p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035)]"
          >
            {isCoachCardBusy ? (
              <CoachCardSkeleton />
            ) : coachCard ? (
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-[0.16rem] bg-primary/12 px-2.5 py-1 font-display text-[0.58rem] uppercase tracking-[0.2em] text-primary">
                    {coachSource || "stored"}
                  </span>
                  <span className="font-display text-[0.58rem] uppercase tracking-[0.18em] text-white/26">
                    Morning protocol
                  </span>
                </div>

                <p className="mt-4 max-w-4xl text-lg leading-8 text-white/88">
                  {coachCard.readout}
                </p>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <section className="rounded-[0.18rem] bg-white/[0.035] p-4">
                    <div className="flex items-center gap-2 font-display text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary/78">
                      <BoltIcon className="h-4 w-4" />
                      Plan
                    </div>
                    <ol className="mt-4 space-y-3 text-sm leading-6 text-white/72">
                      {coachCard.todayPlan.map((item, index) => (
                        <li key={`${item}-${index}`} className="flex gap-3">
                          <span className="font-display text-primary/80">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section className="rounded-[0.18rem] bg-white/[0.035] p-4">
                    <div className="flex items-center gap-2 font-display text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary/78">
                      <StackIcon className="h-4 w-4" />
                      Tweaks
                    </div>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-white/72">
                      {coachCard.habitTweaks.map((item) => (
                        <li key={item} className="bg-black/32 px-3 py-2">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-[0.18rem] bg-white/[0.035] p-4">
                    <div className="flex items-center gap-2 font-display text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary/78">
                      <BatteryIcon className="h-4 w-4" />
                      Risk
                    </div>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-white/72">
                      {coachCard.riskFlags.map((item) => (
                        <li key={item} className="bg-black/32 px-3 py-2">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <section className="rounded-[0.18rem] bg-primary/10 p-4">
                    <p className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary/80">
                      Brotherhood Challenge
                    </p>
                    <p className="mt-3 text-base leading-7 text-white/86">
                      {coachCard.brotherhoodChallenge}
                    </p>
                  </section>

                  <section className="rounded-[0.18rem] bg-white/[0.035] p-4">
                    <p className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary/80">
                      Check-In Question
                    </p>
                    <p className="mt-3 text-base leading-7 text-white/78">
                      {coachCard.checkInQuestion}
                    </p>
                  </section>
                </div>

                <p className="mt-4 text-xs leading-6 text-white/34">
                  {coachCard.safetyNote}
                </p>
              </div>
            ) : (
              <div className="flex min-h-[440px] flex-col justify-center">
                <p className="max-w-xl font-display text-3xl font-semibold tracking-[-0.04em] text-white/88">
                  Lock the morning command to wake the coach.
                </p>
                <p className="mt-4 max-w-lg text-sm leading-7 text-white/46">
                  The card will turn today&apos;s wake time, sleep, state,
                  gratitude, pillar, and recent history into practical orders.
                </p>
              </div>
            )}
          </div>

          <div aria-live="polite" className="mt-3 min-h-5">
            {coachError ? (
              <p className="text-sm text-red-300">{coachError}</p>
            ) : coachSuccess ? (
              <p className="text-sm text-primary">{coachSuccess}</p>
            ) : null}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <article className="rounded-sm bg-surface-high p-5 shadow-[0_20px_44px_rgba(0,0,0,0.22)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-primary/70">
                Active Protocols
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-white">
                Four pillars
              </h2>
            </div>
            <ActivityIcon className="h-5 w-5 text-primary/70" />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {isEntryHydrating ? [0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="min-h-48 rounded-[0.2rem] bg-black/54 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035)]"
              >
                <div className="flex items-center justify-between">
                  <SkeletonBlock className="h-5 w-5" />
                  <SkeletonBlock className="h-4 w-16" />
                </div>
                <SkeletonBlock className="mt-7 h-8 w-24" />
                <SkeletonBlock className="mt-5 h-4 w-32" />
                <SkeletonBlock className="mt-5 h-4 w-full" />
                <SkeletonBlock className="mt-3 h-4 w-10/12" />
              </div>
            )) : protocolPillars.map(({ id, label, icon: Icon, metric, detail }) => {
              const active = id === focusPillar;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setFocusPillar(id);
                    setLaunched(false);
                  }}
                  className={cx(
                    "min-h-48 rounded-[0.2rem] p-4 text-left shadow-[inset_0_0_0_1px_rgba(255,255,255,0.035)]",
                    active
                      ? "bg-primary/12 shadow-[inset_0_0_0_1px_rgba(143,245,255,0.26),0_0_28px_rgba(143,245,255,0.08)]"
                      : "bg-black/54 hover:bg-black/68"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <Icon
                      className={cx(
                        "h-5 w-5",
                        active ? "text-primary" : "text-white/42"
                      )}
                    />
                    <span className="font-display text-[0.58rem] uppercase tracking-[0.18em] text-white/28">
                      {active ? "Primary" : "Reserve"}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.04em] text-white">
                    {label}
                  </h3>
                  <p className="mt-3 font-display text-[0.62rem] uppercase tracking-[0.18em] text-primary/74">
                    {metric}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/48">{detail}</p>
                </button>
              );
            })}
          </div>
        </article>

        <article className="rounded-sm bg-surface-high p-5 shadow-[0_20px_44px_rgba(0,0,0,0.22)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-primary/70">
                PM Debrief
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-white">
                Close the loop
              </h2>
            </div>
            <LotusIcon className="h-5 w-5 text-primary/70" />
          </div>

          <div className="mt-5 grid gap-2">
            {eveningChecks.map((item) => (
              <label
                key={item}
                className="flex items-center gap-3 rounded-[0.18rem] bg-black/52 px-3 py-3 text-sm text-white/68"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[var(--primary)]"
                />
                {item}
              </label>
            ))}
          </div>

          <label className="mt-4 block">
            <span className="font-display text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/34">
              Win / Friction
            </span>
            <textarea
              className="manifest-scrollbar mt-2 min-h-28 w-full resize-none rounded-[0.18rem] bg-black/66 p-4 text-sm leading-6 text-white/82 outline-none placeholder:text-white/24 focus:shadow-[0_0_0_1px_rgba(143,245,255,0.28)]"
              placeholder="One win. One friction point. One adjustment."
            />
          </label>
        </article>
      </section>
    </div>
  );
}
