import { Box, Button, Fab, Grid, Icon, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { InfiniteScroll, Trans, useTranslation } from "@quimera/thirdparty";
import Quimera, { A, navigate, useStateValue, useWidth, util } from "quimera";
import "./CatalogoMaster.style.scss";

import { altoCabeceraMaster } from "../../../static/local";

const useStyles = makeStyles(theme => ({
  button: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "1000",
  },
}));

function CatalogoMaster({ referencia }) {
  const [{ catalogo, referenciaExt, soloDisponibles }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = 1; // mobile ? 1 : 0.5
  let altoCabecera = altoCabeceraMaster;
  const client = util.getEnvironment()?.client;
  if (client === "tienda-nativa-bnp") {
    altoCabecera += 155;
  }
  if (client === "tienda-nativa-vbarba") {
    altoCabecera += 80;
  }
  const altura = `calc(100vh - ${altoCabecera}px)`;
  const classes = useStyles();
  const guest = util.getUser().user === "guest";
  const { t } = useTranslation();

  return (
    <Quimera.Template id="CatalogoMaster">
      {!referenciaExt && (
        <Fab
          className={classes.button}
          color="primary"
          onClick={e => dispatch({ type: "onMostrarFiltroClicked" })}
        >
          <Icon>search</Icon>
        </Fab>
      )}

      <Box width={anchoDetalle} maxHeight={!mobile && altura}>
        <Box display="flex" maxHeight={!mobile && altura}>
          {!referenciaExt && <Quimera.SubView id="Catalogo/CatalogoFiltro" />}
          <Box className="PresentacionItemsTexto" borderColor="red" border={0} id="scrollable" style={{ overflow: "scroll" }}>
            <Box pl={1}>
              <h1>{t("catalogo.titulo")}</h1>
              <p>{t("catalogo.subtitulo")}</p>
            </Box>
            <Box display="flex" className="PresentacionItemsImagenes">
              <img
                src={"/img/logoFinanciadoUE.jpg"}
                height={100}
                alt={"Financiado por la Unión Europera. NextGenerationEU"}
                loading="lazy"
              />
              <Box mr={1} my={1} />
              <img
                src={"/img/logoPRTR.jpg"}
                height={100}
                alt={"Plan de Recuperación, Transformación y Resiliencia"}
                loading="lazy"
              />
            </Box>
            <Box pl={1} pt={1}>
              {guest && (
                <Typography variant="body1">
                  <Trans i18nKey="catalogo.avisoNoLogueado">
                    Para comprar es necesario tener una cuenta.{" "}
                    <A href="/login/customer">Identifíquese</A> o{" "}
                    <a href="mailto:clientes@arribascenter.com">contacte con nosotros</a> para crear
                    una.
                  </Trans>
                </Typography>
              )}
            </Box>
            {referenciaExt && (
              <Box my={2} display={"flex"} justifyContent={"center"}>
                <Button
                  variant="outlined"
                  color="primary"
                  text={t("producto.irACatalogo")}
                  onClick={() => {
                    navigate("/catalogo");
                  }}
                />
              </Box>
            )}
            <InfiniteScroll
              dataLength={catalogo.idList.length}
              next={() => dispatch({ type: "onNextCatalogo" })}
              hasMore={catalogo.page.next !== null}
              loader={<h4>Loading...</h4>}
              // endMessage={<p style={{ textAlign: 'center' }}><b>FIN</b></p>}
              scrollableTarget="scrollable"
            >
              <Grid container display={"flex"} justifyContent={"center"}>
                {catalogo.idList.map(itemId => (

                  <Quimera.SubView id="ItemCatalogo" model={catalogo.dict[itemId]} />

                ))}
              </Grid>
            </InfiniteScroll>
          </Box>
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default CatalogoMaster;
