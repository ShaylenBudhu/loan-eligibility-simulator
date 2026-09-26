import { cn } from "cn";
import { type ComponentPropsWithRef } from "react";

const Input = ({ className, ...props }: ComponentPropsWithRef<"input">) => (
  <input
    className={cn(
      "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition",
      "focus:border-capitec-blue/50 focus:bg-white",
      "dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/40 dark:focus:bg-white/15",
      "aria-invalid:border-red-400 dark:aria-invalid:border-red-400/60",
      className,
    )}
    {...props}
  />
);

export { Input };
