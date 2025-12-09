import { QArticulo } from "@quimera-extension/base-almacen";
import { Cliente } from "@quimera-extension/base-ventas";
import { SearchRecomSubfamilia } from "@quimera-extension/sanhigia-smartsales";
import { Box, Button, Field, Grid, Icon, QBox } from "@quimera/comps";
import { Plot } from "@quimera/thirdparty";
import Quimera, { useStateValue, useWidth } from "quimera";
import { useEffect, useState } from "react";

import initialData from "./initial-data";

function InformeMapa({ useStyles }) {
  const [{ dataMap, layoutMap, clients, subfamilia }, dispatch] = useStateValue();
  const [showMap, setShowMap] = useState(true);
  const [timer, setTimer] = useState();
  const width = useWidth();
  const classes = useStyles();

  const updateTime = 500;

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        width,
      },
    });
  }, [dispatch, width]);

  const handleRelayout = figure => {
    clearTimeout(timer);
    setTimer(
      setTimeout(
        () =>
          dispatch({
            type: "onMapRelayout",
            payload: {
              coordinates: figure["mapbox._derived"]?.coordinates?.toString(),
              zoom: figure["mapbox.zoom"],
              c_lat: figure["mapbox.center"]?.lat,
              c_lon: figure["mapbox.center"]?.lon,
            },
          }),
        updateTime,
      ),
    );
  };

  return (
    <Quimera.Template id="InformeMapa">
      {showMap ? (
        <Grid container direction="column">
          <Grid item xs={12} md={4}>
            <QBox
              titulo="Geolocalización de clientes"
              botonesCabecera={[{ icon: "close", id: "atras", text: "Atrás" }]}
            >
              <Grid container direction="column" item spacing={1}>
                <Grid item xs={12}>
                  <Cliente id="filter.codCliente" label="Cliente" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <QArticulo id="filter.ref1" label="Referencia 1" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <QArticulo id="filter.ref2" label="Referencia 2" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <QArticulo id="filter.ref3" label="Referencia 3" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <Field.Currency id="filter.minFacturacion" label="Mínimo facturación" fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <Field.Select
                    id="filter.intervalo"
                    label="Intervalo"
                    options={initialData.intervalos}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field.Date
                    id="filter.fechaDesde"
                    label="Fecha desde"
                    className={classes.field}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field.Date
                    id="filter.fechaHasta"
                    label="Fecha hasta"
                    className={classes.field}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="space-around" mt={1}>
                <Button
                  id="refreshMap"
                  text="Refrescar mapa"
                  color="primary"
                  variant="contained"
                  startIcon={<Icon>map</Icon>}
                />
                <Button
                  id="clearFilter"
                  text="Limpiar filtros"
                  color="primary"
                  variant="outlined"
                  startIcon={<Icon>highlight_off</Icon>}
                />
              </Box>
              <Box display="flex" flexDirection="column" justifyContent="space-around" mt={1}>
                <SearchRecomSubfamilia
                  id="subfamilia"
                  placeholder="Escoge subfamilia a recomendar"
                />
                <Button
                  id="showRecom"
                  text="Mostrar recomendaciones"
                  color="primary"
                  variant="contained"
                  startIcon={<Icon>list</Icon>}
                  disabled={!clients || !clients.length || !clients?.[0].codDir || !subfamilia}
                  onClick={() => setShowMap(false)}
                />
              </Box>
            </QBox>
          </Grid>
          <Grid item xs={12} md={8}>
            {dataMap ? (
              <Plot
                data={dataMap}
                layout={layoutMap}
                config={{
                  responsive: true,
                  displaylogo: false,
                  displayModeBar: false,
                }}
                onRelayout={handleRelayout}
              />
            ) : null}
          </Grid>
        </Grid>
      ) : (
        <>
          <Button
            id="showMap"
            text="Volver al mapa"
            color="primary"
            variant="contained"
            startIcon={<Icon>map</Icon>}
            onClick={() => setShowMap(true)}
          />
          <Quimera.View id="RecomMapa" clientes={clients} subfamilia={subfamilia} />
        </>
      )}
    </Quimera.Template>
  );
}

export default InformeMapa;
