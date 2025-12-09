import { Box, Button, Grid, ListInfiniteScroll, Typography } from "@quimera/comps";
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import React from "react";

function puedeFirmar(albaran, puestoLocal) {
  console.log("--------------", albaran);
  console.log(albaran.estadoFirma != "En espera" && albaran.puestoFirma != puestoLocal);
  if (!albaran.puestoFirma) {
    return true;
  }
  if (albaran.puestoFirma != puestoLocal) {
    return true;
  }
  if (albaran.estadoFirma != "En espera") {
    return true;
  }

  return false;
}

function ListadoMobile({ useStyles }) {
  const [{ albaranesPuesto, puestoLocal }, dispatch] = useStateValue();
  const classes = useStyles();
  console.log("ListadoMobile", albaranesPuesto);
  const albaranesPuestoList = Object.values(albaranesPuesto?.dict ?? {});
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);

  return (
    <Quimera.Template id="ListadoMobile">
      <List id="albaranesPuestoList">
        <ListInfiniteScroll
          data={albaranesPuestoList}
          next={() => dispatch({ type: "onNextAlbaranes" })}
          hasMore={albaranesPuesto?.page?.next !== null}
          scrollableTarget=""
        >
          {albaranesPuestoList.map(albaran => (
            <ListItem key={albaran.idAlbaran} divider={true}>
              <ListItemAvatar>
                <Avatar>{albaran.nombreCliente.substring(0, 1).toUpperCase()}</Avatar>
              </ListItemAvatar>
              <ListItemText
                disableTypography
                primary={
                  <Grid xs={12} sm container item>
                    <Grid item xs={8}>
                      <Typography component="div" variant="body1">
                        <strong>{`${albaran.codigo}`}</strong>
                        {` ${util.formatDate(albaran.fecha)}`}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      {!albaran.firmado ? (
                        <Button
                          id="firmarAlbaran"
                          data={{ albaran }}
                          color="secondary"
                          variant="contained"
                          text={!albaran.firmado ? "Firmar" : "Firmado"}
                          disabled={puedeFirmar(albaran, puestoLocal)}
                          className={classes.botonPrimario}
                        />
                      ) : (
                        <Box display={"flex"} flexDirection={"column"} justifyContent={"flex-end"}>
                          {mobile && (
                            <Typography
                              component="span"
                              variant="body2"
                              align="right"
                            >{`Firmado por: `}</Typography>
                          )}
                          <Typography component="span" variant="body2" align="right">
                            {`${mobile ? "" : "Firmado por: "}`}
                            <strong>{`${albaran.firmadoPor}`}</strong>
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                }
                secondary={
                  <Grid item xs={12} sm container>
                    <Grid item xs={8} sm container>
                      <Grid item xs={12}>
                        <Typography
                          component="span"
                          variant="body2"
                        >{`${albaran.nombreCliente}`}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          component="span"
                          variant="body2"
                        >{`${albaran.direccion}`}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography component="span" variant="body2">
                          {albaran.codpostal ? `${albaran.codpostal}` : " "} {` ${albaran.ciudad}`}{" "}
                          {` ${albaran.provincia}`}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                }
              ></ListItemText>
            </ListItem>
          ))}
        </ListInfiniteScroll>
      </List>
    </Quimera.Template>
  );
}

export default ListadoMobile;
