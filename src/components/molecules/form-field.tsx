import {
  Field,
  Input,
  FieldError,
  FieldLabel,
  FieldDescription,
} from "@/components/atoms";

import type { FormFieldProps } from "./types";

export const FormField = ({
  id,
  label,
  error,
  children,
  description,
  ...inputProps
}: FormFieldProps & { children?: React.ReactNode }) => {
  const fieldId = id ?? label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <Field data-invalid={!!error || undefined}>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      {children ?? (
        <Input id={fieldId} aria-invalid={!!error} {...inputProps} />
      )}
      {description && <FieldDescription>({description})</FieldDescription>}
      <FieldError>{error}</FieldError>
    </Field>
  );
};
