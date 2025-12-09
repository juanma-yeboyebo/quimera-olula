import { Box, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Avatar, ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
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
  pte: {
    backgroundColor: `${theme.palette.error.main} !important`,
  },
  parcial: {
    backgroundColor: `${theme.palette.warning.main} !important`,
  },
  servido: {
    backgroundColor: `${theme.palette.success.main} !important`,
  },
  anulado: {
    backgroundColor: "#b0b0b0 !important",
  },
}));

function ListItemMisPedidos({ renderAvatar, model, selected = false, funSecondaryLeft, avatar = "P", ...props }) {
  const pedido = model;
  const classes = useStyles();
  const estadoServido = {
    Sí: {
      clase: classes.servido,
      titulo: "Servido",
    },
    No: {
      clase: classes.pte,
      titulo: "Pendiente",
    },
    Parcial: {
      clase: classes.parcial,
      titulo: "Parcial",
    },
    Anulado: {
      clase: classes.anulado,
      titulo: "Anulado",
    },
  };

  return (
    <QListItemModel
      className={selected ? classes.cardSelected : classes.card}
      model={model}
      {...props}
      disableGutters
    >
      <ListItemAvatar>
        <Avatar className={estadoServido[model.servido].clase}>{"P"}</Avatar>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <React.Fragment>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">{`${pedido.codigo}`}</Box>
              <Box display="inline" mr={1}>{`${util.euros(pedido.total)}`}</Box>
            </Box>
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">
                <Typography component="span" variant="body2" color="textPrimary">
                  {estadoServido[model.servido].titulo}
                </Typography>
              </Box>
              <Box display="inline" mr={1}>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >{`${util.formatDate(pedido.fecha)}`}</Typography>
              </Box>
            </Box>
          </React.Fragment>
        }
      />
    </QListItemModel>
  );
}

export default ListItemMisPedidos;
