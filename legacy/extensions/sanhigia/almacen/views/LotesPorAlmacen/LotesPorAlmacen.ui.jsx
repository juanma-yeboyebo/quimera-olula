import {
  Box,
  Button,
  Column,
  Container,
  Field,
  Grid,
  Icon,
  IconButton,
  ListItem,
  Table,
  Typography,
} from "@quimera/comps";
import { Backdrop, CircularProgress, Divider, Hidden, List } from "@quimera/thirdparty";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import { useEffect } from "react";

function LotesPorAlmacen({ idLinea, callbackCerrado, useStyles, initLotesAlmacen }) {
  const [
    { idLinea: idLineaState },
    dispatch,
  ] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    idLinea !== idLineaState &&
      dispatch({
        type: "onInit",
        payload: { idLinea, callbackCerrado },
      });
  }, [idLinea, callbackCerrado, dispatch]);

  return (
    <Quimera.Template id="LotesPorAlmacen">
      <Container disableGutters={width === "xs" || width === "sm"} className={classes.container}>
        {idLinea && (
          <>
            <Box className={classes.cabeceraPedido}>
              <Box className={classes.cabeceraPedidoTitulo}>
                <IconButton id="cerrar" size="small" onClick={() => callbackCerrado()}>
                  <Icon>close</Icon>
                </IconButton>
              </Box>
              <Divider />
            </Box>
            <Divider />
            Hola mundo {idLinea}
          </>
        )}
      </Container>
    </Quimera.Template>
  );
}

export default LotesPorAlmacen;
