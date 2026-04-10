const moodValues = ["sleepy", "energized", "foggy"] as const;

export type Mood = (typeof moodValues)[number];

export type RiseAndGrindInput = {
  wakeUpTime: string;
  sleepDurationHours: number;
  date: string;
  mood: Mood;
  gratitude: string;
};

function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime());
}

export function parseRiseAndGrindInput(input: unknown): {
  data?: RiseAndGrindInput;
  error?: string;
} {
  if (!input || typeof input !== "object") {
    return { error: "Invalid payload." };
  }

  const payload = input as Partial<RiseAndGrindInput>;

  if (!payload.wakeUpTime || !isValidTime(payload.wakeUpTime)) {
    return { error: "Wake up time must be a valid HH:MM value." };
  }

  const sleepDurationHours = Number(payload.sleepDurationHours);
  if (
    Number.isNaN(sleepDurationHours) ||
    sleepDurationHours < 1 ||
    sleepDurationHours > 16
  ) {
    return { error: "Sleep duration must be between 1 and 16 hours." };
  }

  if (!payload.date || !isValidDate(payload.date)) {
    return { error: "Date must be a valid YYYY-MM-DD value." };
  }

  if (!payload.mood || !moodValues.includes(payload.mood)) {
    return { error: "Mood must be one of sleepy, energized, or foggy." };
  }

  const gratitude = payload.gratitude?.trim() || "";
  if (gratitude.length < 8) {
    return { error: "Gratitude must be at least 8 characters long." };
  }

  return {
    data: {
      wakeUpTime: payload.wakeUpTime,
      sleepDurationHours,
      date: payload.date,
      mood: payload.mood,
      gratitude,
    },
  };
}
