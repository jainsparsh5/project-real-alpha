"use client";

import type { ReactNode } from "react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

import { UserIcon } from "@/components/command-icons";
import CommandNav from "@/components/command-nav";

export default function CommandShell({
  children,
}: {
  children: ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-surface text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <aside className="lg:sticky lg:top-0 lg:h-screen lg:w-[238px] lg:flex-none lg:border-r lg:border-white/[0.04]">
          <CommandNav />
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="flex min-h-[72px] items-center justify-between border-b border-white/[0.04] px-4 py-4 sm:px-6 lg:px-9">
            <div>
              <div className="font-display text-lg font-semibold tracking-[0.02em] text-white/92 sm:text-[1.35rem]">
                Project-Real Alpha
              </div>
              <div className="mt-1 hidden text-[0.62rem] uppercase tracking-[0.2em] text-white/28 sm:block">
                AI coach for routine, body, focus, and connection
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isLoaded && isSignedIn ? (
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02]">
                  <UserButton />
                </div>
              ) : (
                <div className="group relative">
                  <SignInButton mode="redirect" forceRedirectUrl="/">
                    <button
                      type="button"
                      aria-label="Login or Sign Up"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] text-white/60 hover:border-primary/35 hover:text-primary"
                    >
                      <UserIcon className="h-4.5 w-4.5" />
                    </button>
                  </SignInButton>

                  <span className="pointer-events-none absolute right-0 top-11 z-20 whitespace-nowrap rounded-sm border border-white/12 bg-[#0d1112] px-2 py-1 text-[0.62rem] uppercase tracking-[0.12em] text-white/78 opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-opacity duration-150 group-hover:opacity-100">
                    Login / Sign Up
                  </span>
                </div>
              )}
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
