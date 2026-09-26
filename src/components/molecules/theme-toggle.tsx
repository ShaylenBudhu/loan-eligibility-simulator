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
      className="cursor-pointer rounded-full text-white/70 hover:bg-white/10 hover:text-white dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
};
