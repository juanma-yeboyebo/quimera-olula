import { Box, Fab, Grid, Icon } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { InfiniteScroll, useTranslation } from "@quimera/thirdparty";
import Quimera, { useStateValue, useWidth, util } from "quimera";
import { useCallback } from "react";

const useStyles = makeStyles(theme => ({
  button: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "1000",
  },
  logo: {
    // "transform": "scale(0.7)",
    // "transition": "all .4s ease-in-out",
    // "&:hover": {
    //   transform: "scale(0.85)",
    // },
  },
  blackLogo: {
    filter: "brightness(1) invert(1)",
  },
}));

function CatalogoMaster() {
  const [{ catalogo, idModelo }, dispatch] = useStateValue();
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = 1; // mobile ? 1 : 0.5
  const { t } = useTranslation();

  const callbackNewCategoriaChanged = useCallback(
    payload => dispatch({ type: "onNewCategoriaChanged", payload }),
    [],
  );
  const altoCabecera = 70;
  const altura = `calc(100vh - ${altoCabecera}px)`;
  const classes = useStyles();

  const baseImageSrc = util.getEnvironment().getUrlImages();

  return (
    <Quimera.Template id="CatalogoMaster">
      <Fab
        className={classes.button}
        color="primary"
        onClick={e => dispatch({ type: "onMostrarFiltroClicked" })}
      >
        <Icon>filter_alt</Icon>
      </Fab>
      <Box width={anchoDetalle} maxHeight={1}>
        <Box width={1}>
          <Box display="flex" maxHeight={!mobile && altura}>
            {/* <Quimera.SubView id="Catalogo/CatalogoFiltro" /> */}
            <Box borderColor="red" border={0} id="scrollable" style={{ overflow: "scroll" }}>
              <Box pl={1}>
                {/* <h1>{t("catalogo.titulo")}</h1> */}
                <Box style={{ gap: "10px" }} display={"flex"} alignItems={"center"}>
                  <h1>{t("catalogo.titulo")}</h1>
                  <img
                    alt="Monterelax logo"
                    src="/img/logo_blanco_monte_relax_horizo.png"
                    height={60}
                    className={`${classes.logo} ${classes.blackLogo}`}
                  />
                </Box>
                <p>{t("catalogo.subtitulo")}</p>
              </Box>
              <Box display="flex">
                <img
                  src={`${baseImageSrc}/logoFinanciadoUE.jpg`}
                  height={100}
                  alt={"Financiado por la Unión Europera. NextGenerationEU"}
                  loading="lazy"
                />
                <Box mr={1} />
                <img
                  src={`${baseImageSrc}/logoPRTR.jpg`}
                  height={100}
                  alt={"Plan de Recuperación, Transformación y Resiliencia"}
                  loading="lazy"
                />
              </Box>
              <InfiniteScroll
                dataLength={catalogo.idList.length}
                next={() => dispatch({ type: "onNextCatalogo" })}
                hasMore={catalogo.page.next !== null}
                loader={<h4>Loading...</h4>}
                // endMessage={<p style={{ textAlign: 'center' }}><b>FIN</b></p>}
                scrollableTarget="scrollable"
              >
                <Grid container>
                  {catalogo.idList.map(itemId => (
                    <Grid item key={itemId}>
                      <Box m={1}>
                        <Quimera.SubView id="ItemCatalogo" model={catalogo.dict[itemId]} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </InfiniteScroll>
            </Box>
          </Box>
        </Box>
      </Box>

      {idModelo && (
        <Quimera.View
          id="ConfiguracionSofa"
          idModeloProp={idModelo}
          callbackVolver={() => dispatch({ type: "cerraModalCompra" })}
        />
      )}
    </Quimera.Template>
  );
}

export default CatalogoMaster;
