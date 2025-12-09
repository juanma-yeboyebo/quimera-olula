import { Chart } from "@quimera/comps";
import { Box, Grid } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React from "react";

function GraficosCobros({ useStyles }) {
  const [{ lineChartRecibosDevueltos, lineChartRecibosPendientes, visibleGerencias }, dispatch] =
    useStateValue();
  const classes = useStyles();

  return (
    <Quimera.Template id="GraficosCobros">
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={6}>
          <Box w={1} border={0}>
            <Chart.Bar chartProps={lineChartRecibosPendientes} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Box w={1} border={0}>
            <Chart.Bar chartProps={lineChartRecibosDevueltos} />
          </Box>
        </Grid>
      </Grid>
    </Quimera.Template>
  );
}

export default GraficosCobros;
