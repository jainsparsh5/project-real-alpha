import SectionPlaceholder from "@/components/section-placeholder";

export default function ActivityLogPage() {
  return (
    <SectionPlaceholder
      label="PM Debrief"
      title="Evening reflection closes the command loop."
      description="This surface is shaped for the second half of the product loop: wins, friction, impulse control, connection, and the adjustment that feeds tomorrow's coach card."
      items={[
        {
          title: "Win Ledger",
          detail:
            "Capture the one action that proved the day was not wasted, even if the rest was messy.",
        },
        {
          title: "Friction Scan",
          detail:
            "Name the exact place the day leaked: sleep, body, focus, connection, or impulse.",
        },
        {
          title: "Tomorrow Tweak",
          detail:
            "Turn reflection into one practical adjustment the AI coach can use in the next morning card.",
        },
      ]}
    />
  );
}
