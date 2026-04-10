import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase(props: IconProps) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    />
  );
}

export function LaunchIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 19c2.1-1.4 4.2-1.7 6.2-.8" />
      <path d="M7 15l-2.5 2.5" />
      <path d="M13.3 10.7L9 15" />
      <path d="M14.5 4.5c3.6-.4 5.4 1.4 5 5l-3.4 3.4c-2.6.4-5.2-.3-7.1-2.2S6 6.1 6.4 3.5z" />
      <path d="M15 9h.01" />
    </IconBase>
  );
}

export function ActivityIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 19V9" />
      <path d="M8 19V13" />
      <path d="M16 19v-6" />
      <path d="M12 5a2 2 0 1 1 0 .01" />
    </IconBase>
  );
}

export function LotusIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 7c1.7 2.3 2.6 4.4 2.6 6.3 0 2-1.2 3.2-2.6 3.2s-2.6-1.2-2.6-3.2C9.4 11.4 10.3 9.3 12 7z" />
      <path d="M7.8 10.2c1.8 1.1 3 2.6 3.5 4.3-1.9.3-3.6-.1-5-1.1 0-1.4.5-2.5 1.5-3.2z" />
      <path d="M16.2 10.2c1 .7 1.5 1.8 1.5 3.2-1.4 1-3.1 1.4-5 1.1.5-1.7 1.7-3.2 3.5-4.3z" />
      <path d="M5.5 18.5h13" />
    </IconBase>
  );
}

export function StackIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 8.5h14" />
      <path d="M5 12h14" />
      <path d="M5 15.5h14" />
    </IconBase>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 8.7a3.3 3.3 0 1 1 0 6.6 3.3 3.3 0 0 1 0-6.6Z" />
      <path d="M18 12a6.8 6.8 0 0 0-.1-1l2-1.4-1.6-2.8-2.4.7a7.8 7.8 0 0 0-1.7-1l-.4-2.5h-3.2l-.4 2.5a7.8 7.8 0 0 0-1.7 1L5.7 6.8 4 9.6 6 11a6.8 6.8 0 0 0 0 2l-2 1.4 1.6 2.8 2.4-.7a7.8 7.8 0 0 0 1.7 1l.4 2.5h3.2l.4-2.5a7.8 7.8 0 0 0 1.7-1l2.4.7 1.6-2.8-2-1.4c.1-.3.1-.7.1-1Z" />
    </IconBase>
  );
}

export function WaveIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 14c2 0 2-4 4-4s2 4 4 4 2-4 4-4 2 4 4 4 2-4 4-4" />
    </IconBase>
  );
}

export function SupportIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6.5 13.5v-1a5.5 5.5 0 0 1 11 0v1" />
      <path d="M6.5 15.5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2" />
      <path d="M17.5 10.5a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2" />
      <path d="M12 19h2.5a1.5 1.5 0 0 0 1.5-1.5V16" />
    </IconBase>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 6H6.5A1.5 1.5 0 0 0 5 7.5v9A1.5 1.5 0 0 0 6.5 18H9" />
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H9" />
    </IconBase>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M13 3c.4 2.3-.4 3.8-1.8 5.2-1.3 1.3-2.2 2.8-2.2 4.8a4 4 0 0 0 8 0c0-2.7-1.5-4.6-4-7.5Z" />
    </IconBase>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 4h8v2.5A4 4 0 0 1 12 10.5 4 4 0 0 1 8 6.5Z" />
      <path d="M8 5H5.5A1.5 1.5 0 0 0 4 6.5 3.5 3.5 0 0 0 8 10" />
      <path d="M16 5h2.5A1.5 1.5 0 0 1 20 6.5 3.5 3.5 0 0 1 16 10" />
      <path d="M12 10.5V15" />
      <path d="M9 20h6" />
      <path d="M10 15h4v3H10z" />
    </IconBase>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8.5" r="3" />
      <path d="M6.5 18a5.5 5.5 0 0 1 11 0" />
    </IconBase>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M15.7 4.8a7 7 0 1 0 3.5 12.7 7.3 7.3 0 0 1-3.7.9A7.4 7.4 0 0 1 8.1 11 7.3 7.3 0 0 1 15.7 4.8Z" />
    </IconBase>
  );
}

export function BatteryIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="5" y="8" width="12" height="8" rx="1.5" />
      <path d="M19 10.5h1.5v3H19" />
      <path d="M7.5 10.5h4v3h-4z" />
    </IconBase>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M13 2 7 13h4l-1 9 7-12h-4l1-8Z" />
    </IconBase>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 4v3" />
      <path d="M12 17v3" />
      <path d="M4 12h3" />
      <path d="M17 12h3" />
      <path d="m6.3 6.3 2.1 2.1" />
      <path d="m15.6 15.6 2.1 2.1" />
      <path d="m17.7 6.3-2.1 2.1" />
      <path d="m8.4 15.6-2.1 2.1" />
    </IconBase>
  );
}
