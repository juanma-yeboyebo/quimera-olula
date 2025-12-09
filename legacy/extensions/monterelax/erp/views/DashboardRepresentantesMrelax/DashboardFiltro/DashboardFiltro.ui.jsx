import { Box, Field, Grid } from "@quimera/comps";
import { Agente } from "@quimera-extension/base-ventas";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React from "react";

import initialData from "./../initial-data";

function DashboardFiltro({ useStyles }) {
  const [{ visibleGerencia, bufferFiltro }, dispatch] = useStateValue();
  const classes = useStyles();

  return (
    <Quimera.Template id="DashboardFiltro">
      <Grid container item spacing={1}>
        <Grid item xs={12} sm={2} md={2}>
          <Box width={1} border={0}>
            <Field.Select
              id="bufferFiltro.intervaloFecha"
              label="Intervalo"
              field="bufferFiltro.intervaloFecha"
              options={initialData.intervalos}
              fullWidth
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Field.Date
            id="bufferFiltro.fechaDesde"
            field="bufferFiltro.fechaDesde"
            label="Fecha desde"
          />
          &nbsp;&nbsp;
          <Field.Date
            id="bufferFiltro.fechaHasta"
            field="bufferFiltro.fechaHasta"
            label="Fecha hasta"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          {/* <Agente id='bufferFiltro.codagente' label='Agente' fullWidth  /> */}
          <Box width={1} visibility={visibleGerencia}>
            <Agente id="bufferFiltro.codagente" label="Agente" fullWidth />
          </Box>
        </Grid>
      </Grid>
    </Quimera.Template>
  );
}

export default DashboardFiltro;
