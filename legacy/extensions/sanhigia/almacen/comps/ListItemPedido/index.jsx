import { Box, Field, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Icon, ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
import { useStateValue, util } from "quimera";
import React from "react";

const useStyles = makeStyles(theme => ({
  card: {
    borderTop: `2px solid ${theme.palette.grey[200]}`,
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
  cLink: { color: "#4478DE" },
  cPrimary: { color: "#2D95C1" },
  cSuccess: { color: "#449D44" },
  cWarning: { color: "#EC971F" },
  cInfo: { color: "yellow" },
  cDanger: { color: "#D32F2F" },
  cNone: { color: 'lightgrey' },
}));

function calculaColorAvatar(model) {
  let colorAvatar = "cNone";
  const estado = model.estadoPda;
  const codTrabajador = model.codTrabajador;

  if (estado === "Listo PDA") {
    colorAvatar = "cSuccess";
  } else if (!codTrabajador) {
    colorAvatar = "cNone";
  }
  // else if (estado === "Preparado") {
  //   colorAvatar = "cLink";
  // } 
  else if (estado === "Pendiente" || codTrabajador) {
    colorAvatar = "cWarning";
  }
  return colorAvatar;
}

function ListItemPedido({ arrayMultiCheck = [], renderAvatar, renderId, model, modelName, selected = false, funSecondaryLeft, habilitarMulticheck = false, avatar = "P", ...props }) {
  const [_, dispatch] = useStateValue();
  const classes = useStyles();
  const pedido = model;
  console.log(calculaColorAvatar(model));
  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      {habilitarMulticheck && (
        <Field.CheckBox
          id="checkBox"
          onClick={() => {
            arrayMultiCheck.includes(model.idPedido)
              ? dispatch({
                type: `on${util.camelId(modelName)}ItemCheckout`,
                payload: { index: arrcalculaColorAvatarayMultiCheck.indexOf(model.idPedido) },
              })
              : dispatch({
                type: `on${util.camelId(modelName)}ItemChecked`,
                payload: { idPedido: model.idPedido },
              });
          }}
          checked={arrayMultiCheck.includes(model.idPedido)}
        />
      )}
      <ListItemAvatar>
        <Icon color="primary" fontSize="large" sx={{
          color: theme => {
            const colorClass = calculaColorAvatar(model);
            const colorMap = {
              cLink: "#4478DE",
              cPrimary: "#2D95C1",
              cSuccess: "#449D44",
              cWarning: "#EC971F",
              cInfo: "yellow",
              cDanger: "#D32F2F",
              cNone: "lightgrey"
            };
            return colorMap[colorClass] || "lightgrey";
          }
        }}>
          radio_button_unchecked
        </Icon>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Box display="inline">
              <Typography variant="body1">{pedido.nombreCliente || "CLIENTE"}</Typography>
            </Box>
            <Box display="inline">
              <Typography variant="body2" color="textPrimary">
                {pedido.descPreparaciones.substring(0, 13)} / {pedido.shEstadopreparacion}
              </Typography>
            </Box>
          </Box>
        }
        secondary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Box display="inline">
              <Typography component="span" variant="body2" color="textPrimary">
                {funSecondaryLeft ? funSecondaryLeft(pedido) : `${pedido.codigo}`}
              </Typography>
            </Box>
            <Box display="inline">
              <Typography component="span" variant="body2" color="textPrimary">{`${util.formatDate(
                pedido.fecha,
              )}`}</Typography>
            </Box>
          </Box>
        }
      />
    </QListItemModel>
  );
}

export default ListItemPedido;
