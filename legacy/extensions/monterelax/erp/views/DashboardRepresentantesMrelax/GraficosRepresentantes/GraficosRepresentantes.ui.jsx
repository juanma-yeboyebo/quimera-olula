import { Chart } from "@quimera/comps";
import { Box, Grid } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React from "react";

function GraficosGerencia({ useStyles }) {
  const [
    {
      lineChartUnidadesModelo,
      lineChartValorPedidosCliente,
      lineChartPedidosCliente,
      globalPedidos,
      globalVentas,
      comision,
      visibleGerencias,
    },
    dispatch,
  ] = useStateValue();
  const classes = useStyles();

  return (
    <Quimera.Template id="GraficosGerencia">
      <Grid container>
        <Grid item xs={12} sm={12} md={6}>
          <Box component="div" className={classes.infoBoxv1}>
            <div className={classes.lineChartv1}>
              <Chart.Bar chartProps={lineChartPedidosCliente} />
            </div>
            <Box component="div" className={classes.mediaContainerv1}>
              <div className={classes.mediaContainerTitlev1}>Nº de pedidos</div>
              <div className={classes.mediaContainerValuev1}> {globalPedidos}</div>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Box component="div" className={classes.infoBoxv1}>
            <div className={classes.lineChartv1}>
              <Chart.Bar chartProps={lineChartValorPedidosCliente} />
            </div>
            <Box component="div" className={classes.mediaContainerv1}>
              <div className={classes.mediaContainerTitlev1}>Nº de ventas</div>
              <div className={classes.mediaContainerValuev1}> {globalVentas}</div>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Box component="div" className={classes.infoBoxv1}>
            <div className={classes.lineChartv1}>
              <Chart.Bar chartProps={lineChartUnidadesModelo} />
            </div>
            <br />
            <br />
            <Box component="div" className={classes.mediaContainerv1}>
              <div className={classes.mediaContainerTitlev1}>Comision</div>
              <div className={classes.mediaContainerValuev1}> {comision}</div>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Quimera.Template>
  );
}

export default GraficosGerencia;
