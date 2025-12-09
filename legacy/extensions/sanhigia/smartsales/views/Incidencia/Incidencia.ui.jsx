import { Familia, QArticulo, SelectorValores } from "@quimera-extension/base-almacen";
import { Cliente, DirCliente } from "@quimera-extension/base-ventas";
import {
  Box,
  Button,
  CircularProgress,
  Field,
  Grid,
  Icon,
  QBox,
  QModelBox,
  QSection,
  Typography,
} from "@quimera/comps";
import Quimera, { A, getSchemas, navigate, useStateValue, useWidth, util } from "quimera";
import { useEffect } from "react";

import { FieldValue, ListTareas } from "../../comps";

function dameRespuestaError(meta) {
  if (meta == "femail") {
    return "Email incorrecto";
  }
  if (meta == "ftelefono") {
    return "Telefono incorrecto";
  }
  if (meta == "fnoexiste") {
    return "No se encuentra ningun contacto con este email";
  }

  return meta;
}

function Incidencia({ callbackChanged, initIncidencia, codIncidencia, useStyles }) {
  const [
    {
      crearPresupuesto,
      creandoPresupuesto,
      dirAuto,
      dirCanaria,
      incidencia,
      origenMercanciaOptions,
      regimenIva,
      tareas,
    },
    dispatch,
  ] = useStateValue();
  const schema = getSchemas().incidencias;
  const classes = useStyles();

  useEffect(() => {
    util.publishEvent(incidencia.event, callbackChanged);
  }, [incidencia.event.serial]);

  // useEffect(() => {
  //   dispatch({
  //     type: "onInitIncidencia",
  //     payload: {
  //       initIncidencia,
  //     },
  //   });
  //   dispatch({
  //     type: "getTengoDirAuto",
  //     payload: {
  //       initIncidencia,
  //     },
  //   });
  // }, [dispatch, initIncidencia]);

  useEffect(() => {
    !!initIncidencia &&
      dispatch({
        type: "onInitIncidencia",
        payload: {
          initIncidencia,
        },
      });
    !initIncidencia &&
      !!codIncidencia &&
      dispatch({
        type: "onInitIncidenciaById",
        payload: {
          filterIncidencia: ["codincidencia", "eq", codIncidencia],
        },
      });
  }, [initIncidencia, codIncidencia]);

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const editable = true;

  const tareasList = Object.values(tareas.dict ?? {})
    // .filter(tarea => tarea.codAgente === agente || tarea.codAgenteObservador === agente)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .map(tarea => tarea.idTarea);

  return (
    <Quimera.Template id="Incidencia">
      <QBox
        width={anchoDetalle}
        titulo={initIncidencia?.descripcion}
        botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
        sideButtons={<></>}
      >
        <QModelBox id="incidencia.buffer" disabled={!editable} schema={schema}>
          <QSection
            title="Estado"
            actionPrefix="incidencia.buffer"
            alwaysInactive={!editable}
            dynamicComp={() => (
              <Box width={1}>
                <Field.RealSelect
                  id="incidencia.buffer.estado"
                  label=""
                  options={[
                    { key: "Nueva", value: "Nueva" },
                    { key: "Pendiente de Datos", value: "Pendiente de Datos" },
                    { key: "Pendiente", value: "Pendiente" },
                    { key: "Asignada", value: "Asignada" },
                    { key: "Rechazada", value: "Rechazada" },
                    { key: "Cerrada", value: "Cerrada" },
                  ]}
                  fullWidth
                />
              </Box>
            )}
          >
            <Box display="flex">
              <Typography variant="h6">{incidencia.buffer.estado}</Typography>
            </Box>
          </QSection>

          <QSection
            title={`Cliente ${incidencia.buffer.codCliente ?? ""}`}
            actionPrefix="incidencia.buffer"
            alwaysInactive={!editable}
            dynamicComp={() => (
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Cliente
                    id="incidencia.buffer.codCliente"
                    label={`Cliente ${incidencia.buffer.codCliente ?? ""}`}
                    fullWidth
                    async
                    autoFocus
                  />
                </Grid>
              </Grid>
            )}
            saveDisabled={() => !schema.isValid(incidencia.buffer)}
          >
            <Typography variant="h6">{incidencia.buffer.nombreCliente}</Typography>
          </QSection>
          <QSection
            title={`Artículo ${incidencia.buffer.referencia ?? ""}`}
            actionPrefix="incidencia.buffer"
            alwaysInactive={!editable}
            dynamicComp={() => (
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <QArticulo
                    id="incidencia.buffer.referencia"
                    label="Artículo"
                    boxStyle={classes.referencia}
                    seVende
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Quimera.Block id="afterDescripcion" />
                </Grid>
              </Grid>
            )}
            saveDisabled={() => !schema.isValid(incidencia.buffer)}
          >
            <Typography variant="h6">{incidencia.buffer.descripcionReferencia}</Typography>
          </QSection>

          <QSection
            title="Familia"
            actionPrefix="incidencia.buffer"
            alwaysInactive={!editable}
            dynamicComp={() => (
              <Box width={1}>
                <Familia id="incidencia.buffer.codFamilia" fullWidth />
              </Box>
            )}
          >
            <Box display="flex">
              <Familia
                id="incidencia.buffer.codFamilia"
                label="Familia"
                fullWidth
                estatico
                StaticComp={FieldValue}
              />
            </Box>
          </QSection>

          <QSection
            title="Observaciones"
            actionPrefix="incidencia.buffer"
            alwaysInactive={!editable}
            dynamicComp={() => (
              <Box width={1}>
                <Field.TextArea id="incidencia.buffer.descripcionLarga" label="" fullWidth />
              </Box>
            )}
          >
            <Box display="flex">
              <Typography variant="body2">
                {incidencia.buffer.descripcionLarga || "Sin observaciones"}
              </Typography>
            </Box>
          </QSection>

          {incidencia.buffer.idPresupuesto ? (
            <QSection title={`Presupuesto`} actionPrefix="incidencia.buffer" alwaysInactive={true}>
              <Box w={1} display="flex" justifyContent="space-between" alignItems={"center"}>
                <A
                  href={`/ventas/presupuestos/${incidencia.buffer.idPresupuesto}`}
                  className={classes.link}
                >
                  <Typography variant="h6">{incidencia.buffer.codPresupuesto}</Typography>
                </A>
              </Box>
            </QSection>
          ) : (
            <Box style={{ marginTop: "25px", marginBottom: "25px" }}>
              {crearPresupuesto ? (
                <>
                  {!dirAuto && (
                    <QSection
                      actionPrefix="nuevoPresupuesto"
                      alwaysActive
                      saveDisabled={() => !incidencia?.buffer.codDirCli}
                      dynamicComp={() => (
                        <Grid container>
                          <Grid item xs={12}>
                            <DirCliente
                              id="codDirCli"
                              codCliente={incidencia?.buffer.codCliente}
                              value={incidencia?.buffer.codDirCli}
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
                        </Grid>
                      )}
                    ></QSection>
                  )}
                </>
              ) : (
                <Box style={{ display: "flex", justifyContent: "center" }}>
                  {creandoPresupuesto ? (
                    <Box align="center">
                      Creando presupuesto&nbsp;&nbsp;
                      <br />
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Button id="crearPresupuestoButton" text="Crear presupuesto" />
                  )}
                </Box>
              )}
            </Box>
          )}

          <Box display={"flex"} flexDirection={"column"}>
            <Box w={1} mx={1} display="flex" justifyContent="space-between" alignItems={"center"}>
              <Typography variant="overline">Tareas</Typography>
              <Icon
                fontSize="large"
                onClick={() => navigate(`/ss/incidencias/${codIncidencia}/tarea/nueva`)}
                className={classes.icon}
              >
                add_circle
              </Icon>
            </Box>
            <ListTareas
              tareas={{
                ...tareas,
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
          </Box>

          {/* <QSection title="Tareas" actionPrefix="incidencia.buffer" alwaysInactive={true}>

          </QSection> */}
        </QModelBox>
      </QBox>
    </Quimera.Template>
  );
}

export default Incidencia;
