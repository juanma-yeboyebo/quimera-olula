import {
  Box,
  Container,
  Icon,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Tab,
  TabWidget,
  Typography,
} from "@quimera/comps";
import { List } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, util } from "quimera";
import React, { useEffect } from "react";

function ColaCosido({ useStyles }) {
  const [{ colaCosido, historialCosido }, dispatch] = useStateValue();
  const classes = useStyles();

  useEffect(() => {
    dispatch({ type: "onInit" });
  }, [dispatch]);

  useEffect(() => {
    util.getSetting("appDispatch")({
      type: "setNombrePaginaActual",
      payload: { nombre: "Cola Cosido" },
    });

    return () =>
      util.getSetting("appDispatch")({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [dispatch]);

  return (
    <Quimera.Template id="ColaCosido">
      <Container maxWidth="md" className={classes.container}>
        <Box className={classes.counter} display="flex" width={1} justifyContent="flex-end">
          <strong>Tareas de cosido pendientes: {colaCosido.length}</strong>
        </Box>
        <br />
        <TabWidget tabPanelProps={{ mobile: true }}>
          <Tab title="Cola">
            <Paper>
              <List>
                {colaCosido.map(unidadp => (
                  <ListItem key={unidadp.idunidad} divider={true} className={classes.element}>
                    <ListItemText
                      primary={
                        <Typography>
                          <strong>{unidadp.idunidad}</strong>
                        </Typography>
                      }
                      secondary={
                        <span>
                          <Typography component={"span"}>
                            <strong>{`MODELO ${unidadp.modelo} - TELA ${unidadp.idtela}`}</strong>
                            <br />
                            {util.formatDate(unidadp.fechasalida)}
                          </Typography>
                        </span>
                      }
                    ></ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton
                        id="confirmar"
                        edge="end"
                        aria-label="finalizar"
                        onClick={() =>
                          dispatch({
                            type: "onConfirmarCosido",
                            payload: { idunidad: unidadp.idunidad },
                          })
                        }
                      >
                        <Icon>done</Icon>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  ))}
              </List>
            </Paper>
          </Tab>
          <Tab title="Historial">
            <Paper>
              <List>
                {historialCosido.map(unidadp => (
                  <ListItem key={unidadp.idunidad} divider={true} className={classes.element}>
                    <ListItemText
                      primary={
                        <Typography>
                          <strong>{unidadp.idunidad}</strong>
                        </Typography>
                      }
                      secondary={
                        <span>
                          <Typography component={"span"}>
                            <strong>{`MODELO ${unidadp.modelo} - TELA ${unidadp.idtela}`}</strong>
                            <br />
                            {util.formatDate(unidadp.fechasalida)}
                          </Typography>
                        </span>
                      }
                    ></ListItemText>
                    <ListItemSecondaryAction>
                      <IconButton
                        id="deshacer"
                        edge="end"
                        aria-label="deshacer"
                        onClick={() =>
                          dispatch({
                            type: "onDeshacerCosido",
                            payload: { idunidad: unidadp.idunidad },
                          })
                        }
                      >
                        <Icon>undo</Icon>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Tab>
        </TabWidget>
      </Container>
    </Quimera.Template>
  );
}

export default ColaCosido;
