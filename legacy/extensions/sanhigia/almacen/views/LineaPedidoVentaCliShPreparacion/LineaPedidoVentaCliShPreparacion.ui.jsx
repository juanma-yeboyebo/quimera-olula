import {
  Box,
  Button,
  Collapse,
  Dialog,
  Field,
  Grid,
  QBoxButton,
  QSection,
  Typography,
} from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import { useEffect } from "react";

import { ModalInventarioAlVuelo, ModaLotesLinea, Ubicacion } from "../../comps";

function LineaPedidoVentaCliShPreparacion({
  callbackGuardada,
  callbackCambiada,
  disabled,
  lineaInicial,
  useStyles,
}) {
  const [
    {
      cambio,
      linea,
      modalLotesAlmacenVisible,
      modalLotesInventarioVisible,
      onSuccess,
      callbackFocus,
    },
    dispatch,
  ] = useStateValue();
  const classes = useStyles();
  const width = useWidth();
  const schema = getSchemas().lineasPedidoCliPreparacion;
  const { buffer } = linea;

  useEffect(() => {
    util.publishEvent(linea.event, callbackGuardada);
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

  const IconoLock = linea.buffer.cerradaPDA ? "lock_open" : "lock";
  const TituloLock = linea.buffer.cerradaPDA ? "Abrir línea" : "Cerrar línea";
  const urlPedido = `/generarpreparaciones/${linea.buffer.idPedido}`;

  return (
    <Quimera.Template id="LineaPedidoVentaCliShPreparacion">
      <Collapse in={linea.buffer._status !== "deleting"}>
        <Box display="flex" justifyContent="start" alignItems="flex-end">
          <Typography
            component="span"
            variant="body2"
            color="textPrimary"
            style={{ marginLeft: "55px" }}
          >{`Pedido: ${linea.buffer.codPedido}`}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-around" alignItems="flex-end">
          <Box display="flex" alignItems="flex-end" maxWidth={300}>
            <QBoxButton
              id="verPedido"
              title="Ver Pedido"
              icon="edit"
              onClick={() =>
                dispatch({
                  type: "onVerPedidoClicked",
                  payload: { urlPedido },
                })
              }
            ></QBoxButton>
          </Box>
          <Box display="flex" alignItems="flex-end" maxWidth={300}>
            <QBoxButton
              id="cerrarLinea"
              title={TituloLock}
              icon={IconoLock}
              onClick={() => {
                dispatch({
                  type: "onCerrarLineaClicked",
                  payload: { idLineaCerrar: linea.buffer.idLinea },
                });
                callbackFocus();
              }}
            />
          </Box>
          {linea.buffer.porLotes && (
            <Box display="flex" alignItems="flex-end" maxWidth={300}>
              <QBoxButton
                id="inventarioAlVuelo"
                title="Inventario vuelo"
                icon="content_paste"
                onClick={() =>
                  dispatch({
                    type: "onInventarioAlVuelo",
                    payload: { idLinea: linea.buffer.idLinea },
                  })
                }
              ></QBoxButton>
            </Box>
          )}
        </Box>

        <Grid container direction="column" item xs={12} spacing={1} justifyContent="flex-start">
          <Grid item md={6} xs={12}>
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
                      payload: { idLinea: linea.buffer.idLinea },
                    });
                  }}
                  style={{ marginTop: "25px" }}
                />
              </Box>
            </Grid>
          ) : (
            <Grid item md={6} xs={12}>
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
        <Dialog
          open={modalLotesAlmacenVisible}
          fullWidth
          maxWidth="md"
          fullScreen={width === "xs" || width === "sm"}
          onClose={() => dispatch({ type: "onCerrarModalLotesAlmacen" })}
        >
          <ModaLotesLinea key="ModaLotesLinea" disabled={false} dispatch={dispatch} />
        </Dialog>
        <Dialog
          open={modalLotesInventarioVisible}
          fullWidth
          maxWidth="md"
          fullScreen={width === "xs" || width === "sm"}
          onClose={() => dispatch({ type: "onCerrarModalLotesInventario" })}
        >
          <ModalInventarioAlVuelo key="modalLotesInventario" disabled={false} dispatch={dispatch} />
        </Dialog>
      </Collapse>
    </Quimera.Template>
  );
}

export default LineaPedidoVentaCliShPreparacion;
