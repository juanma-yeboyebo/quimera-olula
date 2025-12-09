import { Avatar, Box, Tooltip } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import {
  Collapse,
  Icon,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@quimera/thirdparty";
import Quimera, { getSchemas, useWidth } from "quimera";
import React, { useState, useEffect } from "react";

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
  if (linea.estadoPDA == "Preparado" && shcant <= cantidad - total) {
    colorLinea = "cLink";
  } else if (linea.cerradaPDA) {
    colorLinea = "cWarning";
  } else if (shcant > cantidad - total) {
    colorLinea = "cDanger";
  } else if (shcant == cantidad - total) {
    colorLinea = "cSuccess";
  }

  if (linea.porLotes) {
    colorLinea += "Pointer";
  }

  return colorLinea;
}
function ListItemLineaPreparacion({ disabled, dispatch, model, linea, modalLotesAlmacenVisible, hideSecondary = false, callbackCambiada, selected = false, ...props }) {

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  // const [linea, setLinea] = useState(model);
  const claseLinea = dameColorLinea(linea);
  const [aEnviar, setAEnviar] = useState(linea.shCantAlbaran || 0);

  const handleToggleOpenClicked = () => {
    setOpen(!open);
    dispatch({
      type: "onToggleOpenClicked",
      payload: { idLinea: linea.idLinea },
    })
  };

  useEffect(() => {
    setAEnviar(linea.shCantAlbaran || 0);
  }, [linea.shCantAlbaran]);

  const handleChangeLinea = e => {
    // setLinea(e.item);
    callbackCambiada();
    setAEnviar(e.item.shCantAlbaran || 0);
    // callbackFocus();
  };

  const Pte = parseFloat(linea.cantidad) - parseFloat(linea.totalEnAlbaran);
  // const aEnviar = linea.shCantAlbaran || 0;
  const dispLote = linea.dispLotesAlmacen ? linea.dispLotesAlmacen.toFixed(2) : 0;
  // const modalDevolucionVisible = false;

  return (
    <ListItem className={classes.card} {...props} disableGutters>
      <Box display="flex" flexDirection="column" width={1}>
        <Collapse in={!["creating_line", "deleted"].includes(linea._status)}>
          <Box display="flex">
            {/* <ListItemAvatar
              onClick={() =>
                dispatch({
                  type: "onLoteInfoClicked",
                  payload: { idLinea: linea.idLinea },
                })
              }
            >
              <Avatar className={classes[claseLinea]}>{""}</Avatar>
            </ListItemAvatar> */}
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
                      type: "onLoteInfoClicked",
                      payload: { idLinea: linea.idLinea },
                    });
                }}
              >
                <Icon color="" fontSize="large" className={classes[claseLinea]}>
                  {linea.porLotes ? "reorder" : "circle"}
                </Icon>
              </ListItemAvatar>
            </Tooltip>
            <ListItemText
              disableTypography
              primary={
                <Box width={1} display="flex" justifyContent="space-between">
                  <Box display="inline" style={{ maxWidth: "300px" }}>{`${linea.descripcion}`}</Box>
                  <Box display="inline">{`Pte. ${Pte} / A env ${aEnviar}`}</Box>
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
            {!linea.porLotes && (
              <Box display="inline">
                <IconButton
                  id="asignarLote"
                  onClick={() =>
                    dispatch({
                      type: "onAsignarLote",
                      payload: { idLinea: linea.idLinea },
                    })
                  }
                >
                  <Icon fontSize="large">done</Icon>
                </IconButton>
                <IconButton id="toggleOpen" onClick={handleToggleOpenClicked}>
                  <Icon fontSize="large">{open ? "expand_less" : "expand_more"}</Icon>
                </IconButton>
              </Box>
            )}
            {linea.porLotes && (
              <Box display="inline">
                <IconButton
                  id="completarLinea"
                  onClick={() =>
                    dispatch({
                      type: "onCompletarLineaLoteClicked",
                      payload: { idLinea: linea.idLinea },
                    })
                  }
                >
                  <Icon fontSize="large">done</Icon>
                </IconButton>
                <IconButton id="toggleOpen" onClick={handleToggleOpenClicked}>
                  <Icon fontSize="large">{open ? "expand_less" : "expand_more"}</Icon>
                </IconButton>
              </Box>
            )}
          </Box>
          <Collapse in={open}>
            <Quimera.View
              key={linea.idLinea}
              id="LineaPedidoVentaCliShPreparacion"
              idLinea={linea.idLinea}
              lineaInicial={linea}
              disabled={disabled}
              callbackCambiada={handleChangeLinea}
            />
          </Collapse>
        </Collapse>
      </Box >
    </ListItem >
  );
}

export default ListItemLineaPreparacion;
// const equalProps = (prev, next) => {
//   const equal = prev?.linea.referencia === next?.linea.referencia;
//   // console.log("cantidad HISTORICOEQUAL", equal);

//   return equal;
// };
// export default React.memo(ListItemLineaPreparacion, equalProps);
