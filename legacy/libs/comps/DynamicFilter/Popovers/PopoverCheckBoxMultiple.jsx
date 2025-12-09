import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Popover,
  Typography,
} from "@quimera/thirdparty";
import React, { useState } from "react";

import { Icon, IconButton } from "../../";
import { useStyles } from "./style";

function PopoverCheckBoxMultiple({ option, handlePopoverClose, anchorEl, idPadre, alAplicar }) {
  const classes = useStyles();
  // const [fieldText, setFieldText] = useState(option.value)
  // const estadoInicial = {}
  const [opciones, setOpciones] = useState(option.opciones);
  const [chipValue, setChipValue] = useState(option.value);

  function hayAlgunoChecked() {
    let alguno = false;
    opciones.map(op => {
      if (op.value === true) {
        alguno = true;
      }
    });

    return alguno;
  }

  const [aplicarDisabled, setAplicarDisabled] = useState(hayAlgunoChecked());

  const handleAplicar = () => {
    // alAplicar(valor)
    alAplicar({ opciones, chipValue });
  };

  const cambiarValue = options => {
    // solo seria para mostrarlo bien en el chip
    const value = options
      .map(op => (op.value ? op.valor : ""))
      .filter(op => op !== "")
      .join(", ");
    setChipValue(value);
    // alert(option.value)
  };

  const handleChange = event => {
    // alert(event.target.name + ' -- ' + event.target.checked)
    // setOpciones({ ...opciones, [event.target.name]: event.target.checked })
    const newOpciones = opciones.slice(); // copiamos el estado
    newOpciones[newOpciones.findIndex(op => op.key === event.target.name)].value =
      event.target.checked;
    setOpciones(newOpciones);
    cambiarValue(newOpciones);
    setAplicarDisabled(hayAlgunoChecked());
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

        <Box mx={2} display="flex" justifyContent="center" alignItems="center">
          <FormGroup>
            {option.opciones.map(op => (
              <FormControlLabel
                key={op.key}
                control={
                  <Checkbox
                    checked={opciones.find(opt => op.key === opt.key).value}
                    onClick={handleChange}
                    name={op.key}
                  />
                }
                label={op.valor}
              />
            ))}
          </FormGroup>
        </Box>
        <Box mt={1} display="flex" justifyContent="center" alignItems="center">
          <Button
            color="primary"
            variant="contained"
            className={classes.buttonPrimarioSmall}
            disabled={!aplicarDisabled}
            onClick={() => handleAplicar()}
          >
            APLICAR
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}

export default PopoverCheckBoxMultiple;
