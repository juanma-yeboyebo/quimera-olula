import { Backdrop, Box, Can, Chart, CircularProgress, MultiIcon, Typography } from "@quimera/comps";
import { clsx, useTheme } from "@quimera/styles";
import { Button, ButtonGroup } from "@quimera/thirdparty";
import Quimera, { useStateValue, useWidth, util } from "quimera";
import { useEffect, useState } from "react";

function DashboardGerenciaMrelax({ useStyles }) {
  const classes = useStyles();

  const [
    {
      cargandoDatos,
      totalFabricadas,
      totalPedidas,
      mediaPiezasFabricadas,
      mediaPiezasPedidas,
      mediaImportePiezasFabricadas,
      mediaImportePiezasPedidas,
      mediaFabricadas,
      mediaRetrasoSalida,
      mediaDiasServicio,
      mediaMetrosPedidos,
      mediaMetrosCortados,
      totalCortadas,
      totalCosidas,
      totalRevestidas,
      mediaPiezasCortadas,
      mediaPiezasCosidas,
      mediaPiezasRevestidas,
      lineChartPiezasProps,
      lineChartImportesProps,
      lineChartMetrosProps,
      lineChartPiezasCorCosRevProps,
    },
    dispatch,
  ] = useStateValue();

  const [chartType, setChartType] = useState("unidades");
  const theme = useTheme();
  const w = useWidth();
  const mobile = ["xs", "sm"].includes(w);

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    util.appDispatch({ type: "setNombrePaginaActual", payload: { nombre: "Dashboard Gerencia" } });

    return () => util.appDispatch({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [dispatch]);

  const alturaFiltro = 70;

  return (
    <Quimera.Template id="DashboardGerenciaMrelax">
      <Backdrop open={cargandoDatos} style={{ zIndex: 999 }}>
        Cargando&nbsp;
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* { mobile
        ? <>
          <HideOnScroll >
            <Box width={1} style={{ position: 'fixed', backgroundColor: 'white' }}>
              <Quimera.SubView id='DashboardGerenciaMrelax/DashboardFiltro' />
            </Box>
          </HideOnScroll>
          <Box width={1} height={alturaFiltro} />
          <Box width={1}>
            {/* <Box mx={1} >
              { idTabDashboard === 0 &&
                <Quimera.SubView id='DashboardGerenciaMrelax/GraficosGerencia' tipo={tipo} />
              }
              { idTabDashboard === 1 &&
                <Quimera.SubView id='DashboardGerenciaMrelax/Totales' tipo={tipo} />
              }
            </Box> 
          </Box>
        </>
        :  */}{" "}
      <>
        <Box width={1} height={alturaFiltro} className={classes.filterWrapper}>
          <Quimera.SubView id="DashboardGerenciaMrelax/DashboardFiltro" />
        </Box>
        <Box width={1} className={classes.report} height={`calc(100% - ${alturaFiltro}px)`}>
          {/* <Box mx={1} >
              { idTabDashboard === 0 &&
                <Quimera.SubView id='DashboardGerenciaMrelax/GraficosGerencia' tipo={tipo} />
              }
              { idTabDashboard === 1 &&
                <Quimera.SubView id='DashboardGerenciaMrelax/Totales' tipo={tipo} />
              }
            </Box> */}
          <div className={clsx(classes.reportHeader, mobile ? classes.mobileResponsiveParent : "")}>
            <div className={classes.mainMetric}>
              <MultiIcon
                lgColor={theme.custom.menu.main}
                smColor={theme.custom.menu.accent}
                fontSize={60}
                className={classes.appIcon}
              >
                {["weekend", "done"]}
              </MultiIcon>
              <Typography variant="h6">Piezas Fabricadas</Typography>
              <div className={classes.mainMetricNums}>
                <span>{totalFabricadas}</span>
                <span>x&#x0304; {mediaPiezasFabricadas}</span>
                <Can rule="Menu:botones-gerencia">
                  <span>&#x20AC; {mediaImportePiezasFabricadas}</span>
                </Can>
              </div>
            </div>
            {/* <meter
                id='meterFabricadas'
                className={ classes.meterFabricadas }
                min='0'
                max='100'
                low='33'
                high='66'
                optimum='80'
                value={ (totalFabricadas * 100) / totalPedidas }
              >
                { totalFabricadas } de { totalPedidas }
              </meter> */}
            <div className={classes.mainMetric}>
              <MultiIcon
                lgColor={theme.custom.menu.main}
                smColor={theme.custom.menu.accent}
                fontSize={60}
                className={classes.appIcon}
              >
                {["weekend", "rotate_left"]}
              </MultiIcon>
              <Typography variant="h6">Piezas Pedidas</Typography>
              <div className={classes.mainMetricNums}>
                <span>{totalPedidas}</span>
                <span>x&#x0304; {mediaPiezasPedidas}</span>
                <Can rule="Menu:botones-gerencia">
                  <span>&#x20AC; {mediaImportePiezasPedidas}</span>
                </Can>
              </div>
            </div>
          </div>
          <section
            className={clsx(classes.reportSection, mobile ? classes.mobileResponsiveParent : "")}
          >
            <div
              className={clsx(classes.headerCharts, mobile ? classes.mobileResponsiveChild : "")}
            >
              <ButtonGroup
                className={classes.switchChart}
                color="primary"
                aria-label="outlined primary button group"
              >
                <Button
                  variant={chartType === "unidades" ? "contained" : "outlined"}
                  onClick={() => setChartType("unidades")}
                >
                  Piezas
                </Button>
                <Can rule="Menu:botones-gerencia">
                  <Button
                    variant={chartType === "importes" ? "contained" : "outlined"}
                    onClick={() => setChartType("importes")}
                  >
                    Importes
                  </Button>
                </Can>
              </ButtonGroup>
              {chartType === "unidades" && <Chart.Line chartProps={lineChartPiezasProps} />}
              {chartType === "importes" && (
                <Can rule="Menu:botones-gerencia">
                  <Chart.Line chartProps={lineChartImportesProps} />
                </Can>
              )}
            </div>
            <article
              className={classes.infoArticle}
              style={{
                flexBasis: mobile ? "100%" : "33%",
              }}
            >
              <details open={true}>
                <summary>
                  <strong>Días de servicio</strong>
                </summary>
                <hr />
                <section>
                  <span className={classes.articleDetail}>
                    Retraso Fabricación
                    <span>x&#x0304; {mediaFabricadas} días</span>
                  </span>
                  <span className={classes.articleDetail}>
                    Retraso Envío
                    <span>x&#x0304; {mediaRetrasoSalida} días</span>
                  </span>
                  <span className={classes.articleDetail}>
                    Días de servicio
                    <span>x&#x0304; {mediaDiasServicio} días</span>
                  </span>
                </section>
              </details>
            </article>
          </section>
          <section
            className={clsx(classes.reportSection, mobile ? classes.mobileResponsiveParent : "")}
          >
            <article
              className={clsx(classes.infoArticle, mobile ? classes.mobileResponsiveChild : "")}
            >
              <details open={true}>
                <summary>
                  <strong>Metros</strong>
                </summary>
                <hr />
                <section>
                  <span className={classes.articleDetail}>
                    Pedidos
                    <span>x&#x0304; {mediaMetrosPedidos} metros</span>
                  </span>
                  <span className={classes.articleDetail}>
                    Cortados
                    <span>x&#x0304; {mediaMetrosCortados} metros</span>
                  </span>
                </section>
                <Chart.Line chartProps={lineChartMetrosProps} />
              </details>
            </article>
            <article
              className={clsx(classes.infoArticle, mobile ? classes.mobileResponsiveChild : "")}
            >
              <details open={true}>
                <summary>
                  <strong>Fabricación</strong>
                </summary>
                <hr />
                <section>
                  <span className={classes.articleDetail}>
                    Cortadas
                    <span>
                      {totalCortadas}
                      <span>x&#x0304; {mediaPiezasCortadas}</span>
                    </span>
                  </span>
                  <span className={classes.articleDetail}>
                    Cosidas
                    <span>
                      {totalCosidas}
                      <span>x&#x0304; {mediaPiezasCosidas}</span>
                    </span>
                  </span>
                  <span className={classes.articleDetail}>
                    Revestidas
                    <span>
                      {totalRevestidas}
                      <span>x&#x0304; {mediaPiezasRevestidas}</span>
                    </span>
                  </span>
                </section>
                <Chart.Line chartProps={lineChartPiezasCorCosRevProps} />
              </details>
            </article>
          </section>
        </Box>
      </>
    </Quimera.Template>
  );
}

export default DashboardGerenciaMrelax;
