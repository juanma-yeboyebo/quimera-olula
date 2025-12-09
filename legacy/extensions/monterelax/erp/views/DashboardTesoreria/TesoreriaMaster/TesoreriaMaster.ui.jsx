import { Backdrop, Box, CircularProgress, Grid, Icon, QBox, Typography } from "@quimera/comps";
import { List, ListItem, ListItemAvatar, ListItemText } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import React from "react";

function TesoreriaMaster({ useStyles }) {
  const [{ cargando, recibosOrdenados }, dispatch] = useStateValue();
  const classes = useStyles();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const desktop = !mobile;

  return (
    <Quimera.Template id="TesoreriaMaster">
      <Box width={anchoDetalle} mx={desktop ? 1 : 0}>
        <Backdrop open={cargando} style={{ zIndex: 999 }}>
          Cargando&nbsp;
          <CircularProgress color="inherit" />
        </Backdrop>
        <QBox titulo="Movimientos">
          <Quimera.SubView id="DashboardTesoreria/DashboardFiltro" />
          <List>
            {recibosOrdenados.map(recibo => (
              <ListItem
                key={recibo.fechav}
                divider={true}
                className={classes.element}
                onClick={() =>
                  dispatch({ type: "onRecibosClicked", payload: { item: recibo.fechav } })
                }
              >
                <ListItemAvatar>
                  {recibo.importerecibo >= 0 ? (
                    <Icon className={classes.flechaArriba}>arrow_upward</Icon>
                  ) : (
                    <Icon className={classes.flechaAbajo}>arrow_downward</Icon>
                  )}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Grid container display="flex" alignItems="center">
                      <Grid item xs={2}>
                        <Box display="flex" justifyContent="flex-start">
                          <Typography>
                            <strong>{util.formatDate(recibo.fechav)}</strong>
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={10}>
                        <Box
                          display="flex"
                          alignItems="flex-end"
                          justifyContent="flex-end"
                          height={1}
                        >
                          <Grid
                            container
                            display="flex"
                            alignItems="center"
                            justifycontent="flex-end"
                          >
                            <Grid item xs={12} md={8}>
                              <Box
                                display="flex"
                                justifyContent="flex-end"
                                className={recibo.importerecibo >= 0 ? classes.verde : classes.rojo}
                              >
                                {util.euros(recibo.importerecibo)}
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Box
                                display="flex"
                                justifyContent="flex-end"
                                className={classes.gris}
                              >
                                {util.euros(recibo.saldo)}
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  }
                ></ListItemText>
              </ListItem>
            ))}
          </List>
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default TesoreriaMaster;
