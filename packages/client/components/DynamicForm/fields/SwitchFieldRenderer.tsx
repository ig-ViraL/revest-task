import { memo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControlLabel, Switch, FormControl, FormHelperText } from '@mui/material';
import { FieldConfig } from '@/types/form';

export const SwitchFieldRenderer = memo(function SwitchFieldRenderer({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();

  return (
    <Controller name={String(field.id)} control={control} defaultValue={false}
      rules={{ required: field.required ? `${field.name} is required` : false }}
      render={({ field: f, fieldState }) => (
        <FormControl error={!!fieldState.error}>
          <FormControlLabel
            label={field.name}
            control={<Switch {...f} checked={!!f.value} />}
          />
          {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
});
