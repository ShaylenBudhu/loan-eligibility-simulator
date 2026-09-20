import type { FC } from "react";

import type { PageShellProps } from "./types";

export const PageTheme: FC<PageShellProps> = ({ children, className }) => (
  <div className="relative min-h-[calc(100vh-56px)] bg-linear-to-br from-capitec-blue via-[#003557] to-[#001a2e] dark:from-[#002e47] dark:via-[#001f33] dark:to-[#000d1a] text-white overflow-hidden">
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-1/4 -right-1/4 size-150 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-1/4 -left-1/4 size-125 rounded-full bg-blue-400/10 blur-3xl" />
    </div>
    <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-size-[60px_60px]" />
    <div className={`relative z-10 ${className ?? ""}`}>{children}</div>
  </div>
);
