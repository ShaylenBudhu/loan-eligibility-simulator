import { cn } from "cn";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";

import {
  Button,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/atoms";
import { useTheme } from "@/contexts";
import { ThemeToggle } from "@/components/molecules";
import capitecLogo from "@/assets/images/capitec-logo.svg";
import capitecFullLogo from "@/assets/images/capitecfull.svg";

import { LINKS } from "./constants";

export const NavBar = () => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <header className="w-full">
      <nav className="relative flex items-center overflow-hidden bg-capitec-blue dark:bg-[#002e47] border-b border-transparent dark:border-white/10 px-6 py-2 shadow-lg">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]" />

        <div className="relative z-10 flex flex-1 items-center">
          <Link to="/" onClick={() => setOpen(false)}>
            <img
              src={theme === "dark" ? capitecLogo : capitecFullLogo}
              alt="Capitec Bank"
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        <NavigationMenu className="relative z-10 hidden lg:flex">
          <NavigationMenuList className="gap-2.5">
            {LINKS.map(({ to, label }) => (
              <NavigationMenuItem key={to}>
                <Link
                  to={to}
                  className={cn(
                    "inline-flex h-9 items-center justify-center rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors outline-none",
                    "text-neutral-300 hover:bg-white/10 hover:text-white",
                    "focus-visible:ring-2 focus-visible:ring-white/30",
                    "data-active:bg-white/15 data-active:text-white",
                  )}
                  activeProps={{ "data-active": "" }}
                >
                  {label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="relative z-10 flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            aria-label="Toggle menu"
            aria-expanded={open}
            data-state={open ? "open" : "closed"}
            onClick={() => setOpen((v) => !v)}
            className="flex lg:hidden items-center justify-center rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 aria-expanded:bg-transparent aria-expanded:text-white/70"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="relative overflow-hidden bg-capitec-blue dark:bg-[#002e47] border-b border-white/10 lg:hidden">
          <div className="pointer-events-none absolute inset-0 opacity-[0.08]" />
          <nav className="relative z-10 flex flex-col px-4 py-3 gap-1">
            {LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  "text-neutral-300 hover:bg-white/10 hover:text-white",
                  "data-active:bg-white/15 data-active:text-white",
                )}
                activeProps={{ "data-active": "" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
