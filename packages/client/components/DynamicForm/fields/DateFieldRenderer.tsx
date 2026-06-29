'use client';
import { memo, useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FieldConfig } from '@/types/form';

export const DateFieldRenderer = memo(function DateFieldRenderer({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  const rules = useMemo(() => ({
    required: field.required ? `${field.name} is required` : false,
  }), [field.required, field.name]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller name={String(field.id)} control={control} defaultValue={null} rules={rules}
        render={({ field: f, fieldState }) => (
          <DatePicker label={field.name} value={f.value} onChange={f.onChange}
            slotProps={{ textField: { fullWidth: true, required: field.required,
              error: !!fieldState.error, helperText: fieldState.error?.message } }} />
        )}
      />
    </LocalizationProvider>
  );
});
