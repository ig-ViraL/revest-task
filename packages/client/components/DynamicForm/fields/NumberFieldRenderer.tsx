import { memo, useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import { FieldConfig } from '@/types/form';

export const NumberFieldRenderer = memo(function NumberFieldRenderer({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  const rules = useMemo(() => ({
    required: field.required ? `${field.name} is required` : false,
    min: field.min != null ? { value: field.min, message: `Min value is ${field.min}` } : undefined,
    max: field.max != null ? { value: field.max, message: `Max value is ${field.max}` } : undefined,
  }), [field.required, field.name, field.min, field.max]);

  return (
    <Controller name={String(field.id)} control={control} rules={rules}
      render={({ field: f, fieldState }) => (
        <TextField {...f} type="number" label={field.name} fullWidth required={field.required}
          inputProps={{ min: field.min, max: field.max }}
          error={!!fieldState.error} helperText={fieldState.error?.message} />
      )}
    />
  );
});
