import type { ComponentProps } from "react";
import type { Select as SelectPrimitive } from "@base-ui/react/select";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { Input } from "@/components/atoms";

export type FormFieldProps = ComponentProps<typeof Input> & {
  label: string;
  description?: string;
  error?: string;
};

export type SelectOption = {
  value: string;
  label: string;
};

export type FormSelectProps = SelectPrimitive.Root.Props<string> & {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  error?: string;
};

export type FormSelectFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  disabled?: boolean;
};
