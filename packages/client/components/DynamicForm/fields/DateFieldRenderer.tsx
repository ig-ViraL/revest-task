import { memo, useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import { FieldConfig } from '@/types/form';

export const DateFieldRenderer = memo(function DateFieldRenderer({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  const rules = useMemo(() => ({
    required: field.required ? `${field.name} is required` : false,
  }), [field.required, field.name]);

  return (
    <Controller name={String(field.id)} control={control} rules={rules}
      render={({ field: f, fieldState }) => (
        <TextField
          {...f}
          type="date"
          label={field.name}
          fullWidth
          required={field.required}
          InputLabelProps={{ shrink: true }}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
});
