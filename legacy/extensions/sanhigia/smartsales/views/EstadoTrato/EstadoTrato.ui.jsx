import "./EstadoTrato.style.scss";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Field,
  Grid,
  Icon,
  QSection,
} from "@quimera/comps";
import { SelectorValores } from "@quimera-extension/base-almacen";
import { DirCliente } from "@quimera-extension/base-ventas";
import { Evento } from "@quimera-extension/sanhigia-devol_pedidos";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import { useEffect } from "react";

import {
  CausaPerdidaTrato,
  EstadoTratoComp,
  FieldTitle,
  FieldValue,
  MainBox,
  SSQSection,
} from "../../comps";

function EstadoTrato({ tratoProp, refreshCallback, noMostrarBotonesProp }) {
  const [
    {
      aprobandoPresupuesto,
      codDirCli,
      creandoPedido,
      creandoPresupuesto,
      crearPedido,
      crearPresupuesto,
      dirCanaria,
      modalCausaPerdidaVisible,
      modalFechasLicencia,
      modalSolicitarEvento,
      noMostrarBotones,
      origenMercanciaOptions,
      regimenIva,
      trato,
      tratoBuffer,
    },
    dispatch,
  ] = useStateValue();

  const schemaCausasPerdidaTrato = getSchemas()?.causasPerdidaTrato;
  const schemaTrato = getSchemas()?.trato;
  const tratoPerdido = trato?.estado === "Perdido";
  const esVentaProducto = trato?.idTipotrato === 1;
  const classExigirGenerarPedido = trato?.exigirGenerarPedido
    ? "exigirGenerarPedido"
    : "DisablePedido";

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        tratoProp,
        noMostrarBotonesProp,
        refreshCallback,
      },
    });
  }, [trato, refreshCallback, dispatch]);

  return (
    <Quimera.Template id="EstadoTrato">
      <EstadoTratoComp
        field="tratoBuffer.estado"
        trato={trato}
        value={trato?.estado}
        procesando={creandoPedido || aprobandoPresupuesto}
        onChanged={value =>
          dispatch({ type: "compruebaAccionCambioEstadoTrato", payload: { value } })
        }
        style={{
          margin: `25px 5px ${tratoPerdido ? "20px" : "0px"} 5px`,
          width: "100%",
          height: "60px",
        }}
      />
      {!noMostrarBotones && (
        <>
          {tratoPerdido && (
            <MainBox style={{ marginBottom: "25px" }} className="CausaPerdida">
              <SSQSection
                actionPrefix="causa"
                dynamicComp={() => (
                  <CausaPerdidaTrato
                    id="tratoBuffer.idPerdida"
                    idTipotrato={tratoBuffer?.idTipotrato}
                    schema={schemaCausasPerdidaTrato}
                    label="Causa"
                    fullWidth
                    async
                  />
                )}
                saveDisabled={() => !tratoBuffer.idPerdida}
              >
                <Box w={1} display="flex" justifyContent="space-between">
                  <FieldTitle>Causa:</FieldTitle>
                  <FieldValue className="CausaPerdidaText">{trato?.descripcionPerdida}</FieldValue>
                </Box>
              </SSQSection>
            </MainBox>
          )}

          <Box className={classExigirGenerarPedido}>
            {trato?.idPedido && (
              <MainBox>
                <Box w={1} display="flex" justifyContent="space-between" alignItems={"center"}>
                  <FieldTitle>Pedido:</FieldTitle>
                  <FieldValue>{trato?.codPedido}</FieldValue>
                  <Icon
                    style={{ cursor: "pointer" }}
                    onClick={() => dispatch({ type: "onIrAPedidoClicked" })}
                  >
                    arrow_forward
                  </Icon>
                </Box>
              </MainBox>
            )}

            {trato?.idPresupuesto ? (
              <MainBox style={{ marginBottom: "25px" }}>
                <Box w={1} display="flex" justifyContent="space-between" alignItems={"center"}>
                  <FieldTitle>Presupuesto:</FieldTitle>
                  <FieldValue>{trato?.codPresupuesto}</FieldValue>
                  <Icon
                    style={{ cursor: "pointer" }}
                    onClick={() => dispatch({ type: "onIrAPresupuestoClicked" })}
                  >
                    arrow_forward
                  </Icon>
                </Box>
              </MainBox>
            ) : (
              !trato?.idPedido && (
                <Box style={{ marginTop: "25px", marginBottom: "25px" }}>
                  {!tratoPerdido && (
                    <Box style={{ display: "flex", justifyContent: "center" }}>
                      {creandoPresupuesto ? (
                        <Box align="center">
                          Creando presupuesto&nbsp;&nbsp;
                          <br />
                          <CircularProgress />
                        </Box>
                      ) : (
                        <Button
                          id="crearPresupuesto"
                          text="Crear presupuesto"
                          disabled={tratoBuffer.idPerdida}
                        />
                      )}
                    </Box>
                  )}
                </Box>
              )
            )}
          </Box>
        </>
      )}

      <Dialog open={modalFechasLicencia}>
        <DialogTitle id="form-dialog-title"> Fechas licencia </DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="form-dialog-description">
            El trato se asociará a este usuario como agente. Eliga la causa entre las opciones
            disponibles para este tipo de trato.
          </DialogContentText> */}
          <Field.Date
            id="tratoBuffer.fechaLicenciaFin"
            schema={schemaTrato}
            fullWidth
            label="Fecha de finalización proceso"
          />
          <Field.Date
            id="tratoBuffer.fechaLicenciaCaducidad"
            schema={schemaTrato}
            fullWidth
            label="Fecha de caducidad licencia"
          />
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent="space-between">
            <Button
              id="cancelar"
              text="Cancelar"
              variant="text"
              color="secondary"
              onClick={() => dispatch({ type: "cancelarCrearLicenciaFarma" })}
            />
            <Button
              id="confirmar"
              text="Ok"
              variant="text"
              color="primary"
              disabled={!tratoBuffer.fechaLicenciaCaducidad || !tratoBuffer.fechaLicenciaFin}
              onClick={() => dispatch({ type: "onCearLicenciaFarmaConfirm" })}
            />
          </Grid>
        </DialogActions>
      </Dialog>

      <Dialog open={modalCausaPerdidaVisible}>
        <DialogTitle id="form-dialog-title">Causa de pérdida de trato</DialogTitle>
        <DialogContent>
          <DialogContentText id="form-dialog-description">
            El trato se asociará a este usuario como agente. Eliga la causa entre las opciones
            disponibles para este tipo de trato.
          </DialogContentText>
          <CausaPerdidaTrato
            id="tratoBuffer.idPerdida"
            idTipotrato={tratoBuffer?.idTipotrato}
            schema={schemaCausasPerdidaTrato}
            label="Causa"
            fullWidth
            async
          />
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent="space-between">
            <Button
              id="cancelar"
              text="Cancelar"
              variant="text"
              color="secondary"
              onClick={() => dispatch({ type: "cancelarModalCausaPerdida" })}
            />
            <Button
              id="confirmar"
              text="Ok"
              variant="text"
              color="primary"
              disabled={!tratoBuffer.idPerdida}
              onClick={() => dispatch({ type: "confirmarCausaPerdida" })}
            />
          </Grid>
        </DialogActions>
      </Dialog>

      <Dialog open={modalSolicitarEvento} fullWidth>
        <DialogTitle id="form-dialog-title">Seleciona un evento</DialogTitle>
        <DialogContent>
          <QSection
            actionPrefix="seleccionaEvento"
            alwaysActive
            saveDisabled={() => !tratoBuffer.codEvento}
            dynamicComp={() => (
              <Grid container>
                <Grid item xs={12}>
                  <Evento
                    id="tratoBuffer.codEvento"
                    codEvento={tratoBuffer.codEvento}
                    label="Evento"
                    meses={2}
                    fullWidth
                  />
                </Grid>
              </Grid>
            )}
          ></QSection>
        </DialogContent>
      </Dialog>

      <Dialog open={crearPedido} fullWidth>
        <DialogTitle id="form-dialog-title">Datos del cliente</DialogTitle>
        <DialogContent>
          <>
            {trato?.cliente && !trato?.dirAuto ? (
              <QSection
                actionPrefix="nuevoPedido"
                alwaysActive
                saveDisabled={() => !tratoBuffer.codEvento || !codDirCli}
                dynamicComp={() => (
                  <Grid container>
                    <Grid item xs={12}>
                      <DirCliente
                        id="codDirCli"
                        codCliente={trato?.cliente}
                        soloDirEnvio={true}
                        label="Dirección"
                        fullWidth
                      />
                    </Grid>
                    {dirCanaria && (
                      <Grid item xs={12}>
                        <SelectorValores
                          id="regimenIva"
                          label="Origen de salida"
                          valores={origenMercanciaOptions}
                          value={regimenIva}
                          arrayKeyValue
                          fullWidth
                        ></SelectorValores>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Evento
                        id="tratoBuffer.codEvento"
                        codEvento={tratoBuffer.codEvento}
                        label="Evento"
                        meses={2}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                )}
              ></QSection>
            ) : (
              <Quimera.View
                id="PedidosCliNuevo"
                idTrato={trato?.idTrato}
                codAgenteProp={trato?.codAgente}
                codAgenteMktProp={util.getUser().agente}
                callbackGuardado={payload =>
                  dispatch({
                    type: "onNuevoPedidoGuardado",
                    payload: { ...payload, idPedido: payload.id },
                  })
                }
              />
            )}
          </>
        </DialogContent>
      </Dialog>

      <Dialog open={crearPresupuesto} fullWidth>
        <DialogTitle id="form-dialog-title">Datos del cliente</DialogTitle>
        <DialogContent>
          <>
            {trato?.cliente && !trato?.dirAuto ? (
              <QSection
                actionPrefix="nuevoPresupuesto"
                alwaysActive
                dynamicComp={() => (
                  <Grid container>
                    <Grid item xs={12}>
                      <DirCliente
                        id="codDirCli"
                        codCliente={trato?.cliente}
                        soloDirEnvio={true}
                        label="Dirección"
                        fullWidth
                      />
                    </Grid>
                    {dirCanaria && (
                      <Grid item xs={12}>
                        <SelectorValores
                          id="regimenIva"
                          label="Origen de salida"
                          valores={origenMercanciaOptions}
                          value={regimenIva}
                          arrayKeyValue
                          fullWidth
                        ></SelectorValores>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Evento
                        id="tratoBuffer.codEvento"
                        codEvento={tratoBuffer.codEvento}
                        label="Evento"
                        meses={2}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                )}
              ></QSection>
            ) : (
              <Quimera.View
                id="PresupuestoCliNuevo"
                idTratoProp={trato?.idTrato}
                codAgenteProp={trato?.codAgente}
                codAgenteMktProp={util.getUser().agente}
                callbackGuardado={payload =>
                  dispatch({
                    type: "onNuevoPresupuestoGuardado",
                    payload: { ...payload, idPresupuesto: payload.id },
                  })
                }
              />
            )}
          </>
        </DialogContent>
      </Dialog>
    </Quimera.Template>
  );
}

export default EstadoTrato;
