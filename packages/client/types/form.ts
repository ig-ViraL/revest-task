export type FieldType =
  | 'TEXT' | 'EMAIL' | 'PASSWORD' | 'NUMBER' | 'TEXTAREA'
  | 'LIST' | 'MULTI_SELECT' | 'RADIO' | 'CHECKBOX' | 'SWITCH' | 'DATE';

export interface FieldConfig {
  id: number;
  name: string;
  fieldType: FieldType;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  rows?: number;
  defaultValue?: string;
  required: boolean;
  listOfValues1?: string[];
}

export type FormValues = Record<string, unknown>;
