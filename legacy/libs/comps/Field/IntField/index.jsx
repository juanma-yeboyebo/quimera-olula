import React from "react";

import { Field } from "../";

export default function IntField(props) {
  return <Field.Float decimals={0} {...props} />;
}
