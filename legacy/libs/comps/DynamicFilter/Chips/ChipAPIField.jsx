import { Avatar, Chip, CircularProgress, Tooltip } from "@quimera/thirdparty";
import { API } from "quimera/lib";
import React, { useEffect, useState } from "react";

import { ChipLabel } from "./ChipLabel";

function ChipAPIField({ option, onClick, alEliminar, clave, getTagProps, maxWidth, ...props }) {
  const [value, setValue] = useState(option.value);

  useEffect(() => {
    setValue(option.value);
    if ((option.value.value === "" || !option.value.value) && option.value.key !== "") {
      API(option.tablaAPI)
        .get()
        .select(option.selectAPI)
        .filter([option.nombreCampo, "eq", option.value.key])
        .success(response => {
          setValue(
            response.data.map(registro => {
              return { key: registro[option.nombreCampo], value: registro[option.buscarPor] };
            })[0],
          );
        })
        .error(error => console.log("Error", error))
        .go();
    }
  }, [option.key, option.value]);

  return (
    <Chip
      variant="outlined"
      {...getTagProps({ clave })}
      label={
        <ChipLabel maxWidth={maxWidth}>
          {value ? (
            <Tooltip title={`${option.labelChip} ${value?.value}`}>
              <span>{`${option.labelChip} ${
                value.value ? value.value?.substring(0, 15) : ""
              }`}</span>
            </Tooltip>
          ) : (
            "Error"
          )}
        </ChipLabel>
      }
      onClick={option.clickDisabled ? null : event => onClick(event, option)}
      onDelete={
        !value?.value
          ? () => true
          : value?.value && props.disabled
          ? null
          : value?.value && option.clickDisabled
          ? null
          : !props.disabled && (event => alEliminar(event, option))
      }
      deleteIcon={
        value?.value ? null : (
          <Avatar>
            <CircularProgress
              key={`cargando${clave}`}
              style={{ maxHeight: "100%", maxWidth: "100%", width: "", height: "" }}
              color="primary"
            />
          </Avatar>
        )
      }
      {...props}
      disabled={false}
    />
  );
}

export default ChipAPIField;
