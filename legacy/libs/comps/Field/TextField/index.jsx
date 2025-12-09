import { useStateValue, util } from "quimera";
import React from "react";

import BaseField from "../BaseField";

export default function TextField({ id, field, value, ...props }) {
  const [state] = useStateValue();

  const stateField = field || id;
  const stateValue = value || util.getStateValue(stateField, state, value) || "";

  return <BaseField id={id} field={field} type="Text" value={stateValue} {...props} />;
}
