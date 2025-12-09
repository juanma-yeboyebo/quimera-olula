import { Box, Button, FormControlLabel, Popover, Switch, Typography } from "@quimera/thirdparty";
import React, { useState } from "react";

import { Icon, IconButton } from "../../";
import { useStyles } from "./style";

function PopoverBoolean({ option, handlePopoverClose, anchorEl, idPadre, alAplicar }) {
  const classes = useStyles();
  const [checked, setChecked] = useState(option.value === "" ? false : option.value);

  const handleAplicar = () => {
    // const valor = document.getElementById(`${idPadre}${option.nombreCampo}Field1`).value
    alAplicar(checked);
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
                id="popover"
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
          <FormControlLabel
            autoFocus
            labelPlacement="start"
            control={
              <Switch checked={Boolean(checked)} onChange={e => setChecked(e.target.checked)} />
            }
            label={option.labelChip}
          />
        </Box>
        <Box mt={1} display="flex" justifyContent="center" alignItems="center">
          <Button
            color="primary"
            variant="contained"
            className={classes.buttonPrimarioSmall}
            disabled={checked === null}
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
