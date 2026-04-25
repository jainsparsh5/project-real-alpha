import SectionPlaceholder from "@/components/section-placeholder";

export default function SprintsPage() {
  return (
    <SectionPlaceholder
      label="Protocols"
      title="Pick the habits that rebuild the system."
      description="The v1 habit model is intentionally tight: sleep, body, focus, and connection. No-fap and impulse control live privately inside body and focus."
      items={[
        {
          title: "Sleep",
          detail:
            "Wake time, bedtime protection, caffeine cutoff, screen boundary, and recovery-aware intensity.",
        },
        {
          title: "Body",
          detail:
            "Gym consistency, walking, nutrition anchors, and sane physical challenge without punishment.",
        },
        {
          title: "Focus",
          detail:
            "Deep work blocks, distraction windows, porn-control protocols, and execution sprints.",
        },
        {
          title: "Connection",
          detail:
            "Anti-loneliness actions that push toward real contact, accountability, and brotherhood.",
        },
      ]}
    />
  );
}
