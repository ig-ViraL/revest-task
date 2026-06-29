import { memo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, FormHelperText } from '@mui/material';
import { FieldConfig } from '@/types/form';

export const CheckboxFieldRenderer = memo(function CheckboxFieldRenderer({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  const options = field.listOfValues1 ?? [];

  if (options.length === 0) {
    return (
      <Controller name={String(field.id)} control={control}
        render={({ field: f }) => (
          <FormControlLabel
            control={<Checkbox {...f} checked={!!f.value} />}
            label={field.name}
          />
        )}
      />
    );
  }

  return (
    <Controller name={String(field.id)} control={control} defaultValue={[]}
      rules={{ required: field.required ? `${field.name} is required` : false }}
      render={({ field: f, fieldState }) => (
        <FormControl component="fieldset" error={!!fieldState.error} required={field.required}>
          <FormLabel component="legend">{field.name}</FormLabel>
          <FormGroup>
            {options.map(opt => (
              <FormControlLabel
                key={opt}
                label={opt}
                control={
                  <Checkbox
                    checked={(f.value as string[] ?? []).includes(opt)}
                    onChange={e => {
                      const current = (f.value as string[] ?? []);
                      f.onChange(e.target.checked ? [...current, opt] : current.filter(v => v !== opt));
                    }}
                  />
                }
              />
            ))}
          </FormGroup>
          {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
});
