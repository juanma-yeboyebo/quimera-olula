import "./Campania.style.scss";

import { QArticulo, SelectorValores, Subfamilia } from "@quimera-extension/base-almacen";
import { Agente } from "@quimera-extension/base-ventas";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Field,
  Grid,
  Icon,
  IconButton,
  QBox,
  QBoxButton,
  QSection,
  Typography,
} from "@quimera/comps";
import { FormControl, FormControlLabel, FormLabel, Plot, Radio, RadioGroup } from "@quimera/thirdparty";
import Quimera, { getSchemas, navigate, useStateValue, useWidth, util } from "quimera";
import { useEffect } from "react";

import { QProductoOfertar, TipoTrato } from "../../comps";

const tipos = {
  repeticion: "Repetición",
  captacion: "Captación",
  medicion: "Medición",
  ventaCruzada: "Venta cruzada",
  marketingDigital: "Marketing digital",
};

const tiposProducto = {
  subfamilia: "Subfamilia",
  listadearticulos: "Lista de artículos",
};

const tiposCaptacion = {
  leads: "Leads",
  ventadirecta: "Ventas directas",
};

const listasProductos = [
  {
    key: "lista_incluidos",
    value: "Incluidos",
    name: "Lista incluidos",
  },
  {
    key: "lista_excluidos",
    value: "Excluidos",
    name: "Lista excluidos",
  },
];

const modosListaIncluidos = [
  { key: "todos", value: "Todos" },
  { key: "alguno", value: "Alguno" },
];

const modosListaExcluidos = [
  { key: "alguno", value: "Alguno" },
  { key: "ninguno", value: "Ninguno" },
];

