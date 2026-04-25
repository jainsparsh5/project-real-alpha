"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ActivityIcon,
  FlameIcon,
  GearIcon,
  LaunchIcon,
  LotusIcon,
  StackIcon,
  WaveIcon,
} from "@/components/command-icons";

const primaryItems = [
  { href: "/", label: "Command", icon: LaunchIcon },
  { href: "/sprints", label: "Protocols", icon: StackIcon },
  { href: "/activity-log", label: "Debrief", icon: ActivityIcon },
  { href: "/meditation", label: "Recovery", icon: LotusIcon },
  { href: "/settings", label: "Profile", icon: GearIcon },
];

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function CommandNav() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <div className="flex h-full flex-col bg-[#09090a] px-4 py-5 sm:px-5 lg:px-4 lg:py-6">
      <div className="mb-6 px-2">
        <div className="font-display text-[1.35rem] font-semibold uppercase tracking-[0.14em] text-primary">
          Real Alpha
        </div>
        <div className="mt-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/30">
          Brotherhood OS
        </div>
      </div>

      <nav className="flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
        {primaryItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          const requiresSignIn = href !== "/";

          return (
            <Link
              key={href}
              href={href}
              onClick={(event) => {
                if (requiresSignIn && isLoaded && !isSignedIn) {
                  event.preventDefault();
                  const redirectUrl = encodeURIComponent(href);
                  window.location.assign(`/sign-in?redirect_url=${redirectUrl}`);
                }
              }}
              className={cn(
                "group relative flex min-w-[148px] items-center gap-3 rounded-[0.2rem] px-3 py-3 text-[0.68rem] uppercase tracking-[0.18em] text-white/34",
                "bg-transparent hover:bg-white/[0.04] hover:text-white/70 lg:min-w-0",
                isActive &&
                  "bg-surface-low text-primary shadow-[inset_-2px_0_0_0_var(--primary),0_0_0_1px_rgba(143,245,255,0.04)]"
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 flex-1 rounded-[0.2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent_28%)] p-3">
        <div className="rounded-[0.18rem] bg-black/52 p-3">
          <div className="flex items-center gap-2 text-primary/82">
            <FlameIcon className="h-4 w-4" />
            <span className="font-display text-[0.6rem] uppercase tracking-[0.18em]">
              Beta Build
            </span>
          </div>
          <p className="mt-3 text-xs leading-5 text-white/34">
            Morning command, AI coach card, protocols, and debrief loop.
          </p>
        </div>
      </div>

      <button
        type="button"
        className="mt-5 inline-flex items-center justify-center gap-3 rounded-[0.2rem] bg-[linear-gradient(135deg,var(--primary),var(--primary-container))] px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#0b1011] shadow-[0_0_24px_rgba(143,245,255,0.18)] hover:shadow-[0_0_32px_rgba(143,245,255,0.28)]"
      >
        <WaveIcon className="h-4 w-4" />
        <span>Start</span>
      </button>
    </div>
  );
}
