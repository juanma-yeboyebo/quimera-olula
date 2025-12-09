import React from "react";

import { Field } from "../";

function CurrencyField({ decimals = 2, currency = "€", ...props }) {
  return <Field.Float suffix={` ${currency}`} decimals={decimals} {...props} />;
}

export default CurrencyField;