function Campania({ callbackChanged, initCampania, origen, useStyles }) {
  const [
    {
      avisoAgentePorDefecto,
      campania,
      canales,
      canalesCampania,
      data,
      modoListaIncluidos,
      modoListaExcluidos,
      lanzandoCampania,
      publicandoCampaniaDigital,
    },
    dispatch,
  ] = useStateValue();
  const schema = getSchemas().campania;
  const classes = useStyles();

  const numClientes = campania?.data?.numClientes;

  useEffect(() => {
    util.publishEvent(campania.event, callbackChanged);
  }, [campania.event.serial]);

  useEffect(() => {
    dispatch({
      type: "onInitCampania",
      payload: {
        initCampania,
      },
    });
  }, [dispatch, initCampania]);

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const disableDeleteCampania =
    campania.data.estado !== "pendiente" || campania.data?.tratosTotales?.totales > 0;
  const tieneTratos = campania.data?.tratosTotales?.totales > 0 ? true : false;

  return (
    <Quimera.Template id="Campania">
      <QBox
        width={anchoDetalle}
        titulo={campania.data.nombre}
        botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
        sideButtons={
          <>
            <QBoxButton
              id="eliminarCampania"
              title="Eliminar campaña"
              icon="delete"
              disabled={disableDeleteCampania}
            />
            <QBoxButton
              id="archivarCampania"
              title="Archivar campaña"
              icon="archive"
              disabled={campania.data.estado !== "enseguimiento"}
            />

            <Quimera.Block id="sideButtons" />
          </>
        }
      >
        <Box display={"flex"} justifyContent={"center"}>
          <Button
            id="irATratosCampania"
            onClick={() => navigate(`/ss/${origen}/${campania.buffer.idCampania}/tratos`)}
            text="Ver Tratos"
            color="secondary"
            variant="outlined"
            disabled={!campania.data?.idTipoTrato}
          />
        </Box>
        {campania.data.tipo === "marketingDigital" ? (
          <Box display="flex" justifyContent="space-around" style={{ margin: "10px" }}>
            {canales.map(canal => (
              <>
                {canalesCampania?.idList.includes(canal.codCanal) ? (
                  <>
                    <Button
                      id="sincronizarCampaniaDigital"
                      color="primary"
                      disabled={!campania.data?.idTipoTrato || publicandoCampaniaDigital}
                      onClick={() =>
                        dispatch({
                          type: `onSincronizarCampaniaDigitalClicked`,
                          payload: {
                            tipo: canal.codCanal,
                            idCanalCampania: canalesCampania.dict[canal.codCanal].idCanalCampania,
                            idCampania: canalesCampania.dict[canal.codCanal].idCampania,
                          },
                        })
                      }
                    >
                      <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                        <Icon>sync</Icon>
                        Sincronizar campaña {canal.nombre}
                      </Box>
                    </Button>
                    {/* <Button
                      id="eliminarCampaniaDigital"
                      color="secondary"
                      disabled={eiliminandoCampaniaDigital}
                      onClick={() =>
                        dispatch({
                          type: `onEliminarCampaniaDigitalClicked`,
                          payload: {
                            tipo: canal.codCanal,
                            idcanalcampania: canalesCampania.dict[canal.codCanal].idCanalCampania,
                          },
                        })
                      }
                    >
                      <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                        <Icon>delete</Icon>
                        Eliminar campaña {canal.nombre}
                      </Box>
                    </Button> */}
                  </>
                ) : (
                  <Button
                    id="publicarCampaniaDigital"
                    color="primary"
                    onClick={() =>
                      dispatch({
                        type: `onPublicarCampaniaDigitalClicked`,
                        payload: { tipo: canal.codCanal },
                      })
                    }
                    disabled={!campania.data?.idTipoTrato || publicandoCampaniaDigital}
                  >
                    <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                      <Icon>rocket_launch</Icon>
                      Publicar campaña {canal.nombre}
                    </Box>
                  </Button>
                )}
              </>
            ))}
          </Box>
        ) : campania.data.estado === "pendiente" ? (
          <Box display="flex" justifyContent="center" flexDirection={mobile ? "column" : "row"}>
            <Box display="flex" justifyContent="center" style={{ margin: "10px" }}>
              <Button
                id="calcularClientes"
                color="primary"
                onClick={() => dispatch({ type: "onClacularClientesClicked" })}
              >
                <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                  <Icon>groups</Icon>{" "}
                  {numClientes && numClientes > 0 ? "Recalcular Clientes" : "Calcular Clientes"}
                </Box>
              </Button>
            </Box>

            <Box display="flex" justifyContent="center" style={{ margin: "10px" }}>
              <Button
                id="lanzarCampania"
                color="primary"
                disabled={!numClientes || lanzandoCampania || !campania.data?.idTipoTrato}
                onClick={() => dispatch({ type: "onLanzarCampaniaClicked" })}
              >
                <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                  <Icon>rocket_launch</Icon>
                  Lanzar campaña para {numClientes ?? 0} clientes
                </Box>
              </Button>
            </Box>
          </Box>
        ) : (
          ""
        )}

        {tieneTratos && (
          <Box display={"flex"} justifyContent={"space-between"}>
            <QSection title="Total tratos" alwaysInactive={true}>
              <Box display="flex">
                <Typography variant="body1">{campania?.data?.tratosTotales?.totales}</Typography>
              </Box>
            </QSection>
            <QSection title="Tratos ganados" alwaysInactive={true}>
              <Box display="flex" justifyContent="center">
                <Typography variant="body1">{campania?.data?.tratosTotales?.ganados}</Typography>
              </Box>
            </QSection>
            <QSection title="Tratos perdidos" alwaysInactive={true}>
              <Box display="flex" justifyContent="flex-end">
                <Typography variant="body1">{campania?.data?.tratosTotales?.perdidos}</Typography>
              </Box>
            </QSection>
          </Box>
        )}

        <Box width={1} display={"flex"} justifyContent={"space-between"}>
          <QSection
            title="Ratio de conversión"
            actionPrefix="ratioconversion"
            alwaysInactive={true}
          >
            <Box display="flex">
              <Typography variant="body1">
                {util.formateoPorcentaje(campania.data.ratioConversion, 1)}
              </Typography>
            </Box>
          </QSection>

          <QSection title="Importe de campaña" actionPrefix="importecampania" alwaysInactive={true}>
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="body1">
                {util.euros(campania?.data?.tratosTotales?.importecampania || 0)}
              </Typography>
            </Box>
          </QSection>
        </Box>
        <Box width={1}>
          <QSection
            title="Tipo trato"
            actionPrefix="campania"
            alwaysInactive={false}
            dynamicComp={() => (
              <Box width={1}>
                <TipoTrato
                  id="campania.buffer.idTipoTrato"
                  schema={false}
                  estatico={false}
                  fullWidth
                  async
                />
              </Box>
            )}
          >
            <Box display="flex">
              {campania?.data?.idTipoTrato ? (
                <TipoTrato
                  id="campania.data.idTipoTrato"
                  schema={false}
                  estatico
                  fullWidth
                  async
                  variant="body1"
                />
              ) : (
                <Typography variant="body1">
                  Selecciona un tipo de trato por defecto para esta campaña
                </Typography>
              )}
            </Box>
          </QSection>
        </Box>

        <Box width={1}>
          <QSection
            title="Agente Tratos"
            actionPrefix="codagente"
            alwaysInactive={false}
            dynamicComp={() => <Agente id="campania.buffer.codAgenteTratos" fullWidth async />}
          >
            <Box display="flex">
              {campania?.data?.codAgenteTratos ? (
                <Agente id="campania.data.codAgenteTratos" estatico variant="body1" />
              ) : (
                <Typography variant="body1">Selecciona un agente</Typography>
              )}
            </Box>
          </QSection>
        </Box>

        <Box width={1}>
          <QSection
            title="Valor tratos"
            actionPrefix="campania"
            alwaysInactive={false}
            dynamicComp={() => (
              <>
                {campania.data.estado === "pendiente" ? (
                  <Typography className="labelFiels">Valor de los tratos por crear</Typography>
                ) : (
                  <Typography className="labelFiels">
                    Este valor no afectará a los tratos ya generados
                  </Typography>
                )}
                <Field.Currency
                  id={`campania.buffer.valorTratos`}
                  schema={schema}
                  // label={(<Typography >Este valor no afectará a los tratos ya generados</Typography>)}
                  onClick={event => event.target.select()}
                  value={campania?.buffer?.valorTratos}
                />
              </>
            )}
          >
            <Box display="flex">
              {campania?.data?.valorTratos ? (
                <Typography variant="body1">{util.euros(campania.data.valorTratos)}</Typography>
              ) : (
                <Typography variant="body1">Introduzca un valor</Typography>
              )}
            </Box>
          </QSection>
        </Box>

        <QSection
          title="Datos generales"
          actionPrefix={"campania"}
          alwaysInactive={campania.data.estado === "archivada"}
          dynamicComp={() => (
            <>
              <Field.Schema
                id={`campania.buffer.nombre`}
                schema={schema}
                label="Nombre"
                fullWidth
                autoFocus
              />
              <Field.Schema
                id={`campania.buffer.tipo`}
                schema={schema}
                label="Tipo"
                disabled={true}
                fullWidth
                autoFocus
              />
              <Field.Schema
                id={`campania.buffer.tipoProducto`}
                schema={schema}
                label="Productos por"
                disabled={true}
                fullWidth
                autoFocus
              />
            </>
          )}
        >
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center" className={classes.cajaQSectionEstatico}>
              <Icon>badge</Icon>
              <Typography variant="body1">{campania.data.nombre}</Typography>
            </Box>
            <Box display="flex" alignItems="center" className={classes.cajaQSectionEstatico}>
              <Icon>style</Icon>
              <Typography variant="body1">Campaña de {tipos[campania.data.tipo]}</Typography>
            </Box>
            <Box display="flex" alignItems="center" className={classes.cajaQSectionEstatico}>
              <Icon>category</Icon>
              <Typography variant="body1">
                Productos por {tiposProducto[campania.data.tipoProducto]}
              </Typography>
            </Box>
          </Box>
        </QSection>

        {["repeticion"].includes(campania.buffer.tipo) ? (
          <QSection
            title="Parámetros de repetición"
            actionPrefix={"campania"}
            alwaysInactive={campania.data.estado !== "pendiente"}
            dynamicComp={() => (
              <Field.Schema
                id={`campania.buffer.diasDesdeUltimaCompra`}
                schema={schema}
                label="Días desde la última compra"
                fullWidth
                autoFocus
              />
            )}
          >
            <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
              <Icon>replay_30</Icon>
              <Typography variant="body1">
                {campania.data.diasDesdeUltimaCompra} día
                {campania.buffer.diasDesdeUltimaCompra > 1 ? "s" : ""} desde la última compra
              </Typography>
            </Box>
          </QSection>
        ) : (
          ""
        )}

        {["ventaCruzada"].includes(campania.buffer.tipo) ? (
          <Box>
            <QSection
              title="Rango de última compra"
              actionPrefix={"campania"}
              alwaysInactive={campania.data.estado !== "pendiente"}
              dynamicComp={() => (
                <>
                  <Field.Schema
                    id={`campania.buffer.fechaInicioUltimaCompra`}
                    schema={schema}
                    label="Inicio"
                    fullWidth
                    autoFocus
                  />
                  <Field.Schema
                    id={`campania.buffer.fechaFinUltimaCompra`}
                    schema={schema}
                    label="Fin"
                    fullWidth
                    autoFocus
                  />
                </>
              )}
            >
              <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                <Typography variant="body1">Desde el</Typography>
                <Icon>calendar_month</Icon>
                <Typography variant="body1">
                  {util.formatDate(campania.data.fechaInicioUltimaCompra)}
                </Typography>
                <Typography variant="body1">hasta el</Typography>
                <Icon>calendar_month</Icon>
                <Typography variant="body1">
                  {util.formatDate(campania.data.fechaFinUltimaCompra)}
                </Typography>
              </Box>
            </QSection>
            <QSection
              title="Facturado por cliente"
              actionPrefix={"campania"}
              alwaysInactive={campania.data.estado !== "pendiente"}
              dynamicComp={() => (
                <>
                  <Field.Schema
                    id={`campania.buffer.importeFacturadoMayorQue`}
                    schema={schema}
                    label="Importe facturado mayor que"
                    fullWidth
                    autoFocus
                  />
                  <Field.Schema
                    id={`campania.buffer.importeFacturadoMenorQue`}
                    schema={schema}
                    label="Importe facturado menor que"
                    fullWidth
                    autoFocus
                  />
                </>
              )}
            >
              <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                <Typography variant="body1">Desde </Typography>
                <Typography variant="body1">
                  {util.euros(campania.data.importeFacturadoMayorQue)}
                </Typography>
                <Typography variant="body1">hasta </Typography>
                <Typography variant="body1">
                  {util.euros(campania.data.importeFacturadoMenorQue)}
                </Typography>
              </Box>
            </QSection>
          </Box>
        ) : (
          ""
        )}

        {campania.data.tipo === "captacion" ? (
          <QSection
            title="Parámetros de captación"
            actionPrefix={"campania"}
            alwaysInactive={campania.data.estado !== "pendiente"}
            dynamicComp={() => (
              <>
                <Field.Schema
                  id={`campania.buffer.tipoCaptacion`}
                  schema={schema}
                  label="Tipo de captación"
                  fullWidth
                  autoFocus
                />
                <Field.Slider
                  id={`campania.buffer.umbralRecomendacion`}
                  label="Umbral de recomendación"
                  min={0}
                  max={2}
                  step={0.1}
                  autoFocus
                />
              </>
            )}
          >
            <Box display="flex" flexDirection="column">
              <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                <Icon>style</Icon>
                <Typography variant="body1">
                  Captación de {tiposCaptacion[campania.data.tipoCaptacion]}
                </Typography>
              </Box>
              <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                <Icon>tune</Icon>
                <Typography variant="body1">
                  Score mínimo de {campania.data.umbralRecomendacion}
                </Typography>
              </Box>
            </Box>
          </QSection>
        ) : (
          ""
        )}

        {campania.data.tipoProducto === "subfamilia" ? (
          <QSection
            title="Subfamilia"
            actionPrefix={"campania"}
            alwaysInactive={campania.data.estado !== "pendiente"}
            dynamicComp={() => (
              <Subfamilia
                id={`campania.buffer.subfamilia`}
                label="Subfamilia"
                global={true}
                fullWidth
                autoFocus
              />
            )}
          >
            <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
              <Icon>label</Icon>
              <Subfamilia
                id={`campania.data.subfamilia`}
                label="Subfamilia"
                estatico={true}
                variant="body1"
                fullWidth
                autoFocus
              />
            </Box>
          </QSection>
        ) : (
          ""
        )}

        {campania.data.tipoProducto === "listadearticulos" &&
          campania.data.tipo !== "marketingDigital" ? (
          <QSection
            title="Productos"
            actionPrefix={"campania"}
            alwaysInactive={campania.data.estado !== "pendiente"}
            saveDisabled={() =>
              !campania?.buffer?.productos?.lista_incluidos?.refs?.length &&
              !campania?.buffer?.productos?.lista_excluidos?.refs?.length
            }
            dynamicComp={() => (
              <>
                {!["repeticion", "captacion", "medicion"].includes(campania.buffer.tipo) && (
                  <FormControl>
                    <FormLabel id="listaCampania">Añadir producto a lista</FormLabel>
                    <RadioGroup row name="switchListasProductos" defaultValue="lista_incluidos">
                      {(Object.values(listasProductos ?? {}) ?? []).map((lista, idx) => (
                        <>
                          <FormControlLabel
                            value={lista?.key}
                            control={<Radio />}
                            label={lista?.value}
                            onClick={() =>
                              dispatch({
                                type: "onListaCampaniaChanged",
                                payload: { value: lista?.key },
                              })
                            }
                          />
                        </>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
                <QArticulo
                  id="producto"
                  label="Productos"
                  fullWidth
                  autoFocus
                  onClick={event => event.target.select()}
                />
                <Grid container>
                  {!["repeticion", "captacion", "medicion"].includes(campania.buffer.tipo) ? (
                    <>
                      {(Object.values(listasProductos ?? {}) ?? []).map((lista, idx) => (
                        <Grid item xs={6}>
                          <Box>
                            <Typography>{lista?.name}</Typography>
                            <SelectorValores
                              id={`modoLista${lista?.value}`}
                              valores={
                                lista?.value === "Incluidos"
                                  ? modosListaIncluidos
                                  : modosListaExcluidos
                              }
                              value={
                                lista?.value === "Incluidos"
                                  ? modoListaIncluidos
                                  : modoListaExcluidos
                              }
                              arrayKeyValue
                              fullWidth
                            ></SelectorValores>
                            {(campania?.buffer?.productos?.[lista?.key]?.refs ?? []).map(
                              (producto, idx) => (
                                <div key={producto?.referencia}>
                                  <IconButton
                                    id="deleteChildProductos"
                                    size="small"
                                    onClick={() =>
                                      dispatch({
                                        type: `onDeleteChildProductosLista${lista?.value}Clicked`,
                                        payload: { index: idx },
                                      })
                                    }
                                  >
                                    <Icon>close</Icon>
                                  </IconButton>
                                  <span>{`${producto?.descripcion} (${producto?.referencia})`}</span>
                                </div>
                              ),
                            )}
                          </Box>
                        </Grid>
                      ))}
                    </>
                  ) : (
                    <Grid item xs={12}>
                      {(campania?.buffer?.productos?.["lista_incluidos"]?.refs ?? []).map(
                        (producto, idx) => (
                          <div key={producto?.referencia}>
                            <IconButton
                              id="deleteChildProductos"
                              size="small"
                              onClick={() =>
                                dispatch({
                                  type: `onDeleteChildProductosListaIncluidosClicked`,
                                  payload: { index: idx },
                                })
                              }
                            >
                              <Icon>close</Icon>
                            </IconButton>
                            <span>{`${producto?.descripcion} (${producto?.referencia})`}</span>
                          </div>
                        ),
                      )}
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          >
            <Box display="flex" flexDirection="column">
              <Grid container>
                {!["repeticion", "captacion", "medicion"].includes(campania.buffer.tipo) ? (
                  <>
                    {(Object.values(listasProductos ?? {}) ?? []).map((lista, idx) => (
                      <Grid item xs={12}>
                        <Box>
                          <Typography variant="overline">{`${lista?.name}${campania?.buffer?.productos[lista?.key]?.refs?.length > 0
                            ? `(${campania.buffer.productos[lista?.key].tipo})`
                            : ""
                            }`}</Typography>
                          {(campania?.buffer?.productos?.[lista?.key]?.refs ?? []).map(
                            (producto, idx) => (
                              <Box
                                key={producto?.referencia}
                                display="flex"
                                alignItems="center"
                                style={{
                                  gap: "0.5rem",
                                }}
                              >
                                <Icon>label</Icon>
                                <Typography
                                  variant="h6"
                                  style={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    minWidth: "0",
                                  }}
                                >
                                  {`${producto?.descripcion} (${producto?.referencia})`}
                                </Typography>
                              </Box>
                            ),
                          )}
                          {(!campania?.buffer?.productos[lista?.key] ||
                            campania?.buffer?.productos[lista?.key]?.refs?.length === 0) && (
                              <Typography
                                variant="h6"
                                style={{
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  minWidth: "0",
                                }}
                              >
                                No se han añadido productos a esta lista
                              </Typography>
                            )}
                        </Box>
                      </Grid>
                    ))}
                  </>
                ) : (
                  <>
                    {(campania?.buffer?.productos?.["lista_incluidos"]?.refs ?? []).map(
                      (producto, idx) => (
                        <Box
                          key={producto?.referencia}
                          display="flex"
                          alignItems="center"
                          style={{
                            gap: "0.5rem",
                          }}
                        >
                          <Icon>label</Icon>
                          <Typography
                            variant="h6"
                            style={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              minWidth: "0",
                            }}
                          >
                            {`${producto?.descripcion} (${producto?.referencia})`}
                          </Typography>
                        </Box>
                      ),
                    )}
                  </>
                )}
              </Grid>
            </Box>
          </QSection>
        ) : (
          ""
        )}

        {["ventaCruzada", "marketingDigital"].includes(campania.data.tipo) &&
          campania.data.tipoProducto === "listadearticulos" ? (
          <QSection
            title="Productos ofertar"
            actionPrefix={"campania"}
            alwaysInactive={campania.data.estado === "archivada"}
            dynamicComp={() => (
              <>
                <QProductoOfertar
                  id="productoOfertar"
                  label="Productos a ofertar"
                  fullWidth
                  autoFocus
                  onClick={event => event.target.select()}
                />
                {(campania.buffer.productosOfertar ?? []).map(
                  (producto, idx) =>
                    !!producto && (
                      <Box key={producto?.referencia} display={"flex"} alignItems={"center"}>
                        <Box>
                          <IconButton
                            id="deleteChildProductoOfertar"
                            size="small"
                            onClick={() =>
                              dispatch({
                                type: "onDeleteProductoOfertar",
                                payload: { index: idx },
                              })
                            }
                          >
                            <Icon>close</Icon>
                          </IconButton>
                        </Box>
                        <Grid container width={1} display={"flex"} alignItems={"center"}>
                          <Grid item xs={7}>
                            <span>{producto?.descripcion}</span>
                          </Grid>
                          <Grid
                            container
                            item
                            xs={5}
                            display={"flex"}
                            flexDirection="row"
                            alignItems={"center"}
                          >
                            <Grid item xs={5} style={{ paddingLeft: "10px" }}>
                              <Field.Int
                                id="productoOfertarList/cantidad"
                                index={idx}
                                label="Cantidad"
                                value={producto?.cantidad}
                                onClick={event => event.target.select()}
                              />
                            </Grid>
                            <Grid item xs={2} />
                            <Grid item xs={5}>
                              <Field.Currency
                                id="productoOfertarList/pvp"
                                index={idx}
                                label="Precio"
                                value={producto?.pvp}
                                onClick={event => event.target.select()}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    ),
                )}
              </>
            )}
          >
            <Box display="flex" flexDirection="column">
              {(campania.data.productosOfertar ?? []).map(
                producto =>
                  !!producto && (
                    <Box
                      key={producto?.referencia ?? producto}
                      display="flex"
                      alignItems="center"
                      style={{
                        gap: "0.5rem",
                      }}
                    >
                      <Icon>label</Icon>
                      <Typography
                        variant="body1"
                        style={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          minWidth: "0",
                        }}
                      >
                        {producto?.cantidad} x {producto?.descripcion} - {util.euros(producto?.pvp)}
                      </Typography>
                    </Box>
                  ),
              )}
            </Box>
          </QSection>
        ) : (
          ""
        )}

        {!["marketingDigital"].includes(campania.data.tipo) && (
          <QSection
            title="Rango de medición de impacto"
            actionPrefix={"campania"}
            alwaysInactive={campania.data.estado !== "pendiente"}
            dynamicComp={() => (
              <>
                <Field.Schema
                  id={`campania.buffer.fechaInicioImpacto`}
                  schema={schema}
                  label="Inicio"
                  fullWidth
                  autoFocus
                />
                <Field.Schema
                  id={`campania.buffer.fechaFinImpacto`}
                  schema={schema}
                  label="Fin"
                  fullWidth
                  autoFocus
                />
              </>
            )}
          >
            <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
              <Typography variant="body1">Desde el</Typography>
              <Icon>calendar_month</Icon>
              <Typography variant="body1">
                {util.formatDate(campania.data.fechaInicioImpacto)}
              </Typography>
              <Typography variant="body1">hasta el</Typography>
              <Icon>calendar_month</Icon>
              <Typography variant="body1">
                {util.formatDate(campania.data.fechaFinImpacto)}
              </Typography>
            </Box>
          </QSection>
        )}

        {!["marketingDigital"].includes(campania.data.tipo) &&
          ["enseguimiento", "archivada"].includes(campania.data.estado) &&
          data?.VentasMedicionProducto ? (
          <Box
            dispaly="flex"
            flexDirection="column"
            alignItems="center"
            width={1}
            style={{ marginTop: "20px" }}
          >
            <Box display="flex" justifyContent="center">
              <Typography variant="h5">Medición de impacto</Typography>
            </Box>
            <Box display="flex" justifyContent="space-evenly">
              <Field.Date id="fechaInicioComparacion" label="Inicio comparación impacto" />
              <Field.Date id="fechaFinComparacion" label="Fin comparación impacto" />
            </Box>
            <Plot
              data={data.VentasMedicionProducto}
              layout={{
                xaxis: {
                  tickangle: -45,
                  type: "category",
                },
                yaxis: {
                  type: "linear",
                },
                paper_bgcolor: "rgba(0,0,0,0)",
                height: 450,
                // showlegend: false,
                margin: {
                  r: 0,
                  t: 0,
                  b: 150,
                  l: 10,
                  pad: 0,
                },
              }}
            />
          </Box>
        ) : (
          ""
        )}

        <Dialog open={avisoAgentePorDefecto}>
          <DialogTitle id="form-dialog-title">Aviso</DialogTitle>
          <DialogContent>
            <DialogContentText id="form-dialog-description">
              No ha especificado un agente por defecto. Los tratos generados no tendrá agente
              asignado. ¿Desea continuar?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Grid container justifyContent="space-between">
              <Button
                id="cancelar"
                text="CANCELAR"
                variant="text"
                color="secondary"
                onClick={() => dispatch({ type: "cancelarLanzarCampania" })}
              />
              <Button
                id="confirmar"
                text="CONFIRMAR"
                variant="text"
                color="primary"
                onClick={() => dispatch({ type: "procesaLanzarCampania" })}
              />
            </Grid>
          </DialogActions>
        </Dialog>
      </QBox>
    </Quimera.Template>
  );
}

export default Campania;
