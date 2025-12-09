import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Box, Button, Field, Grid, Icon, QBox, QSection, Typography } from "@quimera/comps";
import { Tab, Tabs } from "@quimera/thirdparty";
import Quimera, { useStateValue, useWidth, util } from "quimera";

import schemas from "../../../static/schemas";

function ArqueosDetalle({ useStyles }) {
  const [{ indiceTab, arqueosBuffer }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  return (
    <Quimera.Template id="ArqueosDetalle">
      {arqueosBuffer && (
        <QBox
          width={anchoDetalle}
          titulo={`Arqueo ${arqueosBuffer.id}`}
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
        >
          <Box px={0} my={1}>
            <Box width={1} border={0} borderColor="gray" height={"calc(100%)"}>
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                      <Button
                        id="cerrarArqueo"
                        text="Cerrar"
                        color="primary"
                        variant="contained"
                        disabled={!schemas.arqueos.isValid(arqueosBuffer) || !arqueosBuffer.abierta}
                      />
                    </Box>

                    <Box display="flex" flexDirection="inline">
                      <QSection
                        title="Fecha Desde"
                        actionPrefix="arqueo"
                        alwaysInactive
                        dynamicComp={() => (
                          <Field.Schema
                            id="arqueosBuffer.diadesde"
                            schema={schemas.arqueos}
                            label=""
                            fullWidth
                            autoFocus
                            disabled
                          />
                        )}
                      >
                        <Box display="flex" alignItems="center">
                          <Icon color="action" fontSize="default" className={classes.leftIcon}>
                            event
                          </Icon>
                          <Typography variant="h5">
                            {util.formatDate(arqueosBuffer.diadesde)}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <AccessTimeIcon
                            color="action"
                            fontSize="default"
                            className={classes.leftIcon}
                          />
                          <Typography variant="h5">
                            {arqueosBuffer.horadesde ? arqueosBuffer.horadesde.slice(0, 5) : ""}
                          </Typography>
                        </Box>
                      </QSection>

                      {arqueosBuffer.diahasta && (
                        <QSection
                          title="Fecha Hasta"
                          actionPrefix="arqueo"
                          alwaysInactive
                          dynamicComp={() => (
                            <Field.Schema
                              id="arqueosBuffer.diahasta"
                              schema={schemas.arqueos}
                              label=""
                              fullWidth
                              autoFocus
                              disabled
                            />
                          )}
                        >
                          <Box display="flex" alignItems="center">
                            <Icon color="action" fontSize="default" className={classes.leftIcon}>
                              event
                            </Icon>
                            <Typography variant="h5">
                              {util.formatDate(arqueosBuffer.diahasta)}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center">
                            <AccessTimeIcon
                              color="action"
                              fontSize="default"
                              className={classes.leftIcon}
                            />
                            <Typography variant="h5">
                              {arqueosBuffer.horahasta ? arqueosBuffer.horahasta.slice(0, 5) : ""}
                            </Typography>
                          </Box>
                        </QSection>
                      )}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <QSection
                    title={`Agente Apertura ${arqueosBuffer.codtpv_agenteapertura ?? ""}`}
                    actionPrefix="arqueo"
                    alwaysInactive
                    dynamicComp={() => <Grid container></Grid>}
                    saveDisabled={() =>
                      !arqueosBuffer.codtpv_agenteapertura || !arqueosBuffer.ptoventa
                    }
                  >
                    <Typography variant="h5">{`Punto de Venta ${arqueosBuffer.ptoventa ?? "Sin punto venta"
                      }`}</Typography>
                  </QSection>
                </Grid>

                <Grid item xs={12}>
                  <QSection alwaysInactive>
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <Grid container spacing={0}>
                        <Grid item xs={4}>
                          <Typography>EN CAJA</Typography>
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-around"
                          >
                            <Typography>Efectivo &nbsp;</Typography>
                            <Field.Currency
                              id="arqueosBuffer.totalcaja"
                              disabled
                              className={classes.field}
                            />
                          </Box>
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-around"
                          >
                            <Typography>Tarjeta* &nbsp;</Typography>
                            <Field.Currency
                              id="arqueosBuffer.totaltarjeta"
                              className={classes.field}
                              disabled={!arqueosBuffer.abierta}
                            />
                          </Box>
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-around"
                          >
                            <Typography>Vales* &nbsp;</Typography>
                            <Field.Currency
                              id="arqueosBuffer.totalvale"
                              className={classes.field}
                              disabled={!arqueosBuffer.abierta}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>CALCULADO</Typography>
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-around"
                          >
                            <Typography>Efectivo &nbsp;</Typography>
                            <Field.Currency
                              value={arqueosBuffer.pagosefectivo + arqueosBuffer.inicio}
                              disabled
                              className={classes.field}
                            />
                          </Box>
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-around"
                          >
                            <Typography>Tarjeta &nbsp;</Typography>
                            <Field.Currency
                              id="arqueosBuffer.pagostarjeta"
                              disabled
                              className={classes.field}
                            />
                          </Box>
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-around"
                          >
                            <Typography>Vales &nbsp;</Typography>
                            <Field.Currency
                              id="arqueosBuffer.pagosvale"
                              disabled
                              className={classes.field}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>DIFERENCIA</Typography>
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-around"
                          >
                            <Typography>Efectivo &nbsp;</Typography>
                            <Field.Currency
                              id="arqueosBuffer.diferenciaefectivo"
                              disabled
                              className={classes.field}
                            />
                          </Box>
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-around"
                          >
                            <Typography>Tarjeta &nbsp;</Typography>
                            <Field.Currency
                              id="arqueosBuffer.diferenciatarjeta"
                              disabled
                              className={classes.field}
                            />
                          </Box>
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-around"
                          >
                            <Typography>Vales &nbsp;</Typography>
                            <Field.Currency
                              id="arqueosBuffer.diferenciavale"
                              disabled
                              className={classes.field}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </QSection>
                </Grid>
                <Grid item xs={12}>
                  <Box width={1} border={0} borderColor="gray" height={"calc(100%)"}>
                    <Tabs
                      value={indiceTab}
                      onChange={(event, newValue) =>
                        dispatch({ type: "onTabSelected", payload: { value: newValue } })
                      }
                      className={classes.tabs}
                    >
                      <Tab label="Caja" />
                      <Tab label="Pagos" />
                    </Tabs>
                    {indiceTab === 0 && (
                      <Box mt={1}>
                        <Quimera.SubView id="Arqueos/ArqueosCaja" />
                      </Box>
                    )}
                    {indiceTab === 1 && (
                      <Box mt={1}>
                        <Quimera.SubView id="Arqueos/ArqueosPagos" />
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </QBox>
      )}
    </Quimera.Template>
  );
}

export default ArqueosDetalle;
