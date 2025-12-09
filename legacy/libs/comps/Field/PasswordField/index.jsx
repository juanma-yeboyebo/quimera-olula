import React, { useState } from "react";

import { Icon, IconButton } from "../../";
import { Field } from "../";

export default function PasswordField({ ...props }) {
  const [showPass, setShowPass] = useState(false);

  return (
    <Field.Text
      endAdornment={
        <IconButton
          id={`${props.id}ShowPassword`}
          aria-label="toggle password visibility"
          onClick={() => setShowPass(!showPass)}
          onMouseDown={event => event.preventDefault()}
        >
          {showPass ? <Icon>visibility</Icon> : <Icon>visibility_off</Icon>}
        </IconButton>
      }
      {...props}
      type={showPass ? "Text" : "password"}
      autoComplete="off"
    />
  );
}
