import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Popover /* , InputLabel */,
  Select,
  Tooltip,
  Typography,
} from "@quimera/thirdparty";
import React, { useState } from "react";

import { Field, Icon, IconButton } from "../../";
import { useStyles } from "./style";

const IconPersistente = () => (
  <Tooltip title="Fecha persistente">
    <Icon fontSize="small" style={{ marginRight: "5px" }}>
      all_inclusive
    </Icon>
  </Tooltip>
);

const getDateOption = option =>
  editionMode(option.value) ? option.value : option.opcionesPredefinidas[0];
const editionMode = value => value.fecha || value.persistencia || value.desde || value.hasta;
// const getInicialFechas = (value) => value.persistencia ? { fecha: null, desde: null, hasta: null } : value

function PopoverBoolean({ option, handlePopoverClose, anchorEl, idPadre, alAplicar }) {
  const classes = useStyles();
  const [fechas, setFechas] = useState(option.value /* getInicialFechas(option.value) */);
  const [dateOption, setDateOption] = useState(
    /* option.opcionesPredefinidas[0] */ getDateOption(option),
  );

  const handleAplicar = value => {
    alAplicar(value || fechas);
  };

  const handleSelectChange = e => {
    const value = e.target.value;
    if (value.persistencia) {
      // si es un campo con persistencia aplicamos sin dejar editar
      /* setFechas(value); */ handleAplicar(value);

      return;
    }
    setDateOption(value);
    setFechas(value);
  };

  const handleDateFieldChange = (e, campo) => {
    const newValue = e.target.value;
    // fechas[campo] = newValue
    setFechas({
      ...fechas,
      [campo]: newValue,
    });
  };

  return (
    <Popover
      id={`${idPadre}${option.nombreCampo}Popover`}
      open={Boolean(option)}
      anchorEl={anchorEl}
      onClose={handlePopoverClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <Box>
        <Box className={classes.cabecera}>
          <Box height="100%" display="flex" alignItems="center" justifyContent="space-between">
            <Box flexGrow={1}>
              <Typography style={{ color: "white" }}>{` ${option.labelNombre} `}</Typography>
            </Box>
            <Box>
              <IconButton
                size="small"
                onClick={() => {
                  handlePopoverClose();
                }}
              >
                <Icon style={{ color: "white", fontSize: "1.1rem" }}>close</Icon>
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box mx={2} mt={2} display="flex" justifyContent="center" alignItems="center">
          <FormControl style={{ width: 200 }}>
            <Select
              displayEmpty
              labelId={`${idPadre}${option.nombreCampo}SelectLabel`}
              id={`${idPadre}${option.nombreCampo}Select`}
              value={dateOption}
              onChange={handleSelectChange}
              renderValue={op =>
                op.nombre === "" ? (
                  <div
                    key={`MenuItemSelection${idPadre}${option.nombreCampo}`}
                    value={op}
                    style={{ color: "lightGrey" }}
                  >
                    {option.labelNombre}
                  </div>
                ) : (
                  <div
                    key={`MenuItemSelection${idPadre}${option.nombreCampo}`}
                    style={{ display: "flex", alignItems: "center" }}
                    value={op}
                  >
                    {op.persistencia && <IconPersistente />}
                    {op.nombre}
                  </div>
                )
              }
            >
              {option.opcionesPredefinidas.map((op, index) =>
                op.nombre === "" ? (
                  <MenuItem
                    key={`MenuItem${index}${idPadre}${option.nombreCampo}`}
                    value={op}
                    style={{ color: "lightGrey", minHeight: "40px" }}
                  >
                    {option.labelNombre}
                  </MenuItem>
                ) : (
                  <MenuItem
                    key={`MenuItem${index}${idPadre}${option.nombreCampo}`}
                    value={op}
                    style={{ minHeight: "40px", display: "flex", alignItems: "center" }}
                  >
                    {op.persistencia && <IconPersistente />}
                    {op.nombre}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>
        </Box>
        {!fechas.persistencia && (
          <>
            {fechas.fecha || (dateOption.nombre !== "" && !fechas.desde && !fechas.hasta) ? (
              <Box mx={2} mt={2} display="flex" justifyContent="center" alignItems="center">
                <Field.Date
                  style={{ width: 200 }}
                  value={fechas.fecha}
                  onChange={ev => handleDateFieldChange(ev, "fecha")}
                  label={"Fecha: "}
                  disabled={Boolean(fechas.desde !== null || fechas.hasta !== null)}
                  autoOk
                />
              </Box>
            ) : null}

            {fechas.desde || (dateOption.nombre === "" && !fechas.fecha) ? (
              <Box mx={2} mt={2} display="flex" justifyContent="center" alignItems="center">
                <Field.Date
                  style={{ width: 200 }}
                  value={fechas.desde || null}
                  onChange={ev => handleDateFieldChange(ev, "desde")}
                  label={"Desde: "}
                  disabled={fechas.fecha !== null && !fechas.persistencia}
                  autoOk
                />
              </Box>
            ) : null}

            {fechas.hasta || (dateOption.nombre === "" && !fechas.fecha) ? (
              <Box mx={2} mt={2} display="flex" justifyContent="center" alignItems="center">
                <Field.Date
                  style={{ width: 200 }}
                  value={fechas.hasta || null}
                  onChange={ev => handleDateFieldChange(ev, "hasta")}
                  label={"Hasta: "}
                  disabled={fechas.fecha !== null && !fechas.persistencia}
                  autoOk
                />
              </Box>
            ) : null}
          </>
        )}
        <Box mt={1} display="flex" justifyContent="center" alignItems="center">
          <Button
            color="primary"
            variant="contained"
            className={classes.buttonPrimarioSmall}
            disabled={fechas.hasta === null && fechas.desde === null && fechas.fecha === null}
            onClick={() => handleAplicar()}
          >
            APLICAR
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}

export default PopoverBoolean;
