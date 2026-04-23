import { Box, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Icon, ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
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
  avatarGanado: {
    color: theme.palette.success.main,
  },
  avatarPerdido: {
    color: theme.palette.grey[600],
  },
  avatarPendiente: {
    color: theme.palette.error.main,
  },
}));

const getAvatarColorClass = (editable, estadoPresupuesto) => {
  if (!editable) {
    return "avatarGanado";
  }
  if (estadoPresupuesto === "Perdido") {
    return "avatarPerdido";
  }
  if (estadoPresupuesto === "Pendiente") {
    return "avatarPendiente";
  }
  return "avatarPendiente";
};

function ListItemPresupuesto({ renderAvatar, model, modelName, selected = false, funSecondaryLeft, logic, avatar = "P", ...props }) {
  const classes = useStyles();
  const presupuesto = model;

  const editable = logic.presupuestoEditable(presupuesto);
  const avatarColorClass = getAvatarColorClass(editable, presupuesto.estadoPresupuesto);

  // console.log('mimensaje_presupuesto', presupuesto);


  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      <ListItemAvatar>
        <Icon fontSize="large" className={classes[avatarColorClass]}>
          radio_button_unchecked
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
