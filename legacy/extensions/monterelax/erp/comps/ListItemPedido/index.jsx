import { Box, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Badge, ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
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
}));

function ListItemPedido({ renderAvatar, pedido, modelName, selected = false, funSecondaryLeft, avatar = "P", ...props }) {
  const classes = useStyles();

  return (
    <QListItemModel modelName={modelName} model={pedido} selected={selected}>
      <ListItemAvatar>
        <Badge invisible={!pedido.reclamado} color="primary" overlap="circle" badgeContent="R">
          {renderAvatar ? renderAvatar() : null}
        </Badge>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <>
            <Box width={1} display="flex" justifyContent="space-between">
              <Typography variant="body1">{pedido.nombreCliente || "CLIENTE"}</Typography>
              <Typography variant="body1">{util.euros(pedido.total)}</Typography>
            </Box>
          </>
        }
        secondary={
          <>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">
                <Typography component="span" variant="body2" color="textPrimary">
                  {funSecondaryLeft ? funSecondaryLeft(pedido) : `${pedido.codigo}`}
                </Typography>
              </Box>
              <Box display="inline">
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >{`${util.formatDate(pedido.fecha)}`}</Typography>
              </Box>
            </Box>
          </>
        }
      />
    </QListItemModel>
  );
}

export default ListItemPedido;
