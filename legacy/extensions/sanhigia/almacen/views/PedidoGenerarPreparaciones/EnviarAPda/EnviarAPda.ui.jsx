import { Button, CircularProgress, Field, Grid, Typography } from "@quimera/comps";
import { Dialog, DialogActions, DialogContent, DialogTitle, useTranslation } from "@quimera/thirdparty";
import Quimera, { getSchemas, useStateValue, useWidth } from "quimera";
import { useEffect } from "react";

import { AgenciasTransporte, TarifasAgencias } from "../../../comps";

// import { QTela } from "../../comps";

function EnviarAPda({ callbackVolver, useStyles }) {
  const [{ pedido, status }, dispatch] = useStateValue();
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
  const schema = getSchemas().generarpreparaciones;
  // console.log("mi log", status);

  return (
    <Quimera.Template id="EnviarAPda">
      <Dialog
        open={true}
        // classes={{ paper: mobile ? classes.paper8050 : classes.paper2040 }}
        maxWidth="md"
        fullWidth
        onClose={() =>
          dispatch({
            type: `cerrarModalEnviarAPda`,
          })
        }
      >
        <DialogTitle id="form-dialog-title">
          <Typography variant="h5" align="center">
            Enviar a PDA
          </Typography>
        </DialogTitle>
        <DialogContent>
          {status.vistaEnviarPda === "bultos" && (
            <Grid container direction="column" justifyContent="space-between">
              <Grid item xs={12} sm={12}>
                <Field.Int
                  id="pedido.buffer.canBultos"
                  label="Nº de bultos"
                  onClick={event => event.target.select()}
                  fullWidth
                  // startAdornment={<Icon>{loginUser.icon}</Icon>}
                  autoFocus={true}
                />
              </Grid>
              <Grid item xs={12}>
                <Field.Float
                  id="pedido.buffer.pesoBultos"
                  label="Peso de los bultos"
                  onClick={event => event.target.select()}
                  fullWidth
                // startAdornment={<Icon>{loginUser.icon}</Icon>}
                />
              </Grid>
            </Grid>
          )}
          {status.vistaEnviarPda === "agencia" && (
            <Grid container direction="column" justifyContent="space-between" spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <AgenciasTransporte
                  id="pedido.buffer.codAgencia"
                  label="Agencia de transporte"
                  fullWidth
                  codAgencia={pedido.buffer.codAgencia}
                  async
                  disabled={status.enviandoPda}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TarifasAgencias
                  id="pedido.buffer.codProductoAgt"
                  label="Tarifa"
                  codAgencia={pedido.buffer.codAgencia}
                  codProductoAgt={pedido.buffer.codProductoAgt}
                  fullWidth
                  async
                  disabled={status.enviandoPda}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          {status.enviandoPda ? (
            <Grid container direction="column" justifyContent="center">
              <CircularProgress color="white" size={40} />
            </Grid>
          ) : (
            <Grid item container justifyContent="space-between">
              <Button
                id="cancelar"
                text="Cancelar"
                variant="text"
                color="secondary"
                onClick={() => dispatch({ type: "cerrarModalEnviarAPda" })}
              />
              {status.vistaEnviarPda === "bultos" && (
                <Button
                  id="calcularAgencia"
                  text="Calcular tarifa"
                  variant="text"
                  color="primary"
                  onClick={() => dispatch({ type: "onCalcularAgenciaTarifa" })}
                  disabled={!pedido.buffer.canBultos || !pedido.buffer.pesoBultos}
                />
              )}
              {status.vistaEnviarPda === "agencia" && (
                <Button
                  id="EnviarAPda"
                  text="Enviar"
                  variant="text"
                  color="primary"
                  onClick={() => dispatch({ type: "onEnviarAPdaConfirmado" })}
                  disabled={
                    !pedido.buffer.canBultos ||
                    !pedido.buffer.pesoBultos ||
                    !pedido.buffer.codAgencia ||
                    !pedido.buffer.codProductoAgt ||
                    status.enviandoPda
                  }
                />
              )}
            </Grid>
          )}
        </DialogActions>
      </Dialog>
    </Quimera.Template>
  );
}

export default EnviarAPda;
