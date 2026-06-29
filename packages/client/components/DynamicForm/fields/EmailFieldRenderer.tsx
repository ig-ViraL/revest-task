import { memo, useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import { FieldConfig } from '@/types/form';

export const EmailFieldRenderer = memo(function EmailFieldRenderer({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  const rules = useMemo(() => ({
    required:  field.required ? `${field.name} is required` : false,
    pattern:   { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
    maxLength: field.maxLength ? { value: field.maxLength, message: `Max ${field.maxLength} characters` } : undefined,
  }), [field.required, field.name, field.maxLength]);

  return (
    <Controller name={String(field.id)} control={control} rules={rules}
      render={({ field: f, fieldState }) => (
        <TextField {...f} type="email" label={field.name} fullWidth required={field.required}
          error={!!fieldState.error} helperText={fieldState.error?.message} />
      )}
    />
  );
});
