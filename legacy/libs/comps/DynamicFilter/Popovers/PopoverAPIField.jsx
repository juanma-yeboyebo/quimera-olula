import { Autocomplete, Box, Button, Popover, Typography } from "@quimera/thirdparty";
import { API } from "quimera/lib";
import React, { useEffect, useState } from "react";

import { BaseField, Icon, IconButton } from "../../";
import { useStyles } from "./style";

function PopoverAPIField({ option, handlePopoverClose, anchorEl, idPadre, alAplicar, componente }) {
  const classes = useStyles();
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(option.value);
  const handleAplicar = () => {
    // const valor = document.getElementById(`${idPadre}${option.nombreCampo}Field1`).value
    alAplicar(value);
  };

  function handleChange(_event, newValue) {
    newValue === null ? setValue({ key: "", value: "" }) : setValue(newValue);
  }

  function getOptions(val) {
    if (option.componente) {
      return;
    }
    let filtro = [option.buscarPor, "like", val];
    if (option.filtroAPI) {
      filtro = {
        and: [[option.buscarPor, "like", val], option.filtroAPI],
      };
    }
    API(option.tablaAPI)
      .get()
      .select(option.selectAPI)
      // .filter([option.buscarPor, 'like', val])
      .filter(filtro)
      .page({ limit: 15 })
      .success(response =>
        setOptions(
          response.data.map(registro => {
            const keyACoger = option.keyACoger || option.nombreCampo;

            return {
              key: registro[keyACoger],
              value:
                option.tablaAPI === "gt_proyectos"
                  ? (registro.aliascliente ? `#${registro.aliascliente} ` : "") +
                    registro[option.buscarPor]
                  : registro[option.buscarPor],
            };
          }),
        ),
      )
      .error(error => console.log("Error", error))
      .go();
  }

  useEffect(() => {
    // para la primera vez
    if (option.componente) {
      return;
    }
    getOptions("");
  }, [option, componente]);

  useEffect(() => {
    if (option.componente) {
      return;
    }
    if (value && value.value === "" && value.key !== "") {
      API(option.tablaAPI)
        .get()
        .select(option.selectAPI)
        .filter([option.nombreCampo, "eq", value.key])
        .success(response =>
          setValue(
            response.data.map(registro => {
              return { key: registro[option.nombreCampo], value: registro[option.buscarPor] };
            })[0],
          ),
        )
        .error(error => console.log("Error", error))
        .go();
    }
  }, [options, value]);

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
        <Box mx={1} mt={1} style={{ width: "280px" }} display="flex" flexGrow={1}>
          <Box width={1}>
            {option.componente ? (
              option.componente(handleChange, value.key)
            ) : (
              <Autocomplete
                style={{ width: "280px" }}
                getOptionLabel={selectedOption => selectedOption.value}
                // onChange={(event, value) => value === null ? setValue({ key: '', value: '' }) : setValue(value)}
                onChange={handleChange}
                value={value}
                options={options} // setUniqueOption
                renderInput={params => (
                  <BaseField
                    onChange={event => getOptions(event.target.value)}
                    label="Busca"
                    variant="standard"
                    {...params}
                    fullWidth
                  />
                )}
                noOptionsText=""
              />
            )}
          </Box>
        </Box>
        <Box mt={1} display="flex" justifyContent="center" alignItems="center">
          <Button
            color="primary"
            variant="contained"
            className={classes.buttonPrimarioSmall}
            disabled={value?.key === ""}
            onClick={() => handleAplicar()}
          >
            APLICAR
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}

export default PopoverAPIField;
