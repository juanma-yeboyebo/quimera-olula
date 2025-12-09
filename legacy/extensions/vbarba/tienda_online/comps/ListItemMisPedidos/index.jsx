import { Avatar, Box, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { ListItemAvatar, ListItemText } from "@quimera/thirdparty";
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
  inactivo: {
    backgroundColor: `${theme.palette.error.main} !important`,
    width: '40px !important',
    height: '40px !important',
  },
  activo: {
    backgroundColor: `${theme.palette.success.main} !important`,
    width: '40px !important',
    height: '40px !important',
  },
}));

function ListItemMisPedidos({ renderAvatar, model, selected = false, funSecondaryLeft, avatar = "P", ...props }) {
  const carrito = model;
  const classes = useStyles();
  const estadoActivo = {
    true: {
      clase: classes.activo,
      titulo: "Activo",
    },
    false: {
      clase: classes.inactivo,
      titulo: "Inactivo",
    },
  };
  const activoText = "";

  return (
    <QListItemModel
      className={selected ? classes.cardSelected : classes.card}
      model={model}
      {...props}
      disableGutters
    >
      {<ListItemAvatar color="primary">
        <Avatar className={estadoActivo[false].clase}>{"C"}</Avatar>
      </ListItemAvatar>}
      <ListItemText
        disableTypography
        primary={
          <React.Fragment>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">{`Pedido ${carrito.codigo}` + activoText}</Box>
              <Box display="inline">{`${util.euros(carrito.total)}`}</Box>
            </Box>
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">{`${carrito.referencia || ""}`}</Box>
              <Box display="inline">{`${carrito.fecha}`}</Box>
            </Box>
          </React.Fragment>
        }
      />
    </QListItemModel>
  );
}

export default ListItemMisPedidos;
