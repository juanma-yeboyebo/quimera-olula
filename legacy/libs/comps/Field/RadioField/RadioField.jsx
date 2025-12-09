import { FormControlLabel, Radio } from "@quimera/thirdparty";
import React from "react";

function RadioField({ label, value, checked, ...props }) {
  return <FormControlLabel control={<Radio {...props} />} value={value} label={label} />;
}

export default RadioField;
