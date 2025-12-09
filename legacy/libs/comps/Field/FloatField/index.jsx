import { makeStyles } from "@quimera/styles";
import { TextField as MuiTextField } from "@quimera/thirdparty";
import React from "react";

import { NumberFormat } from "../../";
import BaseField from "../BaseField";
import TextField from "../TextField";

const useStyles = makeStyles(theme => ({
  root: null,
  overrides: theme.overrides, // theme.textField
}));
function QNumberFormat({ onChange, value, ...props }) {
  const handleValueChange = e => onChange(e);

  return <NumberFormat onValueChange={handleValueChange} value={value ?? ""} {...props} />;
}
function FloatField({ decimals = 2, value, onChange, ...props }) {
  const thousandSeparator = ".";
  const decimalSeparator = ",";
  const classes = useStyles();

  if (onChange && value !== undefined) {
    // console.log("FLOAT ONCHANGE", props.id, value);

    return (
      <QNumberFormat
        thousandSeparator={thousandSeparator}
        decimalSeparator={decimalSeparator}
        fixedDecimalScale={true}
        decimalScale={decimals}
        inputProps={{ style: { textAlign: "end" } }}
        customInput={MuiTextField}
        getEventValue={e => e.floatValue}
        value={value}
        onChange={onChange}
        {...props}
      />
    );
  }

  return (
    <BaseField
      Component={
        <QNumberFormat
          thousandSeparator={thousandSeparator}
          decimalSeparator={decimalSeparator}
          fixedDecimalScale={true}
          decimalScale={decimals}
          inputProps={{ style: { textAlign: "end" } }}
          customInput={TextField}
        />
      }
      getEventValue={e => e.floatValue}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}

export default FloatField;
