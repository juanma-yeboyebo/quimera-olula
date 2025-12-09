import {
  Avatar,
  Box,
  Button,
  Container,
  DynamicFilter,
  Field,
  Icon,
  IconButton,
  ListInfiniteScroll,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
} from "@quimera/comps";
import { List } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, util } from "quimera";
import React, { useEffect } from "react";
import { Cosedor } from "../../comps"

function RecepcionCosido({ useStyles }) {
  const [{ recepcionCosido, count }, dispatch] = useStateValue();
  const classes = useStyles();

  useEffect(() => {
    dispatch({ type: "onInit" });
  }, [dispatch]);

  useEffect(() => {
    util.getSetting("appDispatch")({
      type: "setNombrePaginaActual",
      payload: { nombre: "Recepción de Cosido" },
    });

    return () =>
      util.getSetting("appDispatch")({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [dispatch]);

  return (
    <Quimera.Template id="RecepcionCosido">
      <Container maxWidth="md" className={classes.container}>
        <Box className={classes.counter} display="flex" width={1} justifyContent="flex-end">
          <strong>Tareas de cosido mostradas: {recepcionCosido.length}</strong>
        </Box>
        {/* <Box>
          <Field.Text
            id="filtro.idunidad"
            label="UP"
            fullWidth
            async
          />
        </Box> */}
        <Box>
          <Cosedor
            id="filtro.cosedor"
            label="Cosedor"
            fullWidth
            async
          />
        </Box>
        {/* <DynamicFilter id="recepcionCosido.filter" propiedades={filtroProps}
        propiedades={[
          {
            tipoCampo: "apiselect",
            nombreCampo: "idtrabajador",
            labelNombre: "Cosedor",
            labelChip: "Cosedor: ",
            porDefecto: false,
            value: { key: "", value: "" },
            tablaAPI: "pr_trabajadores",
            selectAPI: "idtrabajador,nombre",
            buscarPor: "nombre",
            tipo: "normal",
          }
        },
        {
          tipoCampo: "apiselect",
          nombreCampo: "idunidad",
          labelNombre: "UP",
          labelChip: "Unidad: ",
          porDefecto: false,
          value: { key: "", value: "" },
          tablaAPI: "pr_unidadesproducto",
          selectAPI: "idunidad",
          buscarPor: "idunidad",
          tipo: "normal",
        },
        {
          tipoCampo: "boolean",
          nombreCampo: "mx_confirmarcosido",
          labelNombre: "Conf. Cosido",
          labelChip: "Conf. Cosido: ",
          porDefecto: false,
          value: false,
          tipo: "normal",
        },

        {
          tipoCampo: "date",
          nombreCampo: "fechasalida",
          labelNombre: "F. Salida",
          labelChip: "F. Salida: ",
          porDefecto: false,
          textoDesde: "desde",
          textoHasta: "hasta",
          value: { desde: null, hasta: null, fecha: null },
          opcionesPredefinidas: [
            { nombre: "", fecha: null, desde: null, hasta: null },
            { nombre: "Hoy", persistencia: "hoy" },
            { nombre: "Ayer", persistencia: "ayer" },
            { nombre: "Esta semana", persistencia: "estasemana" },
            { nombre: "Hasta ayer", persistencia: "hastaayer" },
            { nombre: "Este mes", persistencia: "estemes" },
            { nombre: "Este año", persistencia: "esteanyio" },
          ],
          tipo: "normal",
        },
        ]}
        /> */}

        <Paper className={classes.lista}>
          <List>
            {recepcionCosido.map(unidadp => (
              <ListItem
                key={unidadp.idunidad}
                divider={true}
              //className={unidadp.cosido ? classes.cosido : null}
              >
                <ListItemAvatar>
                  <Avatar className={unidadp.cosido ? classes.cosido : null} size="40px">
                    <Icon></Icon>
                  </Avatar>
                </ListItemAvatar>
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
                        {`Cosedor ${unidadp.cosedor} - ${util.formatDate(unidadp.fechasalida)}`}
                      </Typography>
                    </span>
                  }
                ></ListItemText>
                <ListItemSecondaryAction>
                  <IconButton
                    id="finalizar"
                    edge="end"
                    aria-label="finalizar"
                    onClick={() =>
                      dispatch({
                        type: "onTerminarTarea",
                        payload: { idunidad: unidadp.idunidad, cosido: unidadp.cosido },
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
      </Container>
    </Quimera.Template>
  );
}

export default RecepcionCosido;
