import { memo, useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, FormControlLabel, Checkbox, FormHelperText } from '@mui/material';
import { FieldConfig } from '@/types/form';

export const CheckboxFieldRenderer = memo(function CheckboxFieldRenderer({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  const rules = useMemo(() => ({
    required: field.required ? `${field.name} must be checked` : false,
  }), [field.required, field.name]);

  return (
    <Controller name={String(field.id)} control={control} defaultValue={false} rules={rules}
      render={({ field: f, fieldState }) => (
        <FormControl error={!!fieldState.error}>
          <FormControlLabel
            label={field.name}
            control={<Checkbox {...f} checked={!!f.value} onChange={e => f.onChange(e.target.checked)} />}
          />
          {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
});
