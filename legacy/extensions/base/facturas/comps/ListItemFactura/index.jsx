import { Avatar, Box, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
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

function ListItemFactura({ renderAvatar, model, modelName, selected = false, funSecondaryLeft, avatar = "P", ...props }) {
  const classes = useStyles();
  const factura = model;

  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      <ListItemAvatar>
        {/* reclamado invisible={!factura.reclamado} color="primary" overlap="circle" badgeContent="R"> */}
        <Avatar>{factura?.nombreCliente?.charAt(0)}</Avatar>
        {/* </Badge> */}
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <>
            <Box width={1} display="flex" justifyContent="space-between">
              <Typography variant="body1">{factura.nombreCliente || "CLIENTE"}</Typography>
              <Typography variant="body1">{util.euros(factura.total)}</Typography>
            </Box>
          </>
        }
        secondary={
          <>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">
                <Typography component="span" variant="body2" color="textPrimary">
                  {funSecondaryLeft ? funSecondaryLeft(factura) : `${factura.codigo}`}
                </Typography>
              </Box>
              <Box display="inline">
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >{`${util.formatDate(factura.fecha)}`}</Typography>
              </Box>
            </Box>
          </>
        }
      />
    </QListItemModel>
  );
}

export default ListItemFactura;
