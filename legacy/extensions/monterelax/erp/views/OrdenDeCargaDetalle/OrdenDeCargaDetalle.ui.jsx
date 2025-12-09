import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Field,
  Icon,
  IconButton,
  QBox,
  Typography,
} from "@quimera/comps";
import {
  AppBar,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from "@quimera/thirdparty";
import Quimera, { useAppValue, useStateValue } from "quimera";
import { useEffect } from "react";

function OrdenDeCargaDetalle({ idOrdenDeCarga, useStyles }) {
  const [{ abrirDialogo, unidadesProducto, progreso }, dispatch] =
    useStateValue();
  const [, appDispatch] = useAppValue();
  const classes = useStyles();

  useEffect(() => {
    appDispatch({
      type: "setNombrePaginaActual",
      payload: { nombre: `Cargar orden ${idOrdenDeCarga}` },
    });

    return () => appDispatch({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [idOrdenDeCarga, appDispatch]);

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: { idOrdenDeCarga },
    });
  }, [idOrdenDeCarga, dispatch]);

  return (
    <Quimera.Template id="OrdenDeCargaDetalle">
      <QBox>
        <Container className={classes.container}>
          <AppBar position="sticky" className={classes.appBar}>
            <Box className={classes.tituloBox}>
              <Typography variant="h5">{`Orden ${idOrdenDeCarga}`}</Typography>
              <Typography variant="h6">{`${progreso.cargadas}/${progreso.total}`}</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progreso.total !== 0 ? (100 * progreso.cargadas) / progreso.total : 0}
              classes={{
                root: classes.barraProgreso,
                determinate: classes.barraProgresoTotal,
                bar1Determinate: classes.barraProgresoCargadas,
              }}
            />
            <Box className={classes.searchBox}>
              <Field.Text
                naked
                id="uP"
                autoFocus
                placeholder="Unidad de Producto"
                variant="outlined"
                fullWidth
                className={classes.textField}
                startAdornment={"Hello"}
                onKeyPress={event =>
                  event.key === "Enter" &&
                  dispatch({ type: "onEnterPressed", payload: { value: event.target.value } })
                }
              />
              <Button id="terminar" text="Cargar todo" variant="contained" color="primary" />
            </Box>
          </AppBar>
          <List>
            {unidadesProducto.map(up => (
              <ListItem key={up.idunidad} divider={true}>
                <ListItemText
                  primary={
                    <Typography>
                      <strong>{up.idunidad}</strong>
                      {` ${up.modelo} ${up.configuracion}`}
                    </Typography>
                  }
                  secondary={up.telas}
                ></ListItemText>
                <ListItemSecondaryAction>
                  <IconButton
                    id={up.idunidad}
                    edge="end"
                    aria-label="Cargar"
                    onClick={() =>
                      dispatch({ type: "onEnterPressed", payload: { value: up.idunidad } })
                    }
                  >
                    {up.estado === "CARGADO" ? (
                      <Icon fontSize="large" className={classes.cargado}>
                        check_circle
                      </Icon>
                    ) : (
                      <Icon fontSize="large">check_circle_outline</Icon>
                    )}
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Container>
      </QBox>
      <Dialog open={abrirDialogo}>
        <DialogTitle id="form-dialog-title">
          {"¿Está seguro de terminar la orden de carga?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="form-dialog-description">
            Todas las unidades de producto se marcarán como cargadas
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id="confirmar" text="Sí" />
          <Button id="cancelar" text="No" />
        </DialogActions>
      </Dialog>
    </Quimera.Template>
  );
}

export default OrdenDeCargaDetalle;
