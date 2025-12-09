import { Box, Button, Field, Grid, Icon, IconButton } from "@quimera/comps";
import { Contacto } from "@quimera-extension/base-albaranes";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useEffect, useState } from "react";

function EnviarAlbaranFirmaExterna({
  albaranProp,
  callbackCancelarEnvioProp,
  callbackCerradoProp,
  callbackEnviadoProp,
  callbackFirmadoProp,
  useStyles,
}) {
  const [{ albaran, compruebaFirmado, estadoEnviarPuestoFirma, mandarPuestoFirmaData }, dispatch] =
    useStateValue();
  const [timer, setTimer] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        albaranProp,
        callbackCancelarEnvioProp,
        callbackCerradoProp,
        callbackEnviadoProp,
        callbackFirmadoProp,
      },
    });
  }, [dispatch]);

  useEffect(() => {
    clearTimeout(timer);
    !!compruebaFirmado &&
      setTimer(
        setInterval(
          () =>
            dispatch({
              type: "compruebaFirmado",
            }),
          1000,
        ),
      );
  }, [compruebaFirmado]);

  const puedeEnviar = () =>
    !!mandarPuestoFirmaData?.firmadopor &&
    !!mandarPuestoFirmaData?.cifnif &&
    !!mandarPuestoFirmaData?.fecha &&
    !!mandarPuestoFirmaData?.hora;

  const bloqueado = () => ["Enviando", "Enviado"].includes(estadoEnviarPuestoFirma);

  return (
    <Quimera.Template id="EnviarAlbaranFirmaExterna">
      <Box
        width="100%"
        display="flex"
        alignItems="flex-end"
        className={classes.cabeceraEnviarFirmaTitulo}
      >
        <Box>
          <IconButton
            id="cerrar"
            size="small"
            onClick={() => dispatch({ type: "onCerrarEnviarPuestoFirmaClicked" })}
            disabled={bloqueado()}
          >
            <Icon>close</Icon>
          </IconButton>
        </Box>
        <Box flexGrow={1} display="flex" justifyContent="center">{`${estadoEnviarPuestoFirma === "Enviado"
            ? "Enviado a puesto de firma"
            : "Enviar a puesto de firma"
          }`}</Box>
      </Box>
      <Box m={2}>
        <Grid container direction="row" spacing={1}>
          <Grid item xs={12} sm={12}>
            <Contacto
              id="mandarPuestoFirmaData.codContacto"
              codcliente={albaran.codCliente}
              fullWidth
              label="Seleccione contacto"
              pl={4}
            />
          </Grid>
          <Grid item xs={8} sm={8}>
            <Field.Text
              id="mandarPuestoFirmaData.firmadopor"
              label="Firmado por"
              fullWidth
              disabled={bloqueado()}
            />
          </Grid>
          <Grid item xs={4} sm={4}>
            <Field.Text id="mandarPuestoFirmaData.cifnif" label="DNI" disabled={bloqueado()} />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Field.Date id="mandarPuestoFirmaData.fecha" label="Fecha" disabled={bloqueado()} />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Field.Time id="mandarPuestoFirmaData.hora" label="Hora" disabled={bloqueado()} />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Field.TextArea
              id="mandarPuestoFirmaData.observacionesfirma"
              label="Observaciones"
              fullWidth
              disabled={bloqueado()}
            />
          </Grid>
          <Box id="botonesFirma" width={1} display="flex" justifyContent={"flex-end"}>
            <Box pr={2}>
              {estadoEnviarPuestoFirma === "Enviado" ? (
                <Button
                  id="cancelarEnvioPuestoFirma"
                  text={"Cancelar operación de firma externa"}
                  variant="text"
                  color="primary"
                  onClick={() => dispatch({ type: "onCancelarEnvioPuestoFirmaClicked" })}
                />
              ) : (
                <Button
                  id="confirmarEnviarPuestoFirma"
                  text={!estadoEnviarPuestoFirma ? "Enviar" : estadoEnviarPuestoFirma}
                  className={classes.botonPrimarioText}
                  variant="text"
                  disabled={!puedeEnviar()}
                />
              )}
            </Box>
          </Box>
        </Grid>
      </Box>
    </Quimera.Template>
  );
}

export default EnviarAlbaranFirmaExterna;
