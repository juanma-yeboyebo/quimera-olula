// import { Grid, Button, Column, Field, Table, Dialog, DialogContent, IconButton, Icon, Typography } from '@quimera/comps'
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
  IconButton,
  Typography,
} from "@quimera/comps";
import {
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@quimera/thirdparty";
import Quimera, { navigate, useStateValue, util } from "quimera";
import { useEffect } from "react";

function OrdenesDeCarga({ useStyles }) {
  const [
    {
      albaranes,
      albaranesGenerados,
      abrirDialogoConfirmacion,
      cargandoAlbaranes,
      errorAlbaranes,
      dialogTitle,
      dialogMsg,
      idOrdenCarga,
      impresionDone,
      ordenescarga,
    },
    dispatch,
  ] = useStateValue();

  const classes = useStyles();

  useEffect(() => {
    dispatch({
      type: "init",
    });
  }, [dispatch]);

  return (
    <Quimera.Template id="OrdenesDeCarga">
      <Container maxWidth="md" className={classes.container}>
        <br />
        <br />
        <Typography variant="h6">Órdenes de carga</Typography>
        <List>
          {ordenescarga.map(ordencarga => (
            <ListItem
              key={ordencarga.idorden}
              divider={true}
              className={classes.element}
              onClick={() => navigate(`/ordenDeCargaDetalle/${ordencarga.idorden}`)}
            >
              <ListItemAvatar>
                <Avatar className={ordencarga.estado === "PTE" ? classes.yellow : classes.green}>
                  {ordencarga.partidas /* ordencarga.estado === 'PTE' ? 'P' : 'C' */}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography>
                    <strong>{util.formatDate(ordencarga.fecha)}</strong>
                    {` ${ordencarga.idorden}`}
                  </Typography>
                }
                secondary={
                  <span>
                    <Typography component={"span"}>{ordencarga.estado}</Typography> <br></br>
                    <Typography component={"span"}>
                      Camión:{" "}
                      <strong>
                        {` ${ordencarga.codcamion.length}` > 0
                          ? ordencarga.codcamion
                          : "No establecido"}
                      </strong>
                      &nbsp; Ruta:{" "}
                      <strong>
                        {ordencarga.codruta === null ? " No establecida" : ` ${ordencarga.codruta}`}
                      </strong>
                    </Typography>
                  </span>
                }
              ></ListItemText>
              {
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="finalizar"
                    onClick={() =>
                      dispatch({ type: "onTerminarClicked", payload: { data: ordencarga.idorden } })
                    }
                  >
                    <Icon>done</Icon>
                  </IconButton>
                </ListItemSecondaryAction>
              }
            </ListItem>
          ))}
        </List>
        {/* Son varios diálogos los que aparecen en el proceso. Van en orden de aparición */}
        <Dialog open={abrirDialogoConfirmacion} maxWidth="md">
          <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="form-dialog-description">{dialogMsg}</DialogContentText>
          </DialogContent>
          <DialogActions>
            {dialogTitle === "Aviso" ? (
              <Button id="ok" text="OK" />
            ) : (
              <div>
                <Button id="confirmarAlbaranes" text="Sí" />
                <Button id="cancelarAlbaranes" text="No" />
              </div>
            )}
          </DialogActions>
        </Dialog>
        <Dialog open={errorAlbaranes} maxWidth="md">
          <DialogTitle id="form-dialog-title">Error</DialogTitle>
          <DialogContent>
            <DialogContentText id="form-dialog-description">{dialogMsg}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button id="ok" text="OK" />
          </DialogActions>
        </Dialog>

        <Dialog open={cargandoAlbaranes} maxWidth="md">
          <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="form-dialog-description">{dialogMsg}</DialogContentText>
            <LinearProgress></LinearProgress>
          </DialogContent>
        </Dialog>

        <Dialog open={albaranesGenerados} maxWidth="md">
          <DialogTitle id="form-dialog-title"> {dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="form-dialog-description">{dialogMsg}</DialogContentText>
            <List>
              {albaranes.map(a => (
                <ListItem key={a.albaran.codalbaran}>
                  <ListItemText>
                    <Typography>
                      <strong>Albarán: </strong>
                      {a.albaran.codalbaran} &nbsp; <strong>Serie: </strong>
                      {a.albaran.codserie} &nbsp; <strong>Descuento </strong>
                      {a.albaran.descuento} &nbsp; <strong>Cliente: </strong>
                      {a.albaran.codcliente} - {a.albaran.nombre}
                    </Typography>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
            <DialogContentText id="form-dialog-question">
              Se procedera a imprimir los albaranes
            </DialogContentText>
            <DialogActions>
              <Button id="confirmarImpresion" text="OK" />
            </DialogActions>
          </DialogContent>
        </Dialog>

        <Dialog open={impresionDone} maxWidth="md">
          <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="form-dialog-description">{dialogMsg}</DialogContentText>
            <DialogActions>
              <Button id="terminarImpresion" text="OK" />
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Container>
    </Quimera.Template>
  );
}

export default OrdenesDeCarga;
