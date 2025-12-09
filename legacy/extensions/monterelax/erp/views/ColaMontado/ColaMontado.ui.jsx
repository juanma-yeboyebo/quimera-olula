import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Tab,
  TabWidget,
  Typography,
} from "@quimera/comps";
import {
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, util } from "quimera";
import React, { useEffect } from "react";

function ColaMontado({ useStyles }) {
  const [{ cargandoDatos, montadas, unidades }, dispatch] = useStateValue();
  const classes = useStyles();

  useEffect(() => {
    dispatch({ type: "onInit" });
  }, [dispatch]);

  useEffect(() => {
    util.getSetting("appDispatch")({
      type: "setNombrePaginaActual",
      payload: { nombre: "Cola Montado" },
    });

    return () =>
      util.getSetting("appDispatch")({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [dispatch]);

  return (
    <Quimera.Template id="ColaMontado">
      <Backdrop open={cargandoDatos} style={{ zIndex: 999 }}>
        Cargando Datos&nbsp;&nbsp;
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container maxWidth="md" className={classes.container}>
        <br />
        <TabWidget tabPanelProps={{ mobile: true }}>
          <Tab title={`Cola - (${unidades.length} pendientes)`}>
            <List>
              {unidades.map((u) => (
                <ListItem key={u.idunidad} divider={true} className={classes.element}>
                  <ListItemText
                    primary={
                      <Box display="flex">
                        <Box flexGrow={1}>
                          <Typography>
                            <strong>{u.idunidad}</strong>{" "}
                            {`Modelo: ${u.modelo} Conf: ${u.configuracion} Tela: ${u.idtela}`}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box display="flex">
                        <Box flexGrow={1}>
                          <Typography>
                            {`F. Prevista: ${util.formatDate(u.fechaprevista)}`}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  {
                    <ListItemSecondaryAction>
                      <IconButton
                        id="terminar"
                        title="Terminar"
                        edge="end"
                        onClick={() =>
                          dispatch({ type: "onTerminarMontado", payload: { idunidad: u.idunidad } })
                        }
                      >
                        <Icon>done</Icon>
                      </IconButton>
                    </ListItemSecondaryAction>
                  }
                </ListItem>
              ))}
            </List>
          </Tab>
          <Tab title="Historial">
            <List>
              {montadas.map((m) => (
                <ListItem key={m.idunidad} divider={true} className={classes.element}>
                  <ListItemText
                    primary={
                      <Box display="flex">
                        <Box flexGrow={1}>
                          <Typography>
                            <strong>{m.idunidad}</strong>{" "}
                            {`Modelo: ${m.modelo} Conf: ${m.configuracion} Tela: ${m.idtela}`}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box display="flex">
                        <Box flexGrow={1}>
                          <Typography>
                            {`F. Prevista: ${util.formatDate(m.fechaprevista)}`}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                  {
                    <ListItemSecondaryAction>
                      <IconButton
                        title="Deshacer"
                        edge="end"
                        onClick={() =>
                          dispatch({ type: "onDeshacerMontado", payload: { idunidad: m.idunidad } })
                        }
                      >
                        <Icon>undo</Icon>
                      </IconButton>
                    </ListItemSecondaryAction>
                  }
                </ListItem>
              ))}
            </List>
          </Tab>
        </TabWidget>
      </Container>
    </Quimera.Template>
  );
}

export default ColaMontado;
