import { util } from "quimera";
import React from "react";

import * as Column from "./Column";

function SchemaColumn({ id, schema, ...props }) {
  const fieldId = util.lastStateField(id);
  const schemaObj = schema?._get?.();
  const fieldsObj = schemaObj?._getFields?.();
  const fieldSchema = fieldsObj?.[fieldId];
  const paramSet = fieldSchema?._paramSet;

  const commonProps = {
    id,
    header: fieldSchema?._alias ?? "",
    value: data => data?.[fieldId],
    order: fieldSchema?._name,
    ...props,
  };

  switch (fieldSchema?._type) {
    case "Text":
      return <Column.Text {...commonProps} />;
    case "Password":
      return <Column.Text {...commonProps} />;
    case "Date":
      return <Column.Date {...commonProps} />;
    case "Time":
      return <Column.Time {...commonProps} />;
    case "Int":
      return <Column.Int {...commonProps} />;
    case "Float":
      return <Column.Decimal decimals={paramSet?._decimals} {...commonProps} />;
    case "Currency":
      return (
        <Column.Currency
          decimals={paramSet?._decimals}
          currency={paramSet?._currency}
          {...commonProps}
        />
      );
    case "Bool":
      return <Column.Boolean {...commonProps} />;
    case "Options":
      return <Column.Text {...commonProps} />;
    case "TextArea":
      return <Column.Text {...commonProps} />;
    default:
      console.error(
        `Tipo de campo no contemplado en Column.Schema: ${fieldSchema?._type} sobre el campo ${id}`,
      );

      return <Column.Text {...commonProps} />;
  }
}

export default SchemaColumn;
