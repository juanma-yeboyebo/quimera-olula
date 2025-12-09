import { Box, QBoxButton } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import {
  Collapse,
  Icon,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from "@quimera/thirdparty";
import Quimera, { useWidth } from "quimera";
import React, { useState } from "react";

const useStyles = makeStyles(theme => ({
  card: { borderBottom: `1px solid ${theme.palette.grey[400]}` },
  cLink: { color: "#4478DE" },
  cPrimary: { color: "#2D95C1" },
  cSuccess: { color: "#449D44" },
  cWarning: { color: "#EC971F" },
  cInfo: { color: "yellow" },
  cDanger: { color: "#D32F2F" },
  cNone: { color: "lightgrey" },
  cLinkPointer: { ...theme.hoverPointer, color: "#4478DE" },
  cPrimaryPointer: { ...theme.hoverPointer, color: "#2D95C1" },
  cSuccessPointer: { ...theme.hoverPointer, color: "#449D44" },
  cWarningPointer: { ...theme.hoverPointer, color: "#EC971F" },
  cInfoPointer: { ...theme.hoverPointer, color: "yellow" },
  cDangerPointer: { ...theme.hoverPointer, color: "#D32F2F" },
  cNonePointer: { ...theme.hoverPointer, color: "lightgrey" },
}));

function dameColorLinea(linea) {
  let colorLinea = "cNone";
  const total = linea.totalEnAlbaran;
  const shcant = linea.shCantAlbaran;
  const cantidad = linea.cantidad;
  const pda = linea.estadoPDA;
  if (linea.estadoPDA == "Preparado") {
    colorLinea = "cLink";
  } else if (linea.cerradaPDA) {
    colorLinea = "cPrimary";
  } else if ((total + shcant) === cantidad) {
    colorLinea = "cSuccess";
  } else if ((total + shcant) > 0 && (total + shcant) < cantidad) {
    colorLinea = "cWarning";
  } else if ((total + shcant) > cantidad) {
    colorLinea = "cInfo";
  }

  if (linea.porLotes) {
    colorLinea += "Pointer";
  }

  return colorLinea;
}
function ListItemPedidoVenta({ disabled, dispatch, linea, modalLotesAlmacenVisible, hideSecondary = false, callbackFocus, callbackCambiada, selected = false, ...props }) {
  const classes = useStyles();
  const width = useWidth();
  const [open, setOpen] = useState(false);
  const claseLinea = dameColorLinea(linea);

  const handleChangeLinea = e => {
    callbackCambiada();
    callbackFocus();
  };

  const handleToggleOpenClicked = () => {
    setOpen(!open);
    open && callbackFocus();
  };

  const Pte = parseFloat(linea.cantidad) - parseFloat(linea.canServida);

  const IconoLock = linea.cerradaPDA ? "lock_open" : "lock";
  const dispLote = linea.dispLotesAlmacen ? linea.dispLotesAlmacen.toFixed(2) : 0;

  return (
    <ListItem className={classes.card} {...props} disableGutters>
      <Box display="flex" flexDirection="column" width={1}>
        <Collapse in={!["creating_line", "deleted"].includes(linea._status)}>
          <Box display="flex" alignItems={"center"}>
            <Tooltip
              title={linea.porLotes ? `Movimientos por lotes` : ""}
              placement="top"
              arrow
              TransitionProps={{ timeout: 600 }}
            >
              <ListItemAvatar
                onClick={() => {
                  linea.porLotes &&
                    dispatch({
                      type: "irAMovilotes",
                      payload: { idLinea: linea.idLinea },
                    });
                }}
              >
                <Icon color="primary" fontSize="large" className={classes[claseLinea]}>
                  {linea.porLotes ? "reorder" : "circle"}
                </Icon>
              </ListItemAvatar>
            </Tooltip>
            <ListItemText
              disableTypography
              primary={
                <Box width={1} display="flex" justifyContent="space-between">
                  <Box display="inline" style={{ maxWidth: "300px" }}>{`${linea.descripcion}`}</Box>
                  <Box display="inline">{`Pte. ${Pte} / A env ${linea.shCantAlbaran || 0}`}</Box>
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
                      >{`Ref ${linea.referencia}`}</Typography>
                    </Box>
                    <Box display="inline">
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >{`Ubic. ${linea.codUbicacionArticulo} / Disp ${dispLote}`}</Typography>
                    </Box>
                  </Box>
                )
              }
            />
            <Box ml={2} display="flex" justifyContent="flex-end" alignItems="center">
              <QBoxButton
                id="cerrarLinea"
                title={linea.cerradaPDA ? "Abrir línea" : "Cerrar línea"}
                icon={IconoLock}
                onClick={() => {
                  dispatch({
                    type: "onCerrarLineaClicked",
                    payload: { idLineaCerrar: linea.idLinea },
                  });
                  callbackFocus();
                }}
              />
              <IconButton id="toggleOpen" onClick={handleToggleOpenClicked}>
                <Icon fontSize="large">{open ? "expand_less" : "expand_more"}</Icon>
              </IconButton>
            </Box>
          </Box>
          <Collapse in={open}>
            <Quimera.View
              key={linea.idLinea}
              id="LineaPedidoVentaCli"
              idLinea={linea.idLinea}
              lineaInicial={linea}
              disabled={disabled}
              callbackCambiada={handleChangeLinea}
            />
          </Collapse>
        </Collapse>
      </Box>
    </ListItem>
  );
}

export default ListItemPedidoVenta;
// const equalProps = (prev, next) => {
//   const equal = prev?.linea.referencia === next?.linea.referencia;
//   // console.log("cantidad HISTORICOEQUAL", equal);

//   return equal;
// };
// export default React.memo(ListItemPedidoVenta, equalProps);
