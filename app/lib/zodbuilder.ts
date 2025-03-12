import { z, ZodTypeAny } from 'zod';

interface InputField {
  kolom: string;
  jns: string;
  required?: string;
  maxlength?: number;
}

export function buildZodSchema(inputFields: InputField[]): {
  [key: string]: ZodTypeAny;
} {
  const schema: { [key: string]: ZodTypeAny } = {};

  inputFields.forEach((field) => {
    let fieldSchema: ZodTypeAny;

    switch (field.jns) {
      case 'text':
        fieldSchema = z.string();
        if (field.maxlength) {
          fieldSchema = (fieldSchema as z.ZodString).max(field.maxlength);
        }
        break;
      case 'number':
        fieldSchema = z.coerce.number();
        break;
      case 'email':
        fieldSchema = z.string().email();
        break;
      case 'date':
        fieldSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: 'Invalid date format',
        });
        break;
      case 'dd':
        fieldSchema = z.string();
        break;
      case 'file':
      case 'img':
        fieldSchema = z.any();
        break;
      case 'radio':
        fieldSchema = z.string();
        break;
      default:
        fieldSchema = z.string();
    }

    if (field.required === 'Y') {
      fieldSchema = (fieldSchema as z.ZodString).min(1, {
        message: `${field.kolom} is required`,
      });
    }

    schema[field.kolom] = fieldSchema;
  });

  return schema;
}

export function generateFormSchema(inputFields: InputField[]) {
  return z.object(buildZodSchema(inputFields));
}
