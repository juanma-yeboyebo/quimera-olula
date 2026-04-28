import { Avatar, Box, Button, Field, Grid } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import {
  CircularProgress,
  Collapse,
  Icon,
  IconButton,
  LinearProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@quimera/thirdparty";
import { useStateValue } from "quimera";
import React, { useState } from "react";

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: `${theme.palette.warning.main} !important`,
  },
  card: {
    // borderTop: `2px solid ${theme.palette.background.default}`,
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  // cardSelected: {
  //   borderBottom: `2px solid ${theme.palette.secondary.main}`,
  //   borderTop: `2px solid ${theme.palette.secondary.main}`
  // }
  positivo: {
    color: "green",
    fontWeight: "500",
  },
  negativo: {
    color: "red",
    fontWeight: "500",
  },
}));

// function ListItemLineaHistoricoPedido({ linea, selected = false, funPrimaryLeft, funPrimaryRight, hideSecondary = false, ...props }) {
function ListItemLineaHistoricoPedido({
  linea,
  selected = false,
  funPrimaryLeft,
  funPrimaryRight,
  hideSecondary = false,
  ...props
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [cantidad, setCantidad] = useState(0);
  const [validation, setValidation] = useState({ error: false, helperText: "" });
  const disabled = props.disabled ?? false;
  const [{ anadiendoDesdeHistorico }, dispatch] = useStateValue();

  const setValorCantidad = c => {
    c > 0 ? setCantidad(c) : setCantidad(0);
  };

  const handleToggleOpenClicked = () => {
    setOpen(!open);
  };
  const handleChangeCantidad = e => {
    setValorCantidad(e.floatValue);
  };

  const handleSumaClicked = c => {
    const multiplo = linea.multiplo ?? 1;
    setValorCantidad(cantidad + c * multiplo);
  };

  // console.log("cantidad HISTORICO", cantidad, linea.multiplo, validation);

  linea.multiplo && cantidad % linea.multiplo !== 0
    ? !validation.error &&
    setValidation({
      error: true,
      helperText: `La cantidad debe ser múltiplo de ${linea.multiplo}`,
    })
    : validation.error && setValidation({ error: false, helperText: "" });

  return (
    <ListItem className={classes.card} {...props} disableGutters>
      <Box display="flex" flexDirection="column" width={1}>
        {linea._status === "creating_line" && (
          <Box width={1}>
            <Typography variant="body2">Creando línea...</Typography>
            <LinearProgress />
          </Box>
        )}
        <Collapse in={!["creating_line", "deleted"].includes(linea._status)}>
          <Box display="flex">
            <ListItemAvatar>
              <Avatar className={classes.avatar}>H</Avatar>
            </ListItemAvatar>
            <ListItemText
              disableTypography
              primary={
                <Box width={1} display="flex" justifyContent="space-between">
                  <Box display="inline">
                    {funPrimaryLeft ? funPrimaryLeft(linea) : `${linea.descripcion}`}
                  </Box>
                  <Box display="inline">
                    <Typography component="span" variant="body2">
                      Stock disponible:{" "}
                    </Typography>
                    <Typography
                      className={linea.disponible < cantidad ? classes.negativo : classes.positivo}
                      component="span"
                      variant="body1"
                    >{`${linea.disponible}`}</Typography>
                  </Box>
                </Box>
              }
              secondary={
                !hideSecondary && (
                  <Box width={1} display="flex" justifyContent="space-between">
                    <Box display="inline">
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >{`${linea.fecha}. Ref ${linea.referencia}`}</Typography>
                    </Box>
                  </Box>
                )
              }
            />
            {!disabled && (
              <IconButton id="toggleOpen" onClick={handleToggleOpenClicked}>
                <Icon fontSize="large">{open ? "expand_less" : "expand_more"}</Icon>
              </IconButton>
            )}
          </Box>
          <Collapse in={open}>
            <Box display="flex" justifyContent="space-around" alignItems="flex-end">
              <Box display="flex" alignItems="flex-end" maxWidth={300}>
                <IconButton id="resta" onClick={() => handleSumaClicked(-1)}>
                  <Icon fontSize="large" color="secondary">
                    remove_circle_outline
                  </Icon>
                </IconButton>
                <Field.Float
                  id="cantidad"
                  value={cantidad}
                  autoFocus
                  onChange={handleChangeCantidad}
                  onFocus={event => event.target.select()}
                  label={linea.multiplo ? `Cantidad (MÚLTIPLO DE ${linea.multiplo})` : "Cantidad"}
                  error={validation.error}
                  helperText={validation.helperText}
                />
                <IconButton id="suma" onClick={() => handleSumaClicked(1)}>
                  <Icon fontSize="large" color="secondary">
                    add_circle_outline
                  </Icon>
                </IconButton>
              </Box>
              <Box>
                <Button
                  id="save"
                  variant="text"
                  color="primary"
                  startIcon={
                    !anadiendoDesdeHistorico ? (
                      <Icon>save_alt</Icon>
                    ) : (
                      <CircularProgress size={20} />
                    )
                  }
                  onClick={() =>
                    dispatch({
                      type: "onAnadirLineaDesdeHistoricoClicked",
                      payload: { referencia: linea.referencia, cantidad },
                    })
                  }
                  disabled={!cantidad || validation.error || anadiendoDesdeHistorico}
                >
                  Añadir producto
                </Button>
              </Box>
            </Box>
            {linea.disponible < cantidad && (
              <Grid container display="flex" justifyContent="space-between" alignItems="center" style={{ border: '1px solid red' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" width={1} >
                  <Typography
                    variant="body1"
                    color="secondary"
                  >{`Este artículo no tiene stock suficiente (${linea.disponible} < ${cantidad})`}</Typography>
                  <Button
                    id="calculaRecepciones"
                    variant="text"
                    color="secondary"
                    startIcon={<Icon>start</Icon>}
                    onClick={() =>
                      dispatch({
                        type: "onCalculaRecepcionesClicked",
                        payload: { referencia: linea.referencia, cantidad },
                      })
                    }
                  >
                    Mostrar próximas recepciones
                  </Button>
                </Box>
                {linea.recepciones && (
                  <Box display="flex" justifyContent="space-between" alignItems="center" width={1}>
                    {linea.recepciones?.length > 0 ? (
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Typography variant="body1" color="secondary">
                          Recepciones pendientes:
                        </Typography>
                        {linea.recepciones.map((recepcion, index) => (
                          <Typography key={index} variant="body1" color="secondary">
                            {`${recepcion.por_recibir} undidad${recepcion.por_recibir > 1 ? "es pedidas" : " pedida"
                              } el ${new Date(recepcion.fecha_pedido).toLocaleDateString(
                                "es-ES",
                              )}, fecha de recepción el ${new Date(
                                recepcion.fecha_recepcion,
                              ).toLocaleDateString("es-ES")}`}
                          </Typography>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body1" color="secondary">
                        No hay recepciones pendientes de este producto
                      </Typography>
                    )}
                  </Box>
                )}
              </Grid>
            )}
          </Collapse>
        </Collapse>
      </Box>
    </ListItem>
  );
}

const equalProps = (prev, next) => {
  const equal =
    prev?.linea.referencia === next?.linea.referencia &&
    prev?.linea.recepciones === next?.linea.recepciones;
  console.log("cantidad HISTORICOEQUAL", equal);

  return equal;
};
export default React.memo(ListItemLineaHistoricoPedido, equalProps);
