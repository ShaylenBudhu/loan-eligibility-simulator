import { cn } from "cn";
import { type ComponentPropsWithRef } from "react";

const Label = ({ className, ...props }: ComponentPropsWithRef<"label">) => (
  <label
    className={cn(
      "text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/50",
      className,
    )}
    {...props}
  />
);

export { Label };
