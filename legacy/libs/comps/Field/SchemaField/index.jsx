import { util } from "quimera";

import { Field } from "../";

const t = util.translate;

function SchemaField({ id, schema, ...props }) {
  const schemaObj = schema?._get?.();
  const fieldsObj = schemaObj?._getFields?.();
  const fieldName = id.replace(/\//g, ".").split(".").pop();
  const fieldSchema = fieldsObj?.[fieldName];
  const paramSet = fieldSchema?._paramSet;

  const translationKey = `schemas.${schema?.id}.${fieldName}`;
  const translatedLabel = util.translate(translationKey);
  const commonProps = {
    id,
    label: translatedLabel === translationKey ? fieldSchema?._alias : translatedLabel,
    required: paramSet?._required,
    ...props,
  };

  switch (fieldSchema?._type) {
    case "Text":
      return <Field.Text {...commonProps} />;
    case "Password":
      return <Field.Password {...commonProps} />;
    case "Date":
      return <Field.Date {...commonProps} />;
    case "Time":
      return <Field.Time {...commonProps} />;
    case "Int":
      return <Field.Int {...commonProps} />;
    case "Float":
      return <Field.Float decimals={paramSet?._decimals} {...commonProps} />;
    case "Currency":
      return (
        <Field.Currency
          decimals={paramSet?._decimals}
          currency={paramSet?._currency}
          {...commonProps}
        />
      );
    case "Bool":
      return <Field.CheckBox {...commonProps} />;
    case "Options":
      return <Field.Select options={paramSet?._options ?? commonProps.options} fullWidth {...commonProps} />;
    case "TextArea":
      return <Field.TextArea {...commonProps} />;
    default:
      console.error(
        `Tipo de campo no contemplado en Field.Schema: ${fieldSchema?._type} sobre el campo ${id}`,
      );

      return <Field.Text {...commonProps} />;
  }
}

export default SchemaField;
