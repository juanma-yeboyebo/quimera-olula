import React from "react";

import { Field } from "../";

function TextArea({ minRows = "4", ...props }) {
  return <Field.Text multiline minRows={minRows} variant="filled" {...props} />;
}

export default TextArea;
