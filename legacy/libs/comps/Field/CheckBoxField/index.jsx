import React from "react";

import BaseField from "../BaseField";
import CheckBoxField from "./CheckBoxField";
import CheckBoxGroup from "./CheckBoxGroup";

function CheckBoxBase({ id, options, ...props }) {
  return options ? (
    <BaseField id={id} Component={<CheckBoxGroup id={id} options={options} />} {...props} />
  ) : (
    <BaseField id={id} className={""} Component={<CheckBoxField id={id} />} {...props} />
  );
}

export default CheckBoxBase;
