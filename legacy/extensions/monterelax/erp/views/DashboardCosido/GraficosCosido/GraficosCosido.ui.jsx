import { Chart } from "@quimera/comps";
import { Grid } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React from "react";

function GraficosCosido({ useStyles }) {
  const [{ datosGraficoPendientes, datosGraficoMedia, datosGraficoTotales }] = useStateValue();
  // const classes = useStyles()

  return (
    <Quimera.Template id="GraficosCosido">
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={6}>
          <Chart.Bar chartProps={datosGraficoPendientes} />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Chart.Bar chartProps={datosGraficoMedia} />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Chart.Bar chartProps={datosGraficoTotales} />
        </Grid>
      </Grid>
    </Quimera.Template>
  );
}

export default GraficosCosido;
