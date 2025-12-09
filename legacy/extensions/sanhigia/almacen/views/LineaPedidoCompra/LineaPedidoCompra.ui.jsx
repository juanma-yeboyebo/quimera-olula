import {
  Box,
  Button,
  Collapse,
  Field,
  Grid,
  LinearProgress,
  QSection,
  Typography,
} from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import { useEffect } from "react";

import { Ubicacion } from "../../comps";

function LineaPedidoCompra({
  callbackGuardada,
  callbackCambiada,
  disabled,
  lineaInicial,
  useStyles,
}) {
  const [{ cambio, linea, tipoCambio, onSuccess }, dispatch] = useStateValue();
  const classes = useStyles();
  const schema = getSchemas().lineasPedidoCompra;
  const { buffer } = linea;

  useEffect(() => {
    util.publishEvent(linea.event, callbackCambiada);
  }, [linea.event.serial]);

  useEffect(() => {
    dispatch({
      type: "onInitLinea",
      payload: {
        initLinea: lineaInicial,
      },
    });
  }, [lineaInicial]);

  useEffect(() => {
    dispatch({
      type: "onCantCambiada",
      payload: {
        cantidad: lineaInicial.shCantAlbaran,
      },
    });
  }, [lineaInicial.shCantAlbaran]);

  return (
    <Quimera.Template id="LineaPedidoCompra">
      {linea.buffer._status === "deleting" && (
        <Box width={1}>
          <Typography variant="body2">Borrando línea...</Typography>
          <LinearProgress />
        </Box>
      )}
      <Collapse in={linea.buffer._status !== "deleting"}>
        <Grid container direction="column" spacing={0}>
          <Grid container direction="column" item xs={12} spacing={1} justifyContent="flex-start" alignItems="center">
            <Grid item xs={6}>
              <QSection
                title="Ubicación"
                actionPrefix="linea/ubicacion"
                alwaysInactive={disabled}
                dynamicComp={() => (
                  <Grid container direction="column" spacing={1}>
                    <Grid item xs={12}>
                      <Ubicacion id="codUbicacionArticulo" fullWidth async />
                    </Grid>
                  </Grid>
                )}
                saveDisabled={() => !schema.isValid(buffer)}
              >
                <Typography variant="h6">{buffer.codUbicacionArticulo}</Typography>
              </QSection>
            </Grid>
            {linea.buffer.porLotes ? (
              <Grid item xs={6}>
                <Box width={1} display="flex" alignItems="center" justifyContent="center">
                  <Button
                    id="irAMovilotes"
                    text={"Movimientos por lotes"}
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      dispatch({
                        type: "irAMovilotes",
                        payload: { idLinea: linea.buffer.idLinea, idPedido: linea.buffer.idPedido },
                      });
                    }}
                  // startIcon={<Icon>{editable ? "arrow_circle_down" : "arrow_circle_up"}</Icon>}
                  />
                </Box>
              </Grid>
            ) : (
              <Grid item xs={6}>
                <QSection
                  title="Cantidad a enviar"
                  actionPrefix="linea/shCantAlbaran"
                  alwaysInactive={disabled}
                  dynamicComp={() => (
                    <Grid container direction="column" spacing={1}>
                      <Grid item xs={12}>
                        <Field.Schema
                          label=""
                          id="linea.buffer/shCantAlbaran"
                          schema={schema}
                          fullWidth
                          autoFocus
                          onFocus={event => event.target.select()}
                        />
                      </Grid>
                    </Grid>
                  )}
                  saveDisabled={() => !schema.isValid(buffer)}
                >
                  <Typography variant="h6" align="right">{`${util.formatter(
                    linea.buffer.shCantAlbaran || 0,
                    2,
                  )}`}</Typography>
                </QSection>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Collapse>
    </Quimera.Template>
  );
}

export default LineaPedidoCompra;
