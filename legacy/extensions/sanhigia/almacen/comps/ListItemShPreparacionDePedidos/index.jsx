import { Box, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Avatar, ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
import { util } from "quimera";

const useStyles = makeStyles(theme => ({
  card: {
    borderTop: `2px solid ${theme.palette.grey[200]}`,
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  inactivo: {
    backgroundColor: 'lightgrey !important',
    width: '40px !important',
    height: '40px !important',
  },
  activo: {
    backgroundColor: `${theme.palette.success.main} !important`,
    width: '40px !important',
    height: '40px !important',
  },
}));

function ListItemShPreparacionDePedidos({ renderAvatar, model, modelName, selected = false, funSecondaryLeft, avatar = "P", ...props }) {
  const classes = useStyles();
  const preparacion = model;
  const estadoActivo = preparacion.tengoLineas === 0 ? classes.inactivo : classes.activo;

  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      <ListItemAvatar color="primary">
        <Avatar className={estadoActivo}>{""}</Avatar>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Typography variant="body1">{preparacion.descripcion}</Typography>
            <Typography variant="body1">{preparacion.ubicacionini} / {preparacion.ubicacionfin}</Typography>
          </Box>
        }
        secondary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Box display="inline">
              <Typography component="span" variant="body2" color="textPrimary">
                {funSecondaryLeft ? funSecondaryLeft(preparacion) : `${preparacion.codPreparacionDePedido}`}
              </Typography>
            </Box>
            <Box display="inline">
              <Typography component="span" variant="body2" color="textPrimary">{`${util.formatDate(
                preparacion.fecha,
              )}`}</Typography>
            </Box>
          </Box>
        }
      />
    </QListItemModel>
  );
}

export default ListItemShPreparacionDePedidos;
