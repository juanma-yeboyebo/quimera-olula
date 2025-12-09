import { Box, Button, Popover, TextField, Typography } from "@quimera/thirdparty";
import React, { useState } from "react";

import { Icon, IconButton } from "../../";
import { useStyles } from "./style";

function PopoverTexto({ option, handlePopoverClose, anchorEl, idPadre, alAplicar }) {
  const classes = useStyles();
  const [fieldText, setFieldText] = useState(option.value);

  const handleAplicar = () => {
    // const valor = document.getElementById(`${idPadre}${option.nombreCampo}Field1`).value
    alAplicar(fieldText);
  };

  const handleTextFieldKeyUp = e => {
    if (e.keyCode === 13 && e.target.value !== "") {
      // si pulsa intro y el field no esta vacío
      handleAplicar();
    }
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
                id="closePopoverTexto"
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
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography style={{ fontSize: "15px" }}>Contiene</Typography>
        </Box>
        <Box mx={2} display="flex" justifyContent="center" alignItems="center">
          <TextField
            autoFocus /* defaultValue={option.value} */
            onChange={event => setFieldText(event.target.value)}
            onKeyUp={handleTextFieldKeyUp}
            value={fieldText}
            style={{ width: "161px" }}
            fullWidth
            id={`${idPadre}${option.nombreCampo}Field`}
            variant="standard"
          />
        </Box>
        <Box mt={1} display="flex" justifyContent="center" alignItems="center">
          <Button
            color="primary"
            variant="contained"
            className={classes.buttonPrimarioSmall}
            disabled={fieldText === ""}
            onClick={() => handleAplicar()}
          >
            APLICAR
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}

export default PopoverTexto;
