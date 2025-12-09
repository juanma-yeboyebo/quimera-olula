import React from "react";

import BaseField from "../BaseField";
import RadioField from "./RadioField";
import RadioGroup from "./RadioGroup";

function RadioBase({ id, options, ...props }) {
  return options ? (
    <BaseField id={id} Component={<RadioGroup id={id} options={options} />} {...props} />
  ) : (
    <BaseField id={id} className={""} Component={<RadioField id={id} />} {...props} />
  );
}

export default RadioBase;
