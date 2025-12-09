import { Cliente } from "@quimera-extension/base-ventas";
import { Box, Button, Container, Field, Icon } from "@quimera/comps";
import { CircularProgress } from "@quimera/thirdparty";
import Quimera, { getSchemas, navigate, useStateValue } from "quimera";
import { useEffect, useState } from "react";

import { ConfirmButton, MainBox } from "../../comps";

function NuevoContacto({ callbackCerrado, codCliente = false }) {
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
    <Quimera.Template id="NuevoContacto">
      <Container maxWidth="xs">
        <MainBox
          title="Crear contacto"
          before={true}
          callbackCerrado={
            callbackCerrado
              ? payload => dispatch({ type: "onNuevoContactoGuardado", payload })
              : null
          }
        >
          <Field.Schema id="contacto.nombre" schema={schemaContacto} fullWidth />
          <Field.Schema
            id="contacto.email"
            schema={schemaContacto}
            fullWidth
            endAdornment={
              !!contacto.email && (
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
          {estadoEmail === "validoYaExisite" && contacto.codContacto && (
            <Box display={"flex"} justifyContent={"flex-end"}>
              <Button
                id="irAlContacto"
                text={"El contacto ya existe, ir al contacto"}
                variant="text"
                style={{ color: "#eb910c" }}
                onClick={() => {
                  navigate(`/ss/contacto/${contacto.codContacto}`);
                }}
              />
            </Box>
          )}
        </MainBox>
        <MainBox>
          <Field.Schema id="contacto.telefono" schema={schemaContacto} fullWidth />
        </MainBox>
        <MainBox>
          <Field.Schema id="contacto.direccion" schema={schemaContacto} fullWidth />
          <Field.Schema id="contacto.codPostal" schema={schemaContacto} fullWidth />
        </MainBox>
        <MainBox>
          <Cliente id="contacto.cliente" label="Cliente" fullWidth async />
        </MainBox>
        <ConfirmButton id="saveContacto" />
      </Container>
    </Quimera.Template>
  );
}

export default NuevoContacto;
