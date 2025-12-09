import { Box, Button, Field, Grid, Icon, QListItemModel, QSection } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { ListItemText, Typography } from "@quimera/thirdparty";
import { getSchemas, useStateValue, useWidth } from "quimera";
import React, { useState } from "react";

const useStyles = makeStyles(theme => ({
  card: {
    borderTop: `2px solid ${theme.palette.grey[200]}`,
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    marginBottom: 4,
    display: "flex",
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
  avatar: {
    color: theme.palette.info.main,
  },
  neutro: {
    backgroundColor: "inherit",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  desactivada: {
    backgroundColor: theme.palette.success.light,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  activada: {
    backgroundColor: theme.palette.success.light,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

function cajaCantidad(titulo, cantidad) {
  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between" mr={1}>
      <Typography component="span" variant="body2" color="textPrimary">
        {titulo}
      </Typography>
      <Typography component="span" variant="h5" color="textPrimary">
        {cantidad}
      </Typography>
    </Box>
  );
}

function ListItemLineaPedido({ model, modelName, selected = false, funSecondaryLeft, tareaIntermedia = false, ...props }) {
  const [_, dispatch] = useStateValue();
  const classes = useStyles();
  const linea = model;
  const editable = true;
  const schema = getSchemas().misLineasPedido;
  const [miCantAEnviar, setMiCantAEnviar] = useState(linea.cantAEnviar);
  const [validation, setValidation] = useState({ error: false, helperText: "" });
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);

  const cantPendiente = linea.canProgramada - linea.canServida;
  const cantLista = linea.canDisponible - linea.canServida;
  // const cantAEnviar = cantPendiente - cantLista;

  const estiloAEnviar = {
    box: {
      activada: classes.activada,
      desactivada: classes.desactivada,
      inhabilitada: classes.desactivada,
    },
  };

  // console.log("mimensaje_linea", linea);

  const cambiaCantidadEnviar = event => {
    setMiCantAEnviar(event.floatValue || 0);
    event.floatValue >= 0
      ? event.floatValue <= Math.min(cantPendiente, cantLista)
        ? setValidation({ error: false, helperText: "" })
        : setValidation({
          error: true,
          helperText: `La cantidad a enviar no puede ser mayor de ${Math.min(
            cantPendiente,
            cantLista,
          )}`,
        })
      : setValidation({ error: true, helperText: "La cantidad a enviar no puede ser menor a 0" });
  };

  const cambiaLinea = (desactivar, cambiar) => {
    cambiar &&
      dispatch({
        type: `onLineaChanged`,
        payload: { index: linea.idLinea, field: "cantAEnviar", value: miCantAEnviar },
      });
    desactivar && desactivar();
    !cambiar && setMiCantAEnviar(linea.cantAEnviar);
  };

  const onKeyPressed = (event, desactivar) => {
    if (event.key === "Enter" && !validation.error) {
      cambiaLinea(desactivar, true);
    }
  };

  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      {/* <ListItemAvatar>
        <Icon color="primary" fontSize="large" className={classes.avatar}>
          radio_button_unchecked
        </Icon>
      </ListItemAvatar> */}
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Typography variant="h6">{`${linea.descripcion}(${linea.referencia})`}</Typography>
          </Box>
        }
        secondary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Grid container>
              <Grid
                item
                xs={mobile ? 12 : 8}
                container
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                {cajaCantidad("Pedida", linea.canProgramada)}
                {cajaCantidad("Servida", linea.canServida)}
                {cajaCantidad("Pendiente", cantPendiente)}
                {cajaCantidad("Fabricada", linea.canDisponible)}
                {cajaCantidad("Lista para servir", cantLista)}
              </Grid>
              <Grid item xs={mobile ? 12 : 4}>
                <QSection
                  title="A enviar"
                  alwaysInactive={!editable}
                  ml={1}
                  estilos={estiloAEnviar}
                  dynamicComp={desactivar => (
                    <Grid container alignItems="center" justifyContent="center">
                      <Box>
                        <Field.Float
                          id="cantidad"
                          value={miCantAEnviar}
                          onChange={cambiaCantidadEnviar}
                          error={validation.error}
                          helperText={validation.helperText}
                          onClick={event => event.target.select()}
                          onKeyPress={event => onKeyPressed(event, desactivar)}
                        />
                      </Box>
                      <Box item xs={12}>
                        <Button
                          id="cancelar"
                          variant="text"
                          color="secondary"
                          text={"cancelar"}
                          onClick={() => cambiaLinea(desactivar, false)}
                          startIcon={<Icon>close</Icon>}
                        />
                        <Button
                          id="guardar"
                          variant="text"
                          color="primary"
                          text={"guardar"}
                          onClick={() => cambiaLinea(desactivar, true)}
                          startIcon={<Icon>save_alt</Icon>}
                          // disabled={miCantAEnviar > linea.cantAEnviar}
                          disabled={validation.error}
                        />
                      </Box>
                    </Grid>
                  )}
                  cancel={{
                    display: "none",
                  }}
                  save={{
                    display: "none",
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent={"flex-end"}>
                    <Typography variant="h5">{linea.cantAEnviar}</Typography>
                  </Box>
                </QSection>
              </Grid>
            </Grid>
          </Box>
        }
      />
    </QListItemModel>
  );
}

export default ListItemLineaPedido;
