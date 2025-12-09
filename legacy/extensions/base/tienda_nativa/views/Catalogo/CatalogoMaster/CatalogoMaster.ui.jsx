import { Box, Fab, Grid, Icon } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { InfiniteScroll } from "@quimera/thirdparty";
import Quimera, { useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

const useStyles = makeStyles(theme => ({
  button: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "1000",
  },
}));

function CatalogoMaster({ referencia }) {
  const [{ catalogo }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = 1; // mobile ? 1 : 0.5
  // console.log("Referencia prop: ", referencia);
  // console.log("Catalogo *************: ", catalogo);
  const callbackNewCategoriaChanged = useCallback(
    payload => dispatch({ type: "onNewCategoriaChanged", payload }),
    [],
  );
  const altoCabecera = 70;
  const altura = `calc(100vh - ${altoCabecera}px)`;
  const classes = useStyles();

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
            <Quimera.SubView id="Catalogo/CatalogoFiltro" />
            <Box borderColor="red" border={0} id="scrollable" style={{ overflow: "scroll" }}>
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
    </Quimera.Template>
  );
}

export default CatalogoMaster;
