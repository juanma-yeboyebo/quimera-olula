import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Popover,
  Select,
  TextField,
  Typography,
} from "@quimera/thirdparty";
import React, { useState } from "react";

import { Icon, IconButton, NumberFormat } from "../../";
import { useStyles } from "./style";

const decimalSeparator = ",";
const signos = [">=", "=", "<="];

function PopoverNumber({ option, handlePopoverClose, anchorEl, idPadre, alAplicar }) {
  const classes = useStyles();
  const [fieldValue, setFieldValue] = useState(option.value);
  const [selectValue, setSelectValue] = useState(option.signo || signos[1]);
  const decimales = option.decimal ? 2 : 0;

  const handleAplicar = () => {
    // const valor = document.getElementById(`${idPadre}${option.nombreCampo}Field1`).value
    alAplicar({ value: fieldValue, signo: selectValue });
  };

  const handleFieldKeyUp = e => {
    if (e.keyCode === 13 && e.target.value !== "") {
      // si pulsa intro y el field no esta vacío
      handleAplicar();
    }
  };

  const handleFieldChange = (e, _o) => {
    const newValue = e.target.value;
    // newValue = util.formatter(newValue, decimales)
    setFieldValue(newValue);
  };

  const handleSelectChange = e => {
    const value = e.target.value;
    setSelectValue(value);
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
        {/* <Box display='flex' justifyContent="center" alignItems='center'>
          <Typography style={{ fontSize: '15px' }}>Contiene</Typography>
        </Box> */}
        <Box mx={2} display="flex" justifyContent="center" alignItems="center">
          <FormControl style={{ minWidth: 60, marginRight: "16px" }}>
            <Select
              labelId={`${idPadre}${option.nombreCampo}SelectLabel`}
              id={`${idPadre}${option.nombreCampo}Select`}
              value={selectValue}
              onChange={handleSelectChange}
              renderValue={op => (
                <div
                  key={`MenuItemSelection${idPadre}${option.nombreCampo}`}
                  value={op}
                  style={{ textAlign: "center" }}
                >
                  {op}
                </div>
              )}
            >
              {signos.map((signo, index) => (
                <MenuItem key={`selectSigno${index}`} value={signo} style={{ minHeight: "40px" }}>
                  <span style={{ textAlign: "center", width: "100%" }}>{signo}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* <TextField autoFocus
            onChange={handleTextFieldChange}
            onKeyUp={handleTextFieldKeyUp}
            value={fieldText} style={{ width: '161px' }} fullWidth id={`${idPadre}${option.nombreCampo}Field`} variant="standard" /> */}
          <NumberFormat
            // thousandSeparator={thousandSeparator}
            decimalSeparator={decimalSeparator}
            fixedDecimalScale={true}
            decimalScale={decimales}
            // variant='outlined'
            margin="dense"
            inputProps={{ style: { textAlign: "end" } }}
            customInput={TextField}
            // new
            style={{ width: 120 }}
            variant="standard"
            id={`${idPadre}${option.nombreCampo}Field`}
            autoFocus
            fullWidth
            value={fieldValue}
            onChange={handleFieldChange}
            onKeyUp={handleFieldKeyUp}
          />
        </Box>
        <Box mt={1} display="flex" justifyContent="center" alignItems="center">
          <Button
            color="primary"
            variant="contained"
            className={classes.buttonPrimarioSmall}
            disabled={fieldValue === ""}
            onClick={() => handleAplicar()}
          >
            APLICAR
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}

export default PopoverNumber;
