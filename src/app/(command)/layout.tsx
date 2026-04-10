import type { ReactNode } from "react";

import CommandShell from "@/components/command-shell";

export default function CommandLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <CommandShell>{children}</CommandShell>;
}
