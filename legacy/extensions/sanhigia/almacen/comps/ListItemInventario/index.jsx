import { Box, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Avatar, ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
import { util } from "quimera";

const useStyles = makeStyles(theme => ({
  card: {
    borderTop: `2px solid ${theme.palette.grey[200]}`,
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
  abierto: {
    backgroundColor: `${theme.palette.success.main} !important`,
  },
  cerrado: {
    backgroundColor: `${theme.palette.error.main} !important`,
  },
}));

function ListItemInventario({ model, modelName, selected = false, funSecondaryLeft, ...props }) {
  const classes = useStyles();
  const inventario = model;
  const editable = inventario.estado === "Abierto" ? true : false;

  return (
    <QListItemModel modelName={modelName} model={inventario} selected={selected}>
      <ListItemAvatar>
        <Avatar className={editable ? classes.abierto : classes.cerrado}> </Avatar>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Typography variant="body1">{`${inventario.nombreAlmacen} (${inventario.codInventario})`}</Typography>
            <Typography variant="body1">{inventario.codAlmacen}</Typography>
          </Box>
        }
        secondary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Typography component="span" variant="body2" color="textPrimary">
              {util.formatDate(inventario.fecha)}
            </Typography>
          </Box>
        }
      />
    </QListItemModel>
  );
}

export default ListItemInventario;
