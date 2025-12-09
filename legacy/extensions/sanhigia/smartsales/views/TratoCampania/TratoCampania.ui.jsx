import "./TratoCampania.style.scss";

import { Familia } from "@quimera-extension/base-almacen";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Field,
  Grid,
  Icon,
  IconButton,
  Typography,
} from "@quimera/comps";
import { CircularProgress } from "@quimera/thirdparty";
import Quimera, { getSchemas, navigate, useStateValue, util } from "quimera";
import { ACL } from "quimera/lib";
import { useEffect } from "react";

import {
  AgenteSmartsales,
  ClienteContacto,
  Contacto,
  FabButton,
  FieldTitle,
  FieldValue,
  ListTareas,
  MainBox,
  Note,
  Pedido,
  SSQSection,
  TipoTrato,
} from "../../comps";

function TratoCampania({ idTrato, idCampania, refreshCallback, deletedCallback }) {
  const [
    {
      asociandoPedido,
      contactoTrato,
      contactosPorCampania,
      tratoBuffer,
      noEncontrado,
      modalAsociarPedidoVisible,
      modalEditarContactoVisible,
      modalResolverDiferenciasVisible,
      trato,
      tareas,
      refrescarContacto,
      notas,
    },
    dispatch,
  ] = useStateValue();

  const schemaTrato = getSchemas()?.tratoCampania;
  const schemaCausasPerdidaTrato = getSchemas()?.causasPerdidaTrato;

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        idTrato,
        refreshCallback,
        deletedCallback,
      },
    });
  }, [idTrato, refreshCallback, deletedCallback]);

  useEffect(() => {
    dispatch({
      type: "onIdTratosProp",
      payload: { id: idTrato ? parseInt(idTrato) : "" },
    });
  }, [dispatch, idTrato]);

  if (noEncontrado) {
    return <Quimera.View id="RegNoEncontrado" />;
  }

  const disableAsignar = tratoBuffer.estadoAsigAgente !== "Auto";
  const resolverDiferencias = tratoBuffer.idContactoCampania !== null;
  const tratoPerdido = trato.estado === "Perdido";
  const agente = util.getGlobalSetting("user_data")?.user?.agente?.toString();
  const tareasList = Object.values(tareas.dict ?? {})
    .filter(tarea => tarea.codAgente === agente)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .map(tarea => tarea.idTarea);

  // console.log("mimensaje_taeas", tareas);

  // const schemaTrato = getSchemas()?.trato;
  // const schemaCausasPerdidaTrato = getSchemas()?.causasPerdidaTrato;
  // const tratoPerdido = tratoBuffer.estado === "Perdido";
  const userIsMKT =
    util.getUser().group === "MKT" || util.getUser().group === "Responsable de marketing"
      ? true
      : false;
  const esVentaProducto = trato?.idTipotrato === 1;
  const classExigirGenerarPedido = trato?.exigirGenerarPedido
    ? "exigirGenerarPedido"
    : "DisablePedido";

  const tratoFarma = trato => trato.idTipotrato === util.getUser().tratolicenciafarma;

  const puedoBorrar = () =>
    trato.estado !== "Ganado" &&
    ((tratoFarma(trato) && trato.codAgente === agente) ||
      (!tratoFarma(trato) && (trato.codAgente === agente || ACL.can("Trato:boton-borrar"))));

  return (
    <Quimera.Template id="Trato">
      <Box
        maxHeight={`calc(100vh - 70px)`}
        height={`calc(100vh - 70px)`}
        overflow="auto"
        className="TratoCampania"
        flexGrow={999}
      >
        <Container
          maxWidth="sm"
          maxHeight={`calc(100vh - 70px)`}
          height={`calc(100vh - 70px)`}
          overflow="auto"
          flexGrow={999}
        >
          <FabButton
            icon="add"
            text="Tarea"
            // disabled={userIsMKT}
            onClick={() => navigate(`/ss/trato/${idTrato}/tarea/nueva`)}
          />
          <MainBox title={trato?.titulo} before={true} className="SmartSalesMainBoxTratos">
            <SSQSection
              actionPrefix="cabecera"
              dynamicComp={() => (
                <>
                  <Field.Schema id="tratoBuffer.titulo" schema={schemaTrato} fullWidth />
                  <Field.Schema id="tratoBuffer.valor" schema={schemaTrato} fullWidth />
                </>
              )}
            >
              <Box w={1} display="flex" justifyContent="space-between">
                <FieldTitle>Valor:</FieldTitle>
                <FieldValue>{util.euros(trato?.valor ?? 0)}</FieldValue>
              </Box>
            </SSQSection>
          </MainBox>

          {!trato.contacto ? (
            <MainBox>
              <Box
                w={1}
                display="flex"
                justifyContent="space-between"
                onClick={() => navigate(`/ss/clientes/${trato?.cliente}`)}
              >
                <FieldTitle>Cliente:</FieldTitle>
                <FieldValue>{trato?.nombreCliente}</FieldValue>
              </Box>
            </MainBox>
          ) : (
            <MainBox>
              <Box
                display="flex"
                justifyContent={resolverDiferencias ? "space-between" : "flex-end"}
              >
                {resolverDiferencias && (
                  <Button
                    id="resolverDiferencias"
                    text="Resolver diferencias"
                    variant="text"
                    color="primary"
                  />
                )}
                <Button id="editarContacto" text="Editar contacto" variant="text" color="primary" />
              </Box>
              <SSQSection
                actionPrefix="contacto"
                dynamicComp={() => (
                  <Contacto
                    id="tratoBuffer.contacto"
                    label="Contacto"
                    codCliente={trato.cliente}
                    fullWidth
                    async
                  />
                )}
              >
                <Box w={1} display="flex" justifyContent="space-between">
                  <FieldTitle>Contacto:</FieldTitle>
                  <Contacto
                    id="tratoBuffer.contacto"
                    label="Contacto"
                    fullWidth
                    estatico
                    StaticComp={FieldValue}
                    refrescar={refrescarContacto}
                  />
                </Box>
              </SSQSection>
              {trato.cliente && (
                <Box mx={0.5} w={1} display="flex" justifyContent="space-between">
                  <FieldTitle>Cliente:</FieldTitle>
                  <ClienteContacto
                    id="trato.contacto"
                    label="Cliente"
                    fullWidth
                    estatico
                    StaticComp={FieldValue}
                  />
                </Box>
              )}
            </MainBox>
          )}

          <MainBox>
            {!disableAsignar && (
              <Box display="flex" flexDirection="column" alignItems="flex-end">
                <Button
                  id="asignarTrato"
                  text="Asignar"
                  variant="text"
                  color="primary"
                  disabled={disableAsignar}
                  onClick={() =>
                    dispatch({
                      type: "onAsignarTrato",
                      payload: { idtrato: tratoBuffer.idTrato },
                    })
                  }
                />
              </Box>
            )}
            <SSQSection
              actionPrefix="codagente"
              dynamicComp={() => (
                <AgenteSmartsales id="tratoBuffer.codAgente" label="Agente" fullWidth async />
              )}
            >
              <Box w={1} display="flex" justifyContent="space-between">
                <FieldTitle>Agente:</FieldTitle>
                <AgenteSmartsales
                  id="tratoBuffer.codAgente"
                  label="Agente"
                  fullWidth
                  estatico
                  StaticComp={FieldValue}
                />
              </Box>
            </SSQSection>
          </MainBox>
          <MainBox>
            <SSQSection
              actionPrefix="tipo"
              dynamicComp={() => (
                <TipoTrato
                  id="tratoBuffer.idTipotrato"
                  schema={schemaTrato}
                  label="Tipo"
                  fullWidth
                  async
                />
              )}
              saveDisabled={() => !tratoBuffer.idTipotrato}
            >
              <Box w={1} display="flex" justifyContent="space-between">
                <FieldTitle>Tipo:</FieldTitle>
                <FieldValue>{trato?.tipotrato}</FieldValue>
              </Box>
            </SSQSection>
          </MainBox>

          <MainBox>
            <SSQSection
              actionPrefix="codFamilia"
              dynamicComp={() => (
                <>
                  <Familia
                    id="tratoBuffer.codFamilia"
                    label="Familia"
                    fullWidth
                    filtroFamilias={
                      tratoBuffer?.familias?.length > 0
                        ? ["codfamilia", "not_in", tratoBuffer?.familias?.map(f => f.codfamilia)]
                        : null
                    }
                  />
                  <Box my={1}>
                    {(tratoBuffer?.familias ?? []).map(
                      (familia, idx) =>
                        !!familia && (
                          <Box key={familia?.codfamilia} display={"flex"} alignItems={"center"}>
                            <Box>
                              <IconButton
                                id="deleteChildFamiliaProducto"
                                size="small"
                                onClick={() =>
                                  dispatch({
                                    type: "onDeleteFamiliaProductoClicked",
                                    payload: { indice: idx },
                                  })
                                }
                              >
                                <Icon>close</Icon>
                              </IconButton>
                            </Box>
                            <Box>
                              <Typography
                                variant="subtitle1"
                                style={{
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  minWidth: "0",
                                }}
                              >
                                <span>{familia?.descripcion}</span>
                              </Typography>
                            </Box>
                          </Box>
                        ),
                    )}
                  </Box>
                </>
              )}
              saveDisabled={() => !tratoBuffer.idTipotrato}
            >
              <Box w={1} display="flex" flexDirection={"column"} justifyContent="space-between">
                <FieldTitle>Familias de producto:</FieldTitle>
                <Box display="flex" flexDirection="column">
                  {(trato.familias ?? []).map(
                    familia =>
                      !!familia && (
                        <Box
                          key={familia?.codfamilia ?? familia}
                          display="flex"
                          alignItems="center"
                          style={{
                            gap: "0.5rem",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            style={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              minWidth: "0",
                            }}
                          >
                            {familia?.descripcion}
                          </Typography>
                        </Box>
                      ),
                  )}
                </Box>
              </Box>
            </SSQSection>
          </MainBox>

          <MainBox>
            <Box w={1} display="flex" justifyContent="space-between">
              <FieldTitle>Fecha/Hora:</FieldTitle>
              <FieldValue>
                {`${util.formatDate(trato?.fecha)} ${trato?.horaAlta?.substring(0, 5) ?? "00:00"}`}
              </FieldValue>
            </Box>
          </MainBox>

          <MainBox>
            <FieldTitle>Tareas</FieldTitle>
            <ListTareas
              tareas={{
                ...tareas,
                urlOnClicked: `/ss/campania/${idCampania}/tratos/${trato.idTrato}`,
                idList: tareasList,
                dict: tareasList
                  .map(key => tareas?.dict[key])
                  .reduce(
                    (accum, tarea) => ({
                      ...accum,
                      [tarea.idTarea]: tarea,
                    }),
                    {},
                  ),
              }}
            />
          </MainBox>

          {trato && (
            <Quimera.View
              id="EstadoTrato"
              tratoProp={trato}
              refreshCallback={() => dispatch({ type: "refreshCallback" })}
            />
          )}

          {trato?.exigirGenerarPedido && !trato?.idPedido && !trato?.idPresupuesto && (
            <Box style={{ display: "flex", justifyContent: "center" }} my={2}>
              <Button
                id="asociarPedido"
                variant="outlined"
                color="primary"
                text="Asociar pedido"
              // disabled={tratoBuffer.idPerdida}
              />
            </Box>
          )}

          {puedoBorrar() && (
            <Box style={{ display: "flex", justifyContent: "center" }} my={2}>
              <Button
                id="borrarTrato"
                variant="outlined"
                color="primary"
                text="Borrar trato"
              // disabled={tratoBuffer.idPerdida}
              />
            </Box>
          )}

          <MainBox>
            <SSQSection
              actionPrefix="nota"
              dynamicComp={() => <Field.Text id="nuevaNota" label="Nota" fullWidth multiline />}
            >
              <FieldTitle>Nota:</FieldTitle>
              <Field.Text id="" fullWidth multiline disabled />
            </SSQSection>

            {[...notas?.list]?.reverse().map(nota => (
              <Note key={nota.texto} text={nota.texto} date={util.formatDate(nota.fecha)} />
            ))}
          </MainBox>

          <Dialog
            open={modalEditarContactoVisible}
            fullWidth
            maxWidth="xs"
          // fullScreen={width === "xs" || width === "sm"}
          >
            <Box mt={1} mb={3} mr={1}>
              <Quimera.View
                id="EditarContactoCampania"
                idContacto={trato.contacto}
                idContactoCampania={trato?.idContactoCampania}
                refreshCallback={payload => dispatch({ type: "onContactoEditado", payload })}
                callbackCerrado={payload => dispatch({ type: "onCerrarEditarContacto", payload })}
              />
            </Box>
          </Dialog>

          <Dialog open={modalResolverDiferenciasVisible}>
            <DialogTitle id="form-dialog-title">
              Resolver diferencias de datos de contacto
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="form-dialog-description">
                Eliga entre los datos importados y los datos almacenados en la base de datos.
              </DialogContentText>
              <DialogContent dividers={true}>
                <Grid item xs={12} container>
                  <Grid item xs={12} container alignItems="center">
                    <Grid item xs={4} container justifyContent="space-between">
                      <Typography variant="subtitle1">Nombre</Typography>
                    </Grid>
                    <Grid item xs={4} container justifyContent="center">
                      <Typography variant="subtitle2">
                        <strong>{contactosPorCampania.nombre}</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={4} container justifyContent="center">
                      <Typography variant="subtitle2">
                        <strong>{contactoTrato.nombre}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} container alignItems="center">
                    <Grid item xs={4} container justifyContent="space-between">
                      <Typography variant="subtitle1">Teléfono</Typography>
                    </Grid>
                    <Grid item xs={4} container justifyContent="center">
                      <Typography variant="subtitle2">
                        <strong>{contactosPorCampania.telefono}</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={4} container justifyContent="center">
                      <Typography variant="subtitle2">
                        <strong>{contactoTrato.telefono}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} container alignItems="center">
                    <Grid item xs={4} container justifyContent="space-between">
                      <Typography variant="subtitle1">Ciudad</Typography>
                    </Grid>
                    <Grid item xs={4} container justifyContent="center">
                      <Typography variant="subtitle2">
                        <strong>{contactosPorCampania.ciudad}</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={4} container justifyContent="center">
                      <Typography variant="subtitle2">
                        <strong>{contactoTrato.ciudad}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} container alignItems="center">
                    <Grid item xs={4} container justifyContent="space-between">
                      <Typography variant="subtitle1">Cod. postal</Typography>
                    </Grid>
                    <Grid item xs={4} container justifyContent="center">
                      <Typography variant="subtitle2">
                        <strong>{contactosPorCampania.codPostal}</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={4} container justifyContent="center">
                      <Typography variant="subtitle2">
                        <strong>{contactoTrato.codPostal}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} container alignItems="center">
                    <Grid item xs={4} />
                    <Grid item xs={4} container justifyContent="center">
                      <Button
                        id="confirmarDatosImportados"
                        text="Datos importados"
                        variant="text"
                        color="primary"
                      />
                    </Grid>
                    <Grid item xs={4} container justifyContent="center">
                      <Button
                        id="confirmarDatosBBDD"
                        text="Datos almacenados"
                        variant="text"
                        color="primary"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
            </DialogContent>
            <DialogActions>
              <Grid container justifyContent="space-between">
                <Button
                  id="cancelar"
                  text="Cancelar"
                  variant="text"
                  color="secondary"
                  onClick={() => dispatch({ type: "onCerrarResolverDiferencias" })}
                />
              </Grid>
            </DialogActions>
          </Dialog>

          <Dialog open={modalAsociarPedidoVisible}>
            <DialogTitle id="form-dialog-title">Asociar pedido a trato</DialogTitle>
            <DialogContent>
              <DialogContentText id="form-dialog-description">
                Selecciona el pedido que quieres asociar a este trato.
              </DialogContentText>
              <Grid container justifyContent="center">
                <Pedido
                  id="tratoBuffer.idPedido"
                  value={tratoBuffer.idPedido}
                  // onChange={event => setContacto(event.target.value?.key ?? null)}
                  fullWidth
                  codCliente={trato.cliente}
                  label="Pedido"
                />
              </Grid>
            </DialogContent>
            <DialogActions>
              {asociandoPedido ? (
                <Grid container justifyContent="center">
                  {" "}
                  <br />
                  <CircularProgress />
                </Grid>
              ) : (
                <Grid container justifyContent="space-between">
                  <Button
                    id="cancelar"
                    text="Cancelar"
                    variant="text"
                    color="secondary"
                    onClick={() => dispatch({ type: "cerrarModalAsociarPedidoVisible" })}
                  />
                  <Button
                    id="confirmar"
                    text="Ok"
                    variant="text"
                    color="primary"
                    onClick={() => dispatch({ type: "onAsociarPedidoConfirmClicked" })}
                  />
                </Grid>
              )}
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Quimera.Template>
  );
}

export default TratoCampania;
