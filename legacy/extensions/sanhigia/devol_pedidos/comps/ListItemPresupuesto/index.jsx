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
  avatarEditable: {
    color: theme.palette.success.main,
  },
  avatarNoEditable: {
    color: theme.palette.error.main,
  },
}));

const colorEditable = {
  true: "avatarEditable",
  false: "avatarNoEditable",
};

const iconoEditable = {
  true: "radio_button_unchecked",
  false: "radio_button_unchecked",
};

function ListItemPresupuesto({ renderAvatar, model, modelName, selected = false, funSecondaryLeft, logic, avatar = "P", ...props }) {
  const classes = useStyles();
  const presupuesto = model;

  const editable = logic.presupuestoEditable(presupuesto);

  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      <ListItemAvatar>
        <Icon color="primary" fontSize="large" className={classes[colorEditable[editable]]}>
          {iconoEditable[editable]}
        </Icon>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Typography variant="body1">{presupuesto.nombreCliente || "CLIENTE"}</Typography>
            <Typography variant="body1">{util.euros(presupuesto.total)}</Typography>
          </Box>
        }
        secondary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Box display="inline">
              <Typography component="span" variant="body2" color="textPrimary">
                {funSecondaryLeft ? funSecondaryLeft(presupuesto) : `${presupuesto.codigo}`}
              </Typography>
            </Box>
            <Box display="inline">
              <Typography component="span" variant="body2" color="textPrimary">{`${util.formatDate(
                presupuesto.fecha,
              )}`}</Typography>
            </Box>
          </Box>
        }
      />
    </QListItemModel>
  );
}

export default ListItemPresupuesto;
