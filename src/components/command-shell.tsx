import type { ReactNode } from "react";

import {
  FlameIcon,
  TrophyIcon,
  UserIcon,
} from "@/components/command-icons";
import CommandNav from "@/components/command-nav";

export default function CommandShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <aside className="lg:sticky lg:top-0 lg:h-screen lg:w-[220px] lg:flex-none lg:border-r lg:border-white/[0.04]">
          <CommandNav />
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="flex h-[68px] items-center justify-between border-b border-white/[0.04] px-4 sm:px-6 lg:px-9">
            <div className="font-display text-lg font-medium italic tracking-[0.08em] text-white/92 sm:text-[1.45rem]">
              Project-Real Alpha
            </div>

            <div className="flex items-center gap-2">
              {[FlameIcon, TrophyIcon, UserIcon].map((Icon, index) => (
                <button
                  key={index}
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-white/68 hover:border-primary/35 hover:text-primary"
                >
                  <Icon className="h-4.5 w-4.5" />
                </button>
              ))}
            </div>
          </header>

          <main className="flex-1 px-4 py-4 sm:px-6 lg:px-9 lg:py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
