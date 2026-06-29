import { memo, useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText, Chip, Box, OutlinedInput } from '@mui/material';
import { FieldConfig } from '@/types/form';

export const MultiSelectFieldRenderer = memo(function MultiSelectFieldRenderer({ field }: { field: FieldConfig }) {
  const { control } = useFormContext();
  const options = field.listOfValues1 ?? [];
  const rules = useMemo(() => ({
    required: field.required ? `${field.name} is required` : false,
  }), [field.required, field.name]);

  return (
    <Controller name={String(field.id)} control={control} defaultValue={[]} rules={rules}
      render={({ field: f, fieldState }) => (
        <FormControl fullWidth required={field.required} error={!!fieldState.error}>
          <InputLabel>{field.name}</InputLabel>
          <Select
            {...f}
            multiple
            input={<OutlinedInput label={field.name} />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map(v => <Chip key={v} label={v} size="small" />)}
              </Box>
            )}
          >
            {options.map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
          {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
});
