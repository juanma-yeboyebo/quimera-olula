import { Box, Button, Field, Grid, Icon, QBox } from "@quimera/comps";
import { QArticulo, Familia, Subfamilia } from "@quimera-extension/base-almacen";
import { Agente } from "@quimera-extension/base-ventas";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useEffect } from "react";

import initialData from "./initial-data";

function InformeClientesVentaArt({ useStyles }) {
  // return (<Box/>)
  const [
    { clientes, clientesTotal, clientesNoRepetidos, referencia, fechaDesde, fechaHasta, filtro },
    dispatch,
  ] = useStateValue();
  const classes = useStyles();
  console.log("INTERVALOS", initialData.intervalos);
  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        dispatch,
      },
    });
  }, [dispatch]);

  const puedoLanzar = () =>
    filtro.fechaDesde && filtro.fechaHasta && filtro.referencia || filtro.codSubfamilia && filtro.idAgente;

  return (
    <Quimera.Template id="InformeClientesVentaArt">
      <QBox
        titulo={`Clientes por venta de artículo`}
        botonesCabecera={[{ icon: "close", id: "atras", text: "Atrás" }]}
      >
        <Grid container direction="column" item spacing={1}>
          <Grid item xs={12}>
            <Agente id="filtro.idAgente" label="Agente" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <QArticulo id="filtro.referencia" label="Artículo" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <Familia id="filtro.codFamilia" label="Familia" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <Subfamilia
              id="filtro.codSubfamilia"
              codFamilia={filtro.codFamilia}
              label="Subfamilia"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Field.Select
              id="filtro.intervaloFecha"
              label="Intervalo"
              options={initialData.intervalos}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Field.Date id="filtro.fechaDesde" label="Fecha desde" className={classes.field} />
          </Grid>
          <Grid item xs={6}>
            <Field.Date id="filtro.fechaHasta" label="Fecha hasta" className={classes.field} />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-around" mt={2}>
          <Button
            id="lanzarInforme"
            text="Lanzar informe"
            color="primary"
            variant="contained"
            disabled={!puedoLanzar()}
            startIcon={<Icon>file_download</Icon>}
          />
        </Box>
      </QBox>
    </Quimera.Template>
  );
}

export default InformeClientesVentaArt;
