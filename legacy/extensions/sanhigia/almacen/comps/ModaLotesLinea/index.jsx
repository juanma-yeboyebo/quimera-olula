import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Field,
  Grid,
  Icon,
  IconButton,
  Typography,
} from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { CircularProgress } from "@quimera/thirdparty";
import { useStateValue } from "quimera";
import React from "react";

import { ListItemLineaLote } from "..";

const useStyles = makeStyles(theme => ({ paper: { minWidth: "500px" } }));

function ModaLotesLinea({
  disabled,
  dispatch,
  hideSecondary = false,
  codPrepracionPedido,
  idPedido,
  selected = false,
  ...props
}) {
  const classes = useStyles();
  const [
    {
      anadiendoCantidadLote,
      selectedLote,
      lotesAlmacen,
      idLineaModal,
      modalLotesTipo,
      cantidadAnadir,
      loteAnadir,
      fechaAnadir,
    },
  ] = useStateValue();
  console.log("modalloteslinea", loteAnadir);

  return (
    <>
      <DialogTitle>
        <Grid container alignItems="center" justifyContent="center">
          <Box flexGrow={1}>
            <Typography variant="body1" align="center">
              Asignar lote
            </Typography>
          </Box>
          <Box flexGrow={0}>
            <IconButton
              id="cerrar"
              size="small"
              alt="Cerrar"
              onClick={() => dispatch({ type: "onCerrarModalLotesAlmacen", payload: {} })}
            >
              <Icon title="Cerrar">close</Icon>
            </IconButton>
          </Box>
        </Grid>
      </DialogTitle>
      <DialogContent dividers={true}>
        {modalLotesTipo === "movilotescli" && (
          <Box>
            <Box display="flex" justifyContent="flex-start">
              <Box flexGrow={1}>
                <Field.Text
                  id="loteAnadir"
                  value={loteAnadir}
                  label="Código de lote"
                  inputProps={{ maxLength: 30 }}
                  fullWidth
                />
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-start">
              <Box flexGrow={1}>
                <Field.Date
                  id="fechaAnadir"
                  value={fechaAnadir}
                  label="F. caducidad"
                  className={classes.field}
                  fullWidth
                />
              </Box>
            </Box>
          </Box>
        )}
        {modalLotesTipo === "info" && (
          <Box>
            <Grid item xs={6} sm={2} md={2}>
              <Field.Float
                id="cantidadAnadir"
                label="Cantidad"
                value={cantidadAnadir}
                allowNegative={false}
                onClick={event => event.target.select()}
              />
            </Grid>
          </Box>
        )}
        <ListItemLineaLote
          key="lotesAlmacen"
          lineas={lotesAlmacen}
          disabled={false}
          dispatch={dispatch}
        />
      </DialogContent>
      <Box>
        {modalLotesTipo === "completar" && (
          <Box display="flex">
            <Box display="flex" style={{ marginLeft: "20px" }}>
              <Button
                id="crear"
                onClick={() =>
                  dispatch({
                    type: "onAsignarLote",
                    payload: {
                      idLinea: idLineaModal,
                      codLote: selectedLote,
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
            {/* <Box display="flex" style={{ marginLeft: "50px" }}>
              <Button
                id="crear"
                onClick={() =>
                  dispatch({
                    type: "onVerMovilotesCliClicked",
                    payload: {
                      urlMovilote: `/sh_preparaciondepedidos/${codPrepracionPedido}/movilotes/${idLineaModal}`,
                    },
                  })
                }
                variant="text"
                color="primary"
                disabled={false}
                startIcon={<Icon>edit</Icon>}
              >
                VER LOTES
              </Button>
            </Box> */}
          </Box>
        )}
        {modalLotesTipo === "completarPedido" && (
          <Box display="flex">
            <Box display="flex" style={{ marginLeft: "20px" }}>
              <Button
                id="crear"
                onClick={() =>
                  dispatch({
                    type: "onAsignarLote",
                    payload: {
                      idLinea: idLineaModal,
                      codLote: selectedLote,
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
            <Box display="flex" style={{ marginLeft: "50px" }}>
              <Button
                id="crear"
                onClick={() =>
                  dispatch({
                    type: "onVerMovilotesCliClicked",
                    payload: {
                      urlMovilote: `/generarpreparaciones/${idPedido}/movilotes/${idLineaModal}`,
                    },
                  })
                }
                variant="text"
                color="primary"
                disabled={false}
                startIcon={<Icon>edit</Icon>}
              >
                VER LOTES
              </Button>
            </Box>
          </Box>
        )}

        {modalLotesTipo === "info" && (
          <Box display="flex">
            <Box display="flex" style={{ marginLeft: "20px", minWidth: "90px" }}>
              <Button
                id="crear"
                onClick={() =>
                  dispatch({
                    type: "onAnadirCantidadLote",
                    payload: {
                      idLinea: idLineaModal,
                      codLote: selectedLote,
                      cantidadAnadir,
                    },
                  })
                }
                variant="text"
                color="primary"
                disabled={anadiendoCantidadLote}
                startIcon={!anadiendoCantidadLote && <Icon>save_alt</Icon>}
              >
                <Box style={{ display: "flex", gap: "10px" }}>
                  {anadiendoCantidadLote ? `GUARDANDO` : "GUARDAR"}
                  {anadiendoCantidadLote && <CircularProgress size={20} />}
                </Box>
              </Button>
            </Box>
            {!anadiendoCantidadLote && (
              <Box display="flex" style={{ marginLeft: "50px" }}>
                {codPrepracionPedido && (
                  <Button
                    id="crear"
                    onClick={() =>
                      dispatch({
                        type: "onVerMovilotesCliClicked",
                        payload: {
                          urlMovilote: `/sh_preparaciondepedidos/${codPrepracionPedido}/movilotes/${idLineaModal}`,
                        },
                      })
                    }
                    variant="text"
                    color="primary"
                    disabled={false}
                    startIcon={<Icon>edit</Icon>}
                  >
                    VER LOTES
                  </Button>
                )}
                {idPedido && (
                  <Button
                    id="crear"
                    onClick={() =>
                      dispatch({
                        type: "onVerMovilotesCliClicked",
                        payload: {
                          urlMovilote: `/generarpreparaciones/${idPedido}/movilotes/${idLineaModal}`,
                        },
                      })
                    }
                    variant="text"
                    color="primary"
                    disabled={false}
                    startIcon={<Icon>edit</Icon>}
                  >
                    VER LOTES
                  </Button>
                )}
              </Box>
            )}
          </Box>
        )}
        {modalLotesTipo === "movilotescli" && (
          <Button
            id="crear"
            onClick={() =>
              dispatch({
                type: "onAnadirMoviloteCliCLiked",
                payload: {
                  idLinea: idLineaModal,
                  codLote: selectedLote,
                  ncodLote: loteAnadir,
                  caducidad: fechaAnadir,
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
        )}
      </Box>
    </>
  );
}

const equalProps = (prev, next) => {
  const equal = true;

  return equal;
};
export default React.memo(ModaLotesLinea, equalProps);
