import { Box, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Icon, ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
import { util } from "quimera";
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
}));

function ListItemVenta({ renderAvatar, model, modelName, selected = false, funSecondaryLeft, avatar = "P", ...props }) {
  const classes = useStyles();
  const venta = model;

  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      <ListItemAvatar>
        {/* <Avatar className={classes.avatar}>{venta?.codConsumidor?.charAt(0)}</Avatar> */}
        <Icon color="primary" fontSize="large" className={classes.avatar}>
          shopping_basket_outlined
        </Icon>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between" alignItems={"center"}>
            <Typography variant="body1">{`${venta.fechaVenta ? `${util.formatDate(venta.fechaVenta)} - ` : ""
              }${venta.nombreConsumidor || ""}${venta.apellidosConsumidor ? ` ${venta.apellidosConsumidor}` : ""
              }`}</Typography>
            <Typography variant="h5">{util.euros(venta.importe || 0)}</Typography>
          </Box>
        }
      />
    </QListItemModel>
  );
}

export default ListItemVenta;
