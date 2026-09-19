import { cn } from "cn";
import { Link } from "@tanstack/react-router";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/atoms";
import { useTheme } from "@/contexts";
import { ThemeToggle } from "@/components/molecules";

import { LINKS } from "./constants";
import capitecLogo from "@/assets/images/capitec-logo.svg";
import capitecFullLogo from "@/assets/images/capitecfull.svg";

export const NavBar = () => {
  const { theme } = useTheme();

  return (
    <header className="w-full px-5 py-3">
      <nav className="flex items-center bg-capitec-blue dark:bg-white border border-transparent dark:border-gray-200 rounded-full px-6 py-2 shadow-lg">
        <div className="flex-1 flex items-center">
          <img
            src={theme === "dark" ? capitecLogo : capitecFullLogo}
            alt="Capitec Bank"
            className="h-10 w-auto object-contain"
          />
        </div>

        <NavigationMenu>
          <NavigationMenuList className="gap-0">
            {LINKS.map(({ to, label }) => (
              <NavigationMenuItem key={to}>
                <Link
                  to={to}
                  className={cn(
                    "inline-flex h-9 items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors outline-none",
                    "text-neutral-300 hover:bg-white/10 hover:text-white",
                    "dark:text-gray-600 dark:hover:bg-gray-100 dark:hover:text-gray-900",
                    "focus-visible:ring-2 focus-visible:ring-white/30 dark:focus-visible:ring-capitec-blue/40",
                    "data-active:bg-white/15 data-active:text-white",
                    "dark:data-active:bg-capitec-blue/10 dark:data-active:text-capitec-blue",
                  )}
                  activeProps={{ "data-active": "" }}
                >
                  {label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex-1 flex justify-end items-center">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};
