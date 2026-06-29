import { memo } from 'react';
import { FieldConfig } from '@/types/form';
import { TextFieldRenderer }        from './fields/TextFieldRenderer';
import { EmailFieldRenderer }       from './fields/EmailFieldRenderer';
import { PasswordFieldRenderer }    from './fields/PasswordFieldRenderer';
import { NumberFieldRenderer }      from './fields/NumberFieldRenderer';
import { TextareaFieldRenderer }    from './fields/TextareaFieldRenderer';
import { SelectFieldRenderer }      from './fields/SelectFieldRenderer';
import { MultiSelectFieldRenderer } from './fields/MultiSelectFieldRenderer';
import { RadioFieldRenderer }       from './fields/RadioFieldRenderer';
import { CheckboxFieldRenderer }    from './fields/CheckboxFieldRenderer';
import { SwitchFieldRenderer }      from './fields/SwitchFieldRenderer';
import { DateFieldRenderer }        from './fields/DateFieldRenderer';

interface Props { field: FieldConfig; }

export const DynamicField = memo(function DynamicField({ field }: Props) {
  switch (field.fieldType) {
    case 'TEXT':         return <TextFieldRenderer field={field} />;
    case 'EMAIL':        return <EmailFieldRenderer field={field} />;
    case 'PASSWORD':     return <PasswordFieldRenderer field={field} />;
    case 'NUMBER':       return <NumberFieldRenderer field={field} />;
    case 'TEXTAREA':     return <TextareaFieldRenderer field={field} />;
    case 'LIST':         return <SelectFieldRenderer field={field} />;
    case 'MULTI_SELECT': return <MultiSelectFieldRenderer field={field} />;
    case 'RADIO':        return <RadioFieldRenderer field={field} />;
    case 'CHECKBOX':     return <CheckboxFieldRenderer field={field} />;
    case 'SWITCH':       return <SwitchFieldRenderer field={field} />;
    case 'DATE':         return <DateFieldRenderer field={field} />;
    default:             return null;
  }
});
