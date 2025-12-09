import { Checkbox, FormControlLabel } from "@quimera/thirdparty";
import React from "react";

function CheckBoxField({ label, value, checked, onChange, ...props }) {
  function handleCheck(event) {
    return onChange({
      target: {
        value: event.target.checked,
        name: event.target.value,
      },
    });
  }

  return (
    <FormControlLabel
      control={<Checkbox checked={!!checked} onChange={handleCheck} value={value} {...props} />}
      label={label}
    />
  );
}

export default CheckBoxField;
