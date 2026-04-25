import SectionPlaceholder from "@/components/section-placeholder";

export default function MeditationPage() {
  return (
    <SectionPlaceholder
      label="Recovery"
      title="Reset without dropping the mission."
      description="Recovery is not soft mode. It is the place for nervous-system downshift, loneliness interrupts, sleep repair, and clean re-entry after a bad stretch."
      items={[
        {
          title: "Loneliness Interrupt",
          detail:
            "A short protocol that pushes the user toward one real contact instead of another isolated loop.",
        },
        {
          title: "Sleep Repair",
          detail:
            "Bedtime guardrails, wind-down steps, and next-day intensity limits when recovery is low.",
        },
        {
          title: "Urge Reset",
          detail:
            "A private impulse-control reset framed around energy, attention, and self-respect.",
        },
      ]}
    />
  );
}
