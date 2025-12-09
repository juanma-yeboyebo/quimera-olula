import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Field,
  Grid,
  Icon,
  QTitleBox,
  Typography,
} from "@quimera/comps";
import { List } from "@quimera/thirdparty";
import Quimera, { navigate, useStateValue, useWidth } from "quimera";

import { ListItemTramo } from "../../../comps";

function Tarea({ useStyles }) {
  const [
    {
      modalCantidadTramo,
      modalTerminarTarea,
      modalTareaTerminada,
      procesando,
      tarea,
      tramosTarea,
      utillajes,
      observaciones,
    },
    dispatch,
  ] = useStateValue();
  const classes = useStyles();
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const tareaIntermedia = tarea.tareaInicial && tarea.tareaFinal;

  const cuerpoEstado = {
    "PTE": {
      nombre: "Pendiente",
      textoicon: "Iniciar",
      textoprocesando: "Iniciando",
      icon: "play_arrow",
      color: "primary",
      action: "iniciarTarea",
    },
    "EN CURSO": {
      nombre: "En curso",
      textoicon: "Detener",
      textoprocesando: "Deteniendo",
      icon: "pause",
      color: "secondary",
      action: "dameCantidadTramo",
    },
    "EN PAUSA": {
      nombre: "En pausa",
      textoicon: "Reanudar",
      icon: "restart_alt",
      color: "primary",
      action: "iniciarTarea",
    },
    "TERMINADA": { nombre: "Terminada" },
  };

  return (
    <Quimera.Template id="Tarea">
      <Box mt={2}>
        <QTitleBox titulo="Descripción">
          <Typography variant="h5">{`${tarea.descripcion} (${tarea.idTarea})`}</Typography>
        </QTitleBox>
        <Grid container display={"flex"} justifyContent={"space-between"}>
          <Grid item xs={12} md={6}>
            <QTitleBox titulo="Orden de producción">
              <Box
                display={"flex"}
                justifyContent={mobile ? "space-between" : "flex-start"}
                style={{ gap: "10px" }}
              >
                <Typography variant="h5">{tarea.codOrden}</Typography>
                <Button
                  id="action"
                  color={"primary"}
                  variant="outlined"
                  text={"Ir a la orden"}
                  onClick={() =>
                    navigate(
                      `/tareas/tareasterminal/${tarea.idTarea}/ordenesprod/${tarea.codOrden}`,
                    )
                  }
                ></Button>
                {tarea.tareaFinal && (
                  <Button
                    id="action"
                    color={"primary"}
                    variant="outlined"
                    text={"Ir al pedido"}
                    onClick={() =>
                      navigate(
                        `/tareas/tareasterminal/${tarea.idTarea}/pedido/${tarea.codOrden}/${tarea.idPedido}`,
                      )
                    }
                  ></Button>
                )}
              </Box>
            </QTitleBox>
          </Grid>
          <Grid item xs={12} md={6} container justifyContent={mobile ? "flex-start" : "flex-end"}>
            <QTitleBox titulo="Cantidad programada">
              <Typography variant="h5" align={mobile ? "left" : "right"}>
                {tarea.canprogramada}
              </Typography>
            </QTitleBox>
          </Grid>
        </Grid>
        <QTitleBox titulo="Artículo">
          <Typography variant="h5">{`${tarea.articulo} (${tarea.referencia})`}</Typography>
        </QTitleBox>
        <QTitleBox titulo="Utillajes">
          {utillajes.length > 0 ? (
            utillajes?.map(utillaje => (
              <Box display={"flex"} alignItems={"center"}>
                <Icon fontSize="small" style={{ marginRight: "5px" }}>
                  build
                </Icon>
                <Typography variant="h5">{`${utillaje.tipo} (${utillaje.descripcion})`}</Typography>
              </Box>
            ))
          ) : (
            <Box display={"flex"} alignItems={"center"}>
              <Icon fontSize="small" style={{ marginRight: "5px" }}>
                build
              </Icon>
              <Typography variant="h5">Sin utillajes</Typography>
            </Box>
          )}
        </QTitleBox>
        {observaciones && (
          <QTitleBox titulo="Observaciones">
            <Box display={"flex"} alignItems={"center"}>
              <Icon fontSize="small" style={{ marginRight: "5px" }}>
                priority_high
              </Icon>
              <Typography variant="h5">{observaciones}</Typography>
            </Box>
          </QTitleBox>
        )}
      </Box>
      <Box display={"flex"} alignItems={"flex-end"} justifyContent={"space-between"}>
        <Box mt={2}>
          <QTitleBox titulo="Estado de tarea">
            <Typography variant="h5">{cuerpoEstado[tarea.estado].nombre}</Typography>
          </QTitleBox>
        </Box>

        {tarea.estado !== "TERMINADA" && (
          <Box my={1}>
            <Button
              id="action"
              color={cuerpoEstado[tarea.estado].color}
              variant="contained"
              text={
                procesando ? (
                  <CircularProgress color="white" size={25} />
                ) : (
                  <Icon>{cuerpoEstado[tarea.estado].icon}</Icon>
                )
              }
              onClick={() => dispatch({ type: cuerpoEstado[tarea.estado].action })}
              disabled={procesando}
            >
              <Typography variant="h6" style={{ marginLeft: 8 }}>
                {cuerpoEstado[tarea.estado][procesando ? "textoprocesando" : "textoicon"]}
              </Typography>
            </Button>
          </Box>
        )}
      </Box>

      <Box my={2}>
        <Button
          id="action"
          color={"primary"}
          variant="outlined"
          text={"Buscar Tarea"}
          onClick={() => navigate(`/tareas/tareasterminal`)}
        ></Button>
      </Box>

      {tramosTarea && tramosTarea.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="overline">Tramos:</Typography>
          <List>
            {tramosTarea?.map(tramo => (
              <ListItemTramo
                key={tramo.id}
                divider
                linea={tramo}
                tareaIntermedia={tareaIntermedia}
              />
            ))}
          </List>
        </Grid>
      )}

      <Dialog open={modalCantidadTramo}>
        <DialogTitle id="form-dialog-title">Detener tarea</DialogTitle>
        <DialogContent>
          <DialogContentText id="form-dialog-description">
            Introduzca la cantidad de tramo
          </DialogContentText>
          <Field.Int
            autoFocus
            id={`cantidadNuevoTramo`}
            field="cantidadNuevoTramo"
            autoComplete="off"
            onClick={event => event.target.select()}
          />
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent="space-between">
            <Button
              id="cancelar"
              text="Cancelar"
              variant="text"
              color="secondary"
              onClick={() => dispatch({ type: "cancelarDetenerTarea" })}
            />
            <Button
              id="confirmar"
              text="Ok"
              variant="text"
              color="primary"
              onClick={() => dispatch({ type: "confirmarDetenerTarea" })}
            />
          </Grid>
        </DialogActions>
      </Dialog>

      <Dialog open={modalTerminarTarea}>
        <DialogTitle id="form-dialog-title">¿Desea terminar la tarea?</DialogTitle>
        <DialogActions>
          <Grid container justifyContent="space-between">
            <Button
              id="no"
              text="No"
              variant="text"
              color="secondary"
              onClick={() => dispatch({ type: "pausarTarea" })}
            />
            <Button
              id="si"
              text="Sí"
              variant="text"
              color="primary"
              onClick={() => dispatch({ type: "terminarTarea" })}
            />
          </Grid>
        </DialogActions>
      </Dialog>
    </Quimera.Template>
  );
}

export default Tarea;
