import SectionPlaceholder from "@/components/section-placeholder";

export default function SettingsPage() {
  return (
    <SectionPlaceholder
      label="Profile"
      title="Calibrate the coach to the man."
      description="Profile settings will hold tone, goals, active protocols, privacy controls, and subscription status once the beta loop proves useful."
      items={[
        {
          title: "Coach Tone",
          detail:
            "Keep the voice direct, loyal, and practical without crossing into shame or pseudo-therapy.",
        },
        {
          title: "Lifestyle Baseline",
          detail:
            "Wake target, gym access, work schedule, social constraints, and current discipline bottlenecks.",
        },
        {
          title: "Subscription Gate",
          detail:
            "Future Stripe-backed access for premium AI usage, weekly reviews, and deeper protocol history.",
        },
      ]}
    />
  );
}
