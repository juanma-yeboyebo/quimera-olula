import { Box, Button, DialogTitle, DialogContent, Field, Grid, Icon, IconButton, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import React, { useState } from "react";
import Quimera, { useStateValue, useWidth } from "quimera";
import { ListItemLineaLote } from "../";

const useStyles = makeStyles(theme => ({

}));

function ModalInventarioAlVuelo({ disabled, dispatch, hideSecondary = false, selected = false, ...props }) {
  const classes = useStyles();
  const [{ selectedLote, lotesAlmacen, idLineaModal, cantidadAnadir }] = useStateValue();

  return (
    <>
      <DialogTitle>
        <Grid container alignItems="center" justifyContent="center">
          <Box flexGrow={1}>
            <Typography variant="body1" align="center">
              Inventario al vuelo
            </Typography>
          </Box>
          <Box flexGrow={0}>
            <IconButton id='cerrar' size="small" alt="Cerrar" onClick={() => dispatch({ type: 'onCerrarModalLotesInventario', payload: {} })}>
              <Icon title="Cerrar">close</Icon>
            </IconButton>
          </Box>
        </Grid>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Box mx={3} mb={1} display="flex" justifyContent="space-between" mt={1}>
          <Grid item xs={6} sm={6} md={6}>
            <Field.Int id="cantidadAnadir" label="Cantidad final" value={cantidadAnadir} onClick={event => event.target.select()} />

          </Grid>
          <Grid item xs={6} sm={2} md={2}>
            <Button
              id="verTodosLotes"
              text={"Ver Todos"}
              variant="outlined"
              color="primary"
              onClick={() => {
                dispatch({
                  type: "onVerTodos",
                  payload: { idLinea: idLineaModal },
                });
              }}
              style={{ marginTop: "20px", marginLeft: "50px" }}
            />
          </Grid>
        </Box>
        <ListItemLineaLote
          key="lotesAlmacen"
          lineas={lotesAlmacen}
          disabled={false}
          dispatch={dispatch}
        />
      </DialogContent>
      <Box mx={3} mb={1} display="flex" justifyContent="space-between" mt={1}>
        <Button
          id="crear"
          onClick={() =>
            dispatch({
              type: "onInventariarLote",
              payload: {
                idLinea: idLineaModal,
                codLote: selectedLote,
                cantidadInventariar: cantidadAnadir
              },
            })
          }
          variant="text"
          color="primary"
          disabled={false}
          startIcon={<Icon>save_alt</Icon>}
        >
          GUARDAR
        </Button>
      </Box>
    </>
  );
}

export default React.memo(ModalInventarioAlVuelo);
