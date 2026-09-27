import { Controller } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

import { FormSelect, type FormSelectFieldProps } from "@/components/molecules";

export const FormSelectField = <T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  description,
  disabled,
}: FormSelectFieldProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <FormSelect
        label={label}
        options={options}
        placeholder={placeholder}
        description={description}
        disabled={disabled}
        value={field.value ? String(field.value) : ""}
        onValueChange={(val) => {
          const asNumber = Number(val);
          field.onChange(Number.isNaN(asNumber) ? val : asNumber);
        }}
        error={fieldState.error?.message}
      />
    )}
  />
);
