import { Box, Icon, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
import { useStateValue } from "quimera";
import React from "react";

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
}));

function ListItemPedido({ model, modelName, selected = false, funSecondaryLeft, tareaIntermedia = false, ...props }) {
  const [_, dispatch] = useStateValue();
  const classes = useStyles();
  const pedido = model;

  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      <ListItemAvatar>
        <Icon color="primary" fontSize="large" className={classes.avatar}>
          radio_button_unchecked
        </Icon>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Typography variant="h6">{`${pedido.nombreCliente}`}</Typography>

            <Typography variant="body1">{`${pedido.fecha}`}</Typography>
          </Box>
        }
        secondary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Typography component="span" variant="body2" color="textPrimary">
              {pedido.idPedido}
            </Typography>
          </Box>
        }
      />
    </QListItemModel>
  );
}

export default ListItemPedido;
