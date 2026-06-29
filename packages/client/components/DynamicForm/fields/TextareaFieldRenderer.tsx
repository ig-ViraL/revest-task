import { memo, useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import { FieldConfig } from '@/types/form';

export const TextareaFieldRenderer = memo(function TextareaFieldRenderer({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  const rules = useMemo(() => ({
    required:  field.required ? `${field.name} is required` : false,
    minLength: field.minLength ? { value: field.minLength, message: `Min ${field.minLength} characters` } : undefined,
    maxLength: field.maxLength ? { value: field.maxLength, message: `Max ${field.maxLength} characters` } : undefined,
  }), [field.required, field.name, field.minLength, field.maxLength]);

  return (
    <Controller name={String(field.id)} control={control} rules={rules}
      render={({ field: f, fieldState }) => (
        <TextField
          {...f}
          label={field.name}
          fullWidth
          multiline
          rows={field.rows ?? 4}
          required={field.required}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
});
