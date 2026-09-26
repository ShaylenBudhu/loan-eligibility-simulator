import { type ReactNode } from "react";

import { Label } from "@/components/atoms";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

const FormField = ({ id, label, error, children }: FormFieldProps) => (
  <div className="space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    {children}
    {error && (
      <p role="alert" className="text-xs text-red-500 dark:text-red-400">
        {error}
      </p>
    )}
  </div>
);

export { FormField };
