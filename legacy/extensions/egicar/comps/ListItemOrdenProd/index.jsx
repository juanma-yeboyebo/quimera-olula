import { Box, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Icon, ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
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
  avatar: {
    width: "36px !important",
    height: "36px !important",
  },
  avatarPte: {
    color: theme.palette.info.main,
  },
  avatarEnCurso: {
    color: theme.palette.warning.main,
  },
}));

function ListItemOrdenProd({ renderAvatar, model, modelName, selected = false, funSecondaryLeft, avatar = "P", ...props }) {
  const classes = useStyles();
  const orden = model;

  // console.log("mimensaje_ordenes", orden);

  const colorServido = {
    "PTE": "avatarPte",
    "EN CURSO": "avatarEnCurso",
  };

  const iconoServido = {
    "PTE": "radio_button_unchecked",
    "EN CURSO": "brightness_2",
  };

  function calculaColorAvatar(model) {
    return colorServido[model.estado];
  }

  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      <ListItemAvatar>
        <Icon color="primary" fontSize="large" className={classes[calculaColorAvatar(model)]}>
          {iconoServido[model.estado]}
        </Icon>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between" alignItems={"center"}>
            <Typography variant="h5">{orden.descripcionArticulo}</Typography>
            {/* <Typography variant="body1">{`${orden.fecha ? `${util.formatDate(orden.fecha)} - ` : ""
              }`}</Typography> */}
          </Box>
        }
        secondary={
          <Box width={1} display="flex" justifyContent="space-between" alignItems={"center"}>
            <Typography variant="body1">{orden.codOrden}</Typography>
            <Typography variant="body1">{orden.nombreCliente}</Typography>
          </Box>
        }
      />
    </QListItemModel>
  );
}

export default ListItemOrdenProd;
