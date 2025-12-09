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

function ListItemCompra({ renderAvatar, model, modelName, selected = false, funSecondaryLeft, avatar = "P", ...props }) {
  const classes = useStyles();
  const compra = model;

  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      <ListItemAvatar>
        {/* <Avatar className={classes.avatar}>{compra?.codConsumidor?.charAt(0)}</Avatar> */}
        <Icon color="primary" fontSize="large" className={classes.avatar}>
          shopping_basket_outlined
        </Icon>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between" alignItems={"center"}>
            <Typography variant="body1">{`${compra.fechaCompra ? `${util.formatDate(compra.fechaCompra)} - ` : ""
              }${compra.nombreComercio || ""}`}</Typography>
            <Typography variant="h5">{util.euros(compra.importe || 0)}</Typography>
          </Box>
        }
      />
    </QListItemModel>
  );
}

export default ListItemCompra;
