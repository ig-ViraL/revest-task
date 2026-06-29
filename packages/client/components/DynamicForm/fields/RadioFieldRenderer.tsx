import { memo, useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@mui/material';
import { FieldConfig } from '@/types/form';

export const RadioFieldRenderer = memo(function RadioFieldRenderer({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  const rules = useMemo(() => ({
    required: field.required ? `${field.name} is required` : false,
  }), [field.required, field.name]);

  return (
    <Controller name={String(field.id)} control={control} rules={rules}
      render={({ field: f, fieldState }) => (
        <FormControl error={!!fieldState.error} required={field.required}>
          <FormLabel>{field.name}</FormLabel>
          <RadioGroup {...f} row>
            {(field.listOfValues1 ?? []).map(val => (
              <FormControlLabel key={val} value={val} control={<Radio />} label={val} />
            ))}
          </RadioGroup>
          {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
});
