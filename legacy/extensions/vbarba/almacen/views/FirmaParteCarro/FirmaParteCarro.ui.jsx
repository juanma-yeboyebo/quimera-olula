import { Box, Button, Field, Grid, Icon, IconButton } from "@quimera/comps";
import { Backdrop, CircularProgress, SignaturePad } from "@quimera/thirdparty";
import Quimera, { useStateValue } from "quimera";
import { useEffect, useState } from "react";

import { Contacto } from "../../comps";

function FirmaParteCarro({
  parteCarroProp,
  callbackCerrado,
  callbackChanged,
  codContacto,
  sigpad,
  movCarroProp,
  useStyles,
}) {
  const [{ parteCarro, firmaParteCarro, indicarFirmando }, dispatch] = useStateValue();
  // const _c = useStyles()
  const classes = useStyles();
  const [puedeFirmar, setPuedeFirmar] = useState(false);

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        callbackChanged,
        parteCarroProp,
        movCarroProp,
      },
    });
  }, [dispatch]);

  const puedoFirmar = () =>
    !!firmaParteCarro.firmadopor && !!firmaParteCarro.cifnif && sigPad.isEmpty && !sigPad.isEmpty();

  let sigPad = {};
  useEffect(() => {
    setPuedeFirmar(puedoFirmar());
  }, [firmaParteCarro]);

  const limpiar = () => {
    sigPad.clear();
    setPuedeFirmar(puedoFirmar());
  };
  const handleEnd = () => {
    setPuedeFirmar(puedoFirmar());
  };
  const firmar = () => {
    dispatch({ type: "onFirmarClicked", payload: { firma: sigPad.toDataURL("image/png") } });
  };

  return (
    <Quimera.Template id="FirmaParteCarro">
      {parteCarro !== null && (
        <>
          <Box
            width="100%"
            display="flex"
            alignItems="flex-end"
            className={classes.cabeceraFirmaTitulo}
          >
            <Box>
              <IconButton id="cerrar" size="small" onClick={() => callbackCerrado()}>
                <Icon>close</Icon>
              </IconButton>
            </Box>
            <Box
              flexGrow={1}
              display="flex"
              justifyContent="center"
            >{`Firma parte de carro  ${parteCarro.codigoParte}`}</Box>
          </Box>
          <Box m={2}>
            <Grid container direction="row" spacing={1}>
              <Grid item xs={12} sm={12}>
                <Contacto
                  id="firmaParteCarro.codContacto"
                  codcliente={parteCarro.codCliente}
                  fullWidth
                  label="Seleccione contacto"
                  pl={4}
                />
              </Grid>
              <Grid item xs={8} sm={8}>
                <Field.Text id="firmaParteCarro.firmadopor" label="Firmado por" fullWidth />
              </Grid>
              <Grid item xs={4} sm={4}>
                <Field.Text id="firmaParteCarro.cifnif" label="DNI" />
              </Grid>
              <Grid item xs={6} sm={6}>
                <Field.Date id="firmaParteCarro.fecha" label="Fecha" />
              </Grid>
              <Grid item xs={6} sm={6}>
                <Field.Time id="firmaParteCarro.hora" label="Hora" />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Field.TextArea id="firmaParteCarro.observacionesfirma" label="Observaciones" fullWidth />
              </Grid>
              <Grid item xs={12} sm={12}>
                <SignaturePad
                  id="sigpad"
                  onEnd={handleEnd}
                  canvasProps={{ className: classes.sigPad }}
                  ref={ref => {
                    sigPad = ref;
                  }}
                />
              </Grid>
              <Box id="botonesFirma" width={1} display="flex">
                <Box flexGrow={1}>
                  <Button
                    id="limpiarFirma"
                    text="Limpiar"
                    className={classes.botonPrimarioText}
                    onClick={limpiar}
                  />
                </Box>
                <Box pr={2}>
                  <Button
                    id="firmar"
                    text="Firmar"
                    className={classes.botonPrimarioText}
                    onClick={firmar}
                    disabled={!puedeFirmar}
                  />
                </Box>
              </Box>
            </Grid>
          </Box>
          <Backdrop className={classes.backdrop} open={indicarFirmando}>
            <Box align="center">
              Firmando parte de carro&nbsp;&nbsp;
              <br />
              <CircularProgress />
            </Box>
          </Backdrop>
        </>
      )}
    </Quimera.Template>
  );
}

export default FirmaParteCarro;
