import { Field } from "@quimera/comps";
import { util, useStateValue } from "quimera";
import { useFilterValue } from "quimera/hooks";
import React from "react";

function FiltroDisponibles({ id, label, ...props }) {
  const [{ filter, schema }, addFilter, removeFilter] = useFilterValue();
  const [{ soloDisponibles }, dispatch] = useStateValue();

  const schemaObj = schema?._get?.();
  const fieldsObj = schemaObj?._getFields?.();
  const fieldSchema = id ? fieldsObj?.[id.replace(/\//g, ".").split(".").pop()] : undefined;
  const fieldName = fieldSchema?._name;

  const handleChange = event => {
    dispatch({ type: "onSoloDisponiblesChanged", payload: event.target.value });
  };

  return (
    <Field.CheckBox
      checked={soloDisponibles}
      onChange={handleChange}
      label={util.translate(label)}
      {...props}
    />
  );
}

export default FiltroDisponibles;
