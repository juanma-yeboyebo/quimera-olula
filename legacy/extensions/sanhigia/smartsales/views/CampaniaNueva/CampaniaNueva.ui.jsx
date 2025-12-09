import { Box, Field, Grid, Icon, IconButton, QBox, Typography, Wizard } from "@quimera/comps";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@quimera/thirdparty";
import { QArticulo, SelectorValores, Subfamilia } from "@quimera-extension/base-almacen";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import { useEffect } from "react";

import { QProductoOfertar } from "../../comps";

const tipos = {
  repeticion: "Repetición",
  captacion: "Captación",
  medicion: "Medición",
  ventaCruzada: "Venta cruzada",
  marketingDigital: "Marketing digital",
};

const tiposProducto = {
  listadearticulos: "Lista de artículos",
  subfamilia: "Subfamilia",
};

const tiposCaptacion = {
  leads: "Leads",
  ventadirecta: "Ventas directas",
};

const canalesMkt = [
  { key: "Meta", value: "Meta (Facebook)" },
  { key: "AC", value: "Active Campaign" },
];

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

function CampaniaNueva({ callbackChanged, initCampania }) {
  const [{ campania, modoListaIncluidos, modoListaExcluidos }, dispatch] = useStateValue();
  const schema = getSchemas().campania;

  useEffect(() => {
    dispatch({
      type: "onInitCampania",
      payload: {
        initCampania: schema.load({}),
      },
    });
  }, [dispatch, schema, initCampania]);

  return (
    <Quimera.Template id="Campania">
      <Box display="flex" justifyContent="center">
        <QBox
          titulo="Nueva Campaña"
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
        >
          <Wizard
            parentRef="campania.buffer"
            schema={schema}
            action={{
              id: "crearCampania",
              label: "Crear campaña",
            }}
            steps={[
              {
                title: "Datos generales",
                completed:
                  campania.buffer.nombre && campania.buffer.tipo && campania.buffer.tipoProducto,
                dynamicComp: (
                  <>
                    <Field.Schema
                      id={`campania.buffer.nombre`}
                      schema={schema}
                      label="Nombre"
                      fullWidth
                      autoFocus
                      startAdornment={<Icon>badge</Icon>}
                    />
                    <Field.Schema
                      id={`campania.buffer.tipo`}
                      schema={schema}
                      label="Tipo"
                      fullWidth
                      autoFocus
                      startAdornment={<Icon>style</Icon>}
                    />
                    {!["ventaCruzada", "marketingDigital"].includes(campania.buffer.tipo) && (
                      <Field.Schema
                        id={`campania.buffer.tipoProducto`}
                        schema={schema}
                        label="Productos por"
                        fullWidth
                        autoFocus
                        startAdornment={<Icon>style</Icon>}
                      />
                    )}
                  </>
                ),
                staticComp: (
                  <Box display="flex" flexDirection="column">
                    <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                      <Icon>badge</Icon>
                      <Typography variant="h6">{campania.buffer.nombre}</Typography>
                    </Box>
                    <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                      <Icon>style</Icon>
                      <Typography variant="h6">Campaña de {tipos[campania.buffer.tipo]}</Typography>
                    </Box>
                    {campania.buffer.tipo !== "ventaCruzada" && (
                      <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                        <Icon>category</Icon>
                        <Typography variant="h6">
                          Productos por {tiposProducto[campania.buffer.tipoProducto]}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ),
              },
              {
                skip: campania.buffer.tipo && !["repeticion"].includes(campania.buffer.tipo),
                title: "Parámetros de repetición",
                completed:
                  campania.buffer.diasDesdeUltimaCompra === 0 ||
                  campania.buffer.diasDesdeUltimaCompra > 0,
                dynamicComp: (
                  <Field.Schema
                    id={`campania.buffer.diasDesdeUltimaCompra`}
                    schema={schema}
                    label="Días desde la última compra"
                    fullWidth
                    autoFocus
                    startAdornment={<Icon>replay_30</Icon>}
                  />
                ),
                staticComp: (
                  <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                    <Icon>replay_30</Icon>
                    <Typography variant="h6">
                      {campania.buffer.diasDesdeUltimaCompra} día
                      {campania.buffer.diasDesdeUltimaCompra > 1 ? "s" : ""} desde la última compra
                    </Typography>
                  </Box>
                ),
              },
              {
                skip: campania.buffer.tipo && !["ventaCruzada"].includes(campania.buffer.tipo),
                title: "Rango de última compra",
                completed:
                  campania.buffer.fechaInicioUltimaCompra && campania.buffer.fechaFinUltimaCompra,
                dynamicComp: (
                  <>
                    <Field.Schema
                      id={`campania.buffer.fechaInicioUltimaCompra`}
                      schema={schema}
                      label="Inicio"
                      fullWidth
                      autoFocus
                      startAdornment={<Icon>calendar_month</Icon>}
                    />
                    <Field.Schema
                      id={`campania.buffer.fechaFinUltimaCompra`}
                      schema={schema}
                      label="Fin"
                      fullWidth
                      autoFocus
                      startAdornment={<Icon>calendar_month</Icon>}
                    />
                  </>
                ),
                staticComp: (
                  <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                    <Typography variant="h6">Desde el</Typography>
                    <Icon>calendar_month</Icon>
                    <Typography variant="h6">
                      {util.formatDate(campania.buffer.fechaInicioUltimaCompra)}
                    </Typography>
                    <Typography variant="h6">hasta el</Typography>
                    <Icon>calendar_month</Icon>
                    <Typography variant="h6">
                      {util.formatDate(campania.buffer.fechaFinUltimaCompra)}
                    </Typography>
                  </Box>
                ),
              },
              {
                skip: campania.buffer.tipo && !["ventaCruzada"].includes(campania.buffer.tipo),
                title: "Facturado por cliente",
                completed: true,
                //   campania.buffer.fechaInicioUltimaCompra && campania.buffer.fechaFinUltimaCompra,
                dynamicComp: (
                  <Grid container>
                    <Grid container item xs={5}>
                      <Box width={1}>
                        <Field.Schema
                          id={`campania.buffer.importeFacturadoMayorQue`}
                          schema={schema}
                          label="Importe facturado mayor que"
                          fullWidth
                          autoFocus
                        />
                      </Box>
                    </Grid>
                    <Grid container item xs={2} />
                    <Grid container item xs={5}>
                      <Box width={1}>
                        <Field.Schema
                          id={`campania.buffer.importeFacturadoMenorQue`}
                          schema={schema}
                          label="Importe facturado menor que"
                          fullWidth
                          autoFocus
                        />
                      </Box>
                    </Grid>
                  </Grid>
                ),
                staticComp: (
                  <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                    <Typography variant="h6">Importe facturado mayor que</Typography>
                    <Typography variant="h6">{campania.buffer.importeFacturadoMayorQue}</Typography>
                    <Typography variant="h6">menor que</Typography>
                    <Typography variant="h6">{campania.buffer.importeFacturadoMenorQue}</Typography>
                  </Box>
                ),
              },
              {
                skip: campania.buffer.tipo && campania.buffer.tipo !== "captacion",
                title: "Parámetros de captación",
                completed:
                  campania.buffer.tipoCaptacion &&
                  (campania.buffer.umbralRecomendacion === 0 ||
                    campania.buffer.umbralRecomendacion > 0),
                dynamicComp: (
                  <>
                    <Field.Schema
                      id={`campania.buffer.tipoCaptacion`}
                      schema={schema}
                      label="Tipo de captación"
                      fullWidth
                      autoFocus
                      startAdornment={<Icon>style</Icon>}
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
                ),
                staticComp: (
                  <Box display="flex" flexDirection="column">
                    <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                      <Icon>style</Icon>
                      <Typography variant="h6">
                        Captación de {tiposCaptacion[campania.buffer.tipoCaptacion]}
                      </Typography>
                    </Box>
                    <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                      <Icon>tune</Icon>
                      <Typography variant="h6">
                        Score mínimo de {campania.buffer.umbralRecomendacion}
                      </Typography>
                    </Box>
                  </Box>
                ),
              },
              {
                skip: campania.buffer.tipoProducto && campania.buffer.tipoProducto !== "subfamilia",
                title: "Subfamilia",
                icon: "category",
                completed: campania.buffer.subfamilia,
                dynamicComp: (
                  <Subfamilia
                    id={`campania.buffer.subfamilia`}
                    label="Subfamilia"
                    global={true}
                    fullWidth
                    autoFocus
                  />
                ),
                staticComp: (
                  <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                    <Icon>label</Icon>
                    <Subfamilia
                      id={`campania.buffer.subfamilia`}
                      label="Subfamilia"
                      estatico={true}
                      variant="h6"
                      fullWidth
                      autoFocus
                    />
                  </Box>
                ),
              },
              {
                skip:
                  campania.buffer.tipo === "marketingDigital" ||
                  (campania.buffer.tipoProducto &&
                    campania.buffer.tipoProducto !== "listadearticulos"),
                title: "Productos",
                icon: "category",
                dynamicComp: (
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
                ),
                staticComp: (
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
                              {campania?.buffer?.productos[lista?.key]?.refs?.length == 0 && (
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
                ),
                completed:
                  campania?.buffer?.productos?.lista_incluidos?.refs.length > 0 ||
                  campania?.buffer?.productos?.lista_excluidos?.refs.length > 0,
              },
              {
                skip:
                  campania.buffer.tipo &&
                  !["ventaCruzada", "marketingDigital"].includes(campania.buffer.tipo),
                title: "Productos a ofertar",
                dynamicComp: (
                  <>
                    <QProductoOfertar
                      id="productoOfertar"
                      label="Productos a ofertar"
                      fullWidth
                      autoFocus
                      onClick={event => event.target.select()}
                    />
                    {(campania.buffer.productosOfertar ?? []).map((producto, idx) => (
                      <Box key={producto?.referencia} display={"flex"} alignItems={"center"}>
                        <Box>
                          <IconButton
                            id="deleteChildProductosOfertar"
                            size="small"
                            onClick={() =>
                              dispatch({
                                type: "onDeleteChildProductosOfertarClicked",
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
                    ))}
                  </>
                ),
                staticComp: (
                  <>
                    {(campania.buffer.productosOfertar ?? []).map(producto => (
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
                          {producto?.cantidad} x {producto?.descripcion} -{" "}
                          {util.euros(producto?.pvp)}
                        </Typography>
                      </Box>
                    ))}
                  </>
                ),
                completed:
                  ["marketingDigital"].includes(campania.buffer.tipo) ||
                  campania.buffer.productosOfertar?.length,
              },
              {
                title: "Rango de medición de impacto",
                skip: campania.buffer.tipo && ["marketingDigital"].includes(campania.buffer.tipo),
                completed: campania.buffer.fechaInicioImpacto && campania.buffer.fechaFinImpacto,
                dynamicComp: (
                  <>
                    <Field.Schema
                      id={`campania.buffer.fechaInicioImpacto`}
                      schema={schema}
                      label="Inicio"
                      fullWidth
                      autoFocus
                      startAdornment={<Icon>calendar_month</Icon>}
                    />
                    <Field.Schema
                      id={`campania.buffer.fechaFinImpacto`}
                      schema={schema}
                      label="Fin"
                      fullWidth
                      autoFocus
                      startAdornment={<Icon>calendar_month</Icon>}
                    />
                  </>
                ),
                staticComp: (
                  <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                    <Typography variant="h6">Desde el</Typography>
                    <Icon>calendar_month</Icon>
                    <Typography variant="h6">
                      {util.formatDate(campania.buffer.fechaInicioImpacto)}
                    </Typography>
                    <Typography variant="h6">hasta el</Typography>
                    <Icon>calendar_month</Icon>
                    <Typography variant="h6">
                      {util.formatDate(campania.buffer.fechaFinImpacto)}
                    </Typography>
                  </Box>
                ),
              },
            ]}
          />
        </QBox>
      </Box>

      {/* <Dialog
        open={modalCanalesMktDigital}
        onClose={() => dispatch({ type: "toogleModalCanalesMktDigital" })}
      >
        <DialogTitle>Selecciona un canal de marketing</DialogTitle>
        <DialogContent dividers={true}>
          <Box width={1}>
            <Canales
              id="canalMktDigital"
              label="Canales"
              fullWidth
              autoFocus
            // onClick={event => event.target.select()}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Box width={1} display={"flex"} justifyContent={"space-between"}>
            <Button
              id="confirmacionVolver"
              text="Cancelar"
              color="secondary"
              variant="contained"
              onClick={() => dispatch({ type: "toogleModalCanalesMktDigital" })}
            />
            <Button
              id="confirmacionPublicarCampaniaDigital"
              text="Aceptar"
              color="primary"
              variant="contained"
              disabled={!canalMktDigital}
            />
          </Box>
        </DialogActions>
      </Dialog> */}
    </Quimera.Template>
  );
}

export default CampaniaNueva;
