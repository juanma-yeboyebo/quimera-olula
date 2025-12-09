import CreditCardIcon from "@mui/icons-material/CreditCard";
import EuroSymbolIcon from "@mui/icons-material/EuroSymbol";
import { Box, Button, Field, Grid, Icon, IconButton, Typography } from "@quimera/comps";
import Quimera, { useStateValue, util } from "quimera";

function VentasPagos({ useStyles }) {
  const [{ ventas, ventasBuffer, pagosBuffer, entregado }, dispatch] = useStateValue();
  const classes = useStyles();

  return (
    <Quimera.Template id="VentasPagos">
      {!ventas.dict[ventas.current].cerrada && (
        <Box>
          <Typography variant="overline">NUEVO PAGO</Typography>
          <Grid container spacing={2}>
            {pagosBuffer.formaPago === null ? (
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="space-evenly">
                  <IconButton id="pagoContado">
                    <EuroSymbolIcon className={classes.botonesPago} />
                  </IconButton>
                  <IconButton id="pagoTarjeta">
                    <CreditCardIcon className={classes.botonesPago} />
                  </IconButton>
                </Box>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Grid item container spacing={2}>
                  <Grid item xs={6}></Grid>
                  <Grid item xs={6}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Field.Currency
                        id="entregado"
                        label="ENTREGADO"
                        fullWidth
                        helperText={
                          pagosBuffer.formaPago === "TARJ" && entregado > ventasBuffer.pendiente
                            ? "CANTIDAD NO VÁLIDA"
                            : ""
                        }
                      />
                      <Button id="limpiarEntregado" text={<Icon>delete</Icon>} />
                    </Box>
                  </Grid>
                </Grid>
                {pagosBuffer.formaPago === "CONT" && (
                  <Grid item container spacing={2}>
                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">
                          IMPORTE: &nbsp; {util.euros(ventasBuffer.pendiente)}
                        </Typography>
                        <Typography variant="h6">
                          A DEVOLVER: &nbsp;
                          {util.euros(
                            entregado <= ventasBuffer.pendiente
                              ? 0
                              : entregado - ventasBuffer.pendiente < 0
                                ? (entregado - ventasBuffer.pendiente) * -1
                                : entregado - ventasBuffer.pendiente,
                          )}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Box display="flex" alignItems="center" justifyContent="space-evenly">
                            <IconButton
                              id="001"
                              className={classes.botonesMonedas}
                              onClick={() =>
                                dispatch({ type: "onCantidadClicked", payload: { item: 0.01 } })
                              }
                            >
                              <img src="/img/0_01.png" alt="0.01€" width="50" />
                            </IconButton>
                            <IconButton
                              id="002"
                              className={classes.botonesMonedas}
                              onClick={() =>
                                dispatch({ type: "onCantidadClicked", payload: { item: 0.02 } })
                              }
                            >
                              <img src="/img/0_02.png" alt="0.02€" width="50" />
                            </IconButton>
                            <IconButton
                              id="005"
                              className={classes.botonesMonedas}
                              onClick={() =>
                                dispatch({ type: "onCantidadClicked", payload: { item: 0.05 } })
                              }
                            >
                              <img src="/img/0_05.png" alt="0.05€" width="50" />
                            </IconButton>
                            <IconButton
                              id="010"
                              className={classes.botonesMonedas}
                              onClick={() =>
                                dispatch({ type: "onCantidadClicked", payload: { item: 0.1 } })
                              }
                            >
                              <img src="/img/0_10.png" alt="0.10€" width="50" />
                            </IconButton>
                            <IconButton
                              id="020"
                              className={classes.botonesMonedas}
                              onClick={() =>
                                dispatch({ type: "onCantidadClicked", payload: { item: 0.2 } })
                              }
                            >
                              <img src="/img/0_20.png" alt="0.20€" width="50" />
                            </IconButton>
                            <IconButton
                              id="050"
                              className={classes.botonesMonedas}
                              onClick={() =>
                                dispatch({ type: "onCantidadClicked", payload: { item: 0.5 } })
                              }
                            >
                              <img src="/img/0_50.png" alt="0.50€" width="50" />
                            </IconButton>
                            <IconButton
                              id="100"
                              className={classes.botonesMonedas}
                              onClick={() =>
                                dispatch({ type: "onCantidadClicked", payload: { item: 1 } })
                              }
                            >
                              <img src="/img/1.png" alt="1.00€" width="50" />
                            </IconButton>
                            <IconButton
                              id="200"
                              className={classes.botonesMonedas}
                              onClick={() =>
                                dispatch({ type: "onCantidadClicked", payload: { item: 2 } })
                              }
                            >
                              <img src="/img/2.png" alt="2.00€" width="50" />
                            </IconButton>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box display="flex" alignItems="center" justifyContent="space-evenly">
                            <IconButton
                              id="500"
                              className={classes.botonesBilletes}
                              onClick={() =>
                                dispatch({ type: "onCantidadClicked", payload: { item: 5 } })
                              }
                            >
                              <img src="/img/5.jpg" alt="5.00€" width="100" />
                            </IconButton>
                            <IconButton
                              id="1000"
                              className={classes.botonesBilletes}
                              onClick={() =>
                                dispatch({ type: "onCantidadClicked", payload: { item: 10 } })
                              }
                            >
                              <img src="/img/10.jpg" alt="10.00€" width="100" />
                            </IconButton>
                            <IconButton
                              id="2000"
                              className={classes.botonesBilletes}
                              onClick={() =>
                                dispatch({ type: "onCantidadClicked", payload: { item: 20 } })
                              }
                            >
                              <img src="/img/20.jpg" alt="20.00€" width="100" />
                            </IconButton>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box display="flex" alignItems="center" justifyContent="space-evenly">
                            <IconButton
                              id="5000"
                              className={classes.botonesBilletes}
                              onClick={() =>
                                dispatch({ type: "onCantidadClicked", payload: { item: 50 } })
                              }
                            >
                              <img src="/img/50.jpg" alt="50.00€" width="100" />
                            </IconButton>
                            <IconButton
                              id="10000"
                              className={classes.botonesBilletes}
                              onClick={() =>
                                dispatch({ type: "onCantidadClicked", payload: { item: 100 } })
                              }
                            >
                              <img src="/img/100.jpg" alt="100.00€" width="100" />
                            </IconButton>
                            <IconButton
                              id="20000"
                              className={classes.botonesBilletes}
                              onClick={() =>
                                dispatch({ type: "onCantidadClicked", payload: { item: 200 } })
                              }
                            >
                              <img src="/img/200.jpg" alt="200.00€" width="100" />
                            </IconButton>
                            <IconButton
                              id="50000"
                              className={classes.botonesBilletes}
                              onClick={() =>
                                dispatch({ type: "onCantidadClicked", payload: { item: 500 } })
                              }
                            >
                              <img src="/img/500.jpg" alt="500.00€" width="100" />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            )}
            <Grid item xs={12}>
              <Box display="flex" alignItems="flex-end" justifyContent="flex-end" height={1}>
                <Button id="cancelarPago" color="secondary" text={<Icon>close</Icon>}>
                  Cancelar
                </Button>
                {pagosBuffer.formaPago !== null && (
                  <Button
                    id="confirmarPago"
                    color="primary"
                    text={<Icon>done</Icon>}
                    disabled={
                      entregado === 0 ||
                      (pagosBuffer.formaPago === "TARJ" && entregado > ventasBuffer.pendiente)
                    }
                  >
                    Confirmar
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </Quimera.Template>
  );
}

export default VentasPagos;
