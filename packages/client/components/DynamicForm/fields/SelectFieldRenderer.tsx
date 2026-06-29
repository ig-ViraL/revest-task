import { memo, useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { FieldConfig } from '@/types/form';

export const SelectFieldRenderer = memo(function SelectFieldRenderer({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  const rules = useMemo(() => ({
    required: field.required ? `${field.name} is required` : false,
  }), [field.required, field.name]);

  return (
    <Controller name={String(field.id)} control={control} rules={rules}
      render={({ field: f, fieldState }) => (
        <FormControl fullWidth error={!!fieldState.error} required={field.required}>
          <InputLabel>{field.name}</InputLabel>
          <Select {...f} label={field.name}>
            {(field.listOfValues1 ?? []).map(val => (
              <MenuItem key={val} value={val}>{val}</MenuItem>
            ))}
          </Select>
          {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
});
