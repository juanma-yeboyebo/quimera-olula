import { Box, Chart, Grid } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React from "react";

function GraficosGerencia({ tipo, useStyles }) {
  const [
    {
      lineChartImportesProps,
      lineChartPiezasProps,
      lineChartMetrosProps,
      lineChartPiezasCorCosRevProps,
    },
    dispatch,
  ] = useStateValue();
  const classes = useStyles();
  const w = useWidth();
  const mobile = ["xs", "sm"].includes(w);
  const chartClass = mobile ? classes.chartMobile : classes.chartDesktop;

  const gerencia = tipo === "gerencia";

  return (
    <Quimera.Template id="GraficosGerencia">
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Box w={1} border={0} className={chartClass}>
            <Chart.Line chartProps={lineChartPiezasProps} />
          </Box>
        </Grid>
        {gerencia && (
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Box w={1} border={0} className={chartClass}>
              <Chart.Line chartProps={lineChartImportesProps} />
            </Box>
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Box w={1} border={0} className={chartClass}>
            <Chart.Line chartProps={lineChartMetrosProps} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Box w={1} border={0} className={chartClass}>
            <Chart.Line chartProps={lineChartPiezasCorCosRevProps} />
          </Box>
        </Grid>
      </Grid>
    </Quimera.Template>
  );
}

export default GraficosGerencia;
