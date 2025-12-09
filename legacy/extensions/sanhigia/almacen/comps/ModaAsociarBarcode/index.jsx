import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  IconButton,
  Typography,
} from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { useStateValue } from "quimera";
import React from "react";

import { ListItemLineaAsociar } from "..";

const useStyles = makeStyles(theme => ({}));

function ModaAsociarBarcode({ disabled, lineas, dispatch, hideSecondary = false, selected = false, ...props }) {
  const classes = useStyles();
  const [{ selectedAsociar, codbarrasAsociar, codigoBarrasFormateado }] = useStateValue();

  return (
    <>
      <DialogTitle>
        <Grid container alignItems="center" justifyContent="center">
          <Box flexGrow={1}>
            <Typography variant="body1" align="center">
              {`Seleccione el árticulo al que asociar el código de barras '${codigoBarrasFormateado}'`}
            </Typography>
          </Box>
          <Box flexGrow={0}>
            <IconButton
              id="cerrar"
              size="small"
              alt="Cerrar"
              onClick={() => dispatch({ type: "onCerrarModaAsociarBarcode", payload: {} })}
            >
              <Icon title="Cerrar">close</Icon>
            </IconButton>
          </Box>
        </Grid>
      </DialogTitle>
      <DialogContent dividers={true}>
        <ListItemLineaAsociar
          key="lineasAsociar"
          lineas={Object.values(lineas.dict)}
          disabled={false}
          dispatch={dispatch}
        />
      </DialogContent>
      <Box>
        <Button
          id="asociar"
          onClick={() =>
            dispatch({
              type: "onAsociarBarcode",
              payload: {
                idLinea: selectedAsociar,
                barcode: codigoBarrasFormateado,
              },
            })
          }
          variant="text"
          color="primary"
          disabled={false}
          startIcon={<Icon>save_alt</Icon>}
        >
          ASOCIAR
        </Button>
      </Box>
    </>
  );
}

const equalProps = (prev, next) => {
  const equal = true;

  return equal;
};
export default React.memo(ModaAsociarBarcode, equalProps);
