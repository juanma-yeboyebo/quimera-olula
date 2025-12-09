import { Cliente } from "@quimera-extension/base-ventas";
import { Box, Button, Field, Grid, Icon, QSection } from "@quimera/comps";
import { CircularProgress } from "@quimera/thirdparty";
import Quimera, { getSchemas, navigate, useStateValue, util } from "quimera";
import { useEffect, useState } from "react";

function NuevoContactoMD({ callbackCerrado, codCliente = false }) {
  const schemaContacto = getSchemas().contacto;
  const [{ contacto, estadoEmail }, dispatch] = useStateValue();
  const [timer, setTimer] = useState();
  useEffect(() => {
    !!callbackCerrado &&
      dispatch({
        type: "onInit",
        payload: { callbackCerrado, codCliente },
      });
  }, [callbackCerrado]);

  useEffect(() => {
    util.publishEvent(contacto.event, callbackCerrado);
  }, [contacto.event.serial]);

  const endAdornmentEmail = {
    invalido: <Icon style={{ color: "#ef5350" }}>dangerous</Icon>,
    comprobando: (
      <Box mt={0.3}>
        {" "}
        <CircularProgress size={22} style={{ color: "#0288d1" }} thickness={5} />{" "}
      </Box>
    ),
    // comprobando: <Icon style={{ color: "#0288d1" }}>more_horiz</Icon>,
    validoNoExisite: <Icon style={{ color: "#4caf50" }}>check_circle_outline</Icon>,
    validoYaExisite: <Icon style={{ color: "#eb910c" }}>check_circle_outline</Icon>,
  };

  const updateTime = 1000;
  const handleDelay = event => {
    clearTimeout(timer);
    const value = event.target.value;
    const valido = !!value.match(/^(?!\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}$/);
    dispatch({ type: "onContactoEmailChanged", payload: { value } });

    if (valido) {
      setTimer(setTimeout(() => dispatch({ type: "checkEmail", payload: { value } }), updateTime));
    } else {
      dispatch({ type: "setEmailInvalido" });
    }
  };

  return (
    <Quimera.Template id="NuevoContactoMD">
      <QSection
        actionPrefix="nuevoContacto"
        alwaysActive
        dynamicComp={() => (
          <Grid container>
            <Grid item xs={12}>
              <Field.Schema
                id="contacto.buffer/nombre"
                label="Nombre"
                fullWidth
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={8}>
              <Field.Schema
                id="contacto.buffer/email"
                label="Email"
                fullWidth
                endAdornment={
                  !!contacto.buffer?.email && (
                    <Box
                      height="25px"
                      width="25px"
                      display={"flex"}
                      justifyContent={"center"}
                      alignContent={"center"}
                    >
                      {endAdornmentEmail[estadoEmail]}
                    </Box>
                  )
                }
                onChange={event => handleDelay(event)}
              />
              {estadoEmail === "validoYaExisite" && contacto.buffer.codContacto && (
                <Box display={"flex"} justifyContent={"flex-end"}>
                  <Button
                    id="irAlContacto"
                    text={"El contacto ya existe, ir al contacto"}
                    variant="text"
                    style={{ color: "#eb910c" }}
                    onClick={() => {
                      navigate(`/ss/contactosmd/${contacto.buffer.codContacto}`);
                    }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={3}>
              <Field.Schema
                id="contacto.buffer/telefono"
                label="Teléfono"
                fullWidth
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={8} />
            <Grid item xs={9}>
              <Field.Schema
                id="contacto.buffer/direccion"
                label="Dirección"
                fullWidth
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={2}>
              <Field.Schema
                id="contacto.buffer/codPostal"
                label="Código postal"
                fullWidth
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12}>
              <Cliente id="contacto.buffer.cliente" label="Cliente" fullWidth async />
            </Grid>
          </Grid>
        )}
        saveDisabled={() => !schemaContacto.isValid(contacto.buffer)}
      ></QSection>
    </Quimera.Template>
  );
}

export default NuevoContactoMD;
