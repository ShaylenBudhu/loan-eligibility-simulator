import {
  Field,
  Select,
  FieldError,
  FieldLabel,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
  FieldDescription,
} from "@/components/atoms";

import type { FormSelectProps, SelectOption } from "./types";

export const FormSelect = ({
  label,
  options,
  placeholder,
  description,
  error,
  ...selectProps
}: FormSelectProps) => {
  const triggerId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <Field data-invalid={!!error || undefined}>
      <FieldLabel htmlFor={triggerId}>{label}</FieldLabel>
      <Select {...selectProps}>
        <SelectTrigger id={triggerId} className="w-full" aria-invalid={!!error}>
          <SelectValue>
            {(value: string) =>
              options.find((o) => o.value === value)?.label ??
              (placeholder ?? `Select ${label.toLowerCase()}`)
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option: SelectOption) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <FieldDescription>({description})</FieldDescription>}

      <FieldError>{error}</FieldError>
    </Field>
  );
};
