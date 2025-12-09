import { makeStyles } from "@quimera/styles";
import { Box, FormHelperText, InputBase, TextField } from "@quimera/thirdparty";
import { useStateValue, util } from "quimera";
import React, { useState } from "react";

import { InputAdornment } from "../../";

const useStyles = makeStyles(theme => ({
  root: null,
  overrides: theme.overrides, // theme.textField
}));

function BaseField({ id, field, value, formatter = value => value, preFormat, index, Component, startAdornment, endAdornment, InputProps, naked = false, onChange, onEnter, updateTime, error, helperText, boxStyle, getEventValue, required, type, ...props }) {
  const classes = useStyles();
  const [state, dispatch] = useStateValue();
  const [timer, setTimer] = useState();

  const stateField = field || id;
  const replacedStateField = stateField && stateField.replace(/\//g, ".").split(".");
  const validationField =
    stateField &&
    `${replacedStateField.slice(0, -1).join(".") || stateField
    }Validation.${replacedStateField.pop()}`;

  let stateValue = value ?? util.getStateValue(stateField, state, value);
  if (preFormat) {
    stateValue = preFormat(stateValue);
  }
  const validationValue = util.getStateValue(validationField, state);

  error =
    error ||
    validationValue?.error ||
    (required &&
      (stateValue === null || stateValue === undefined || (type === "Text" && stateValue === "")));
  helperText = helperText ?? validationValue?.message;

  // ? value : util.getStateValue(stateField, state, value)

  const _getValue = e => (getEventValue ? getEventValue(e) : e.target.value);

  const handleChange = e => {
    if (!stateField || stateField === "") {
      return;
    }
    const value = formatter(_getValue(e));
    if (stateValue === value) {
      return;
    }
    dispatch({
      type: `on${util.camelId(id)}Changed`,
      payload: { field: util.lastStateField(stateField), value, index },
    });

    if (updateTime) {
      const newval = _getValue(e);
      clearTimeout(timer);
      setTimer(
        setTimeout(
          () =>
            dispatch({
              type: `on${util.camelId(id)}Timeout`,
              payload: {
                field: util.lastStateField(stateField),
                value: formatter(newval),
              },
            }),
          updateTime,
        ),
      );
    }
  };

  const handleFocus = e => void 0;
  const handleBlur = e => {
    if (!stateField || stateField === "") {
      return;
    }

    dispatch({
      type: `on${util.camelId(id)}Blurred`,
      payload: {
        field: util.lastStateField(stateField),
        value: formatter(_getValue(e)),
      },
    });
  };

  const handleKeyDown = e => {
    if (e?.keyCode === 13) {
      onEnter && e.preventDefault();

      return onEnter?.(formatter(_getValue(e)));
    }
  };

  const inputProps = {
    startAdornment: startAdornment ? (
      <InputAdornment position="start">{startAdornment}</InputAdornment>
    ) : null,
    endAdornment: endAdornment ? (
      <InputAdornment position="end">{endAdornment}</InputAdornment>
    ) : null,
    // style: { fontSize: 16 },
    // ...InputProps,
  };

  return (
    <Box className={boxStyle}>
      {Component ? (
        <>
          {React.cloneElement(Component, {
            id: id || stateField,
            value: stateValue,
            onChange: onChange || handleChange,
            onFocus: handleFocus,
            onBlur: handleBlur,
            error,
            className: classes.root,
            ...props,
          })}
          {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
        </>
      ) : naked ? (
        <>
          <InputBase
            id={id || stateField}
            className={classes.root}
            margin="dense"
            value={stateValue}
            onChange={onChange || handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            error={error}
            type={type}
            {...props}
          />
          {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
        </>
      ) : (
        <TextField
          id={id || stateField}
          className={classes.root}
          margin="dense"
          value={stateValue}
          onChange={onChange || handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          variant="standard"
          onKeyDown={handleKeyDown}
          InputProps={inputProps}
          inputProps={InputProps}
          error={error}
          // Si se trata de un componente es el componente el que muestra el helpertext
          helperText={helperText}
          type={type}
          {...props}
        />
      )}
    </Box>
  );
}

export default BaseField;
