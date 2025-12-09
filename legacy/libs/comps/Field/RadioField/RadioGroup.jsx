import { FormControl, FormLabel, RadioGroup as RadioGroupMUI } from "@quimera/thirdparty";
import React from "react";

import { Field } from "../";

function RadioGroup({ label, options, value, radioProps, labelProps, onChange, ...props }) {
  return (
    <FormControl component="fieldset" {...props}>
      <FormLabel component="legend" {...labelProps}>
        {label}
      </FormLabel>
      <RadioGroupMUI value={value}>
        {options.map(option => (
          <Field.RadioButton
            key={option.value}
            id=""
            label={option.label || null}
            value={option.value}
            checked={option.checked}
            onChange={onChange}
            {...radioProps}
          />
        ))}
      </RadioGroupMUI>
    </FormControl>
  );
}

export default RadioGroup;
