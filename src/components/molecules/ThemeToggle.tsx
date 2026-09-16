import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/contexts";
import { Button } from "@/components";

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-full text-neutral-300 hover:bg-white/10 hover:text-white dark:text-gray-600 dark:hover:bg-gray-100 dark:hover:text-gray-900"
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
};
