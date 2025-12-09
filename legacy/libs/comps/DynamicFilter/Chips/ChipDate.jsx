import { Chip } from "@quimera/thirdparty";
import { util } from "quimera";
import React from "react";

import { ChipLabel } from "./ChipLabel";

function ChipDate({ option, onClick, alEliminar, clave, getTagProps, maxWidth, ...props }) {
  return (
    <Chip
      variant="outlined"
      {...getTagProps({ clave })}
      label={
        <ChipLabel maxWidth={maxWidth}>
          {option.value
            ? option.value.persistencia
              ? `${option.labelChip} ${option.value.nombre}`
              : option.value.fecha
              ? `${option.labelChip} ${util.formatDate(option.value.fecha)}`
              : option.value.desde && !option.value.hasta
              ? `${option.labelChip} ${option.textoDesde} ${util.formatDate(option.value.desde)}`
              : option.value.hasta && !option.value.desde
              ? `${option.labelChip} ${option.textoHasta} ${util.formatDate(option.value.hasta)}`
              : !option.value.desde &&
                !option.value.hasta &&
                !option.value.fecha &&
                !option.value.persistencia
              ? `${option.labelChip} Es nula`
              : `${option.labelChip} ${option.textoDesde} ${util.formatDate(option.value.desde)} ${
                  option.value.hasta
                    ? ` ${option.textoHasta} ${util.formatDate(option.value.hasta)}`
                    : ""
                }`
            : "NO hay value ERROR"}
        </ChipLabel>
      }
      onClick={event => onClick(event, option)}
      onDelete={props.disabled ? null : event => alEliminar(event, option)}
      //
      {...props}
      disabled={false}
    />
  );
}

export default ChipDate;
