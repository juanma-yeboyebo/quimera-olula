// import React, { useEffect, useState } from 'react'
import { FormControl, FormGroup, FormLabel } from "@quimera/thirdparty";
import { Field } from "../";

function initSelected(options) {
  const selected = new Set();
  options.filter(option => option.checked).map(option => selected.add(option.value));

  return selected;
}

function CheckBoxGroup({ label, options, value, checkBoxProps, labelProps, onChange, ...props }) {
  function handleCheck(event) {
    const name = event.target.name;
    const selected = initSelected(options);

    if (selected.has(name)) {
      selected.delete(name);
    } else {
      selected.add(name);
    }

    return onChange({
      target: {
        value: Array.from(selected),
      },
    });
  }

  return (
    <FormControl component="fieldset" {...props}>
      <FormLabel component="legend" {...labelProps}>
        {label}
      </FormLabel>
      <FormGroup>
        {options.map(option => (
          <Field.CheckBox
            key={option.value}
            id=""
            label={option.label}
            value={option.value}
            checked={option.checked}
            onChange={handleCheck}
            {...checkBoxProps}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}

export default CheckBoxGroup;
