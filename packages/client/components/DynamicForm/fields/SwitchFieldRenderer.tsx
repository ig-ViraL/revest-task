import { memo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControlLabel, Switch } from '@mui/material';
import { FieldConfig } from '@/types/form';

export const SwitchFieldRenderer = memo(function SwitchFieldRenderer({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  return (
    <Controller name={String(field.id)} control={control} defaultValue={false}
      render={({ field: f }) => (
        <FormControlLabel
          label={field.name}
          control={<Switch {...f} checked={!!f.value} onChange={e => f.onChange(e.target.checked)} />}
        />
      )}
    />
  );
});
