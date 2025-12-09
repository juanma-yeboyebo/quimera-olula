import { Button, Field, Grid, Typography } from "@quimera/comps";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, useTranslation } from "@quimera/thirdparty";
import Quimera, { useStateValue, useWidth } from "quimera";
import { useEffect } from "react";

import { Ubicacion } from "../../../comps";

// import { QTela } from "../../comps";

function AgruparPedidos({ callbackVolver, useStyles }) {
  const [{ agrupandoPedidos, descripcionAgrupar, ubicacionInicial, ubicacionFinal, ubicaciones }, dispatch] = useStateValue();
  // const schema = getSchemas().configSofa;
  // const _c = useStyles()
  const classes = useStyles();
  const { t } = useTranslation();
  useEffect(() => {
    dispatch({
      type: "init",
      payload: { callbackVolver },
    });
  }, [dispatch, callbackVolver]);

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const tablet = ["md"].includes(width);

  return (
    <Quimera.Template id="AgruparPedidos">
      <Dialog
        open={true}
        classes={{ paper: mobile ? classes.paper8050 : classes.paper2040 }}
        onClose={() =>
          dispatch({
            type: `cerrarModalAgruparPedidosGenerarPreparaciones`,
          })
        }
      >
        <DialogTitle id="form-dialog-title">
          <Typography variant="h5" align="center">
            Agrupar pedidos
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container direction="column" justifyContent="space-between">
            <Grid item xs={12}>
              <Field.Text
                id="descripcionAgrupar"
                label="Descripción"
                fullWidth
                // startAdornment={<Icon>{loginUser.icon}</Icon>}
                autoFocus={true}
              />
            </Grid>
            <Grid item xs={12}>
              <Ubicacion
                id="ubicacionInicial"
                label={`Ubicación inicial ${ubicacionInicial ? `: ${ubicacionInicial}` : ""}`}
                ubicaciones={ubicaciones.map(ubicacion => ({
                  key: ubicacion.codUbicacion,
                  value: ubicacion.codUbicacion,
                  option: ubicacion,
                }))}
                fullWidth
                async
              />
            </Grid>
            <Grid item xs={12}>
              <Ubicacion
                id="ubicacionFinal"
                label={`Ubicación final ${ubicacionFinal ? `: ${ubicacionFinal}` : ""}`}
                ubicaciones={ubicaciones.map(ubicacion => ({
                  key: ubicacion.codUbicacion,
                  value: ubicacion.codUbicacion,
                  option: ubicacion,
                }))}
                fullWidth
                async
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid item container justifyContent="space-between">
            <Grid item xs={6} container justify="center" alignItems="center" >
              <Button
                id="cancelar"
                text="Cancelar"
                variant="text"
                color="secondary"
                onClick={() => dispatch({ type: "cerrarModalAgruparPedidosGenerarPreparaciones" })}
              // onClick={() => dispatch({ type: "volverMaster" })}
              // onClick={() => dispatch({ type: "volverCatalogo" })}
              />
            </Grid>
            <Grid item xs={6} container justify="center" alignItems="center" >
              {agrupandoPedidos ? (
                <Grid container direction="column" justify="center" alignItems="center" >
                  <CircularProgress size={30} />
                </Grid>
              )
                :
                <Button
                  id="agruparPedidos"
                  text="Agrupar"
                  variant="text"
                  color="primary"
                  onClick={() =>
                    dispatch({
                      type: "onAgruparPedidosGenerarPreparacionesConfirmado",
                      payload: { descripcionAgrupar, ubicacionInicial, ubicacionFinal },
                    })
                  }
                  disabled={!descripcionAgrupar || !ubicacionInicial || !ubicacionFinal}
                />
              }
            </Grid>

          </Grid>
        </DialogActions>
      </Dialog>
    </Quimera.Template>
  );
}

export default AgruparPedidos;
