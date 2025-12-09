import {
  Avatar,
  Box,
  Icon,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { util } from "quimera";

const useStyles = makeStyles(theme => ({
  abierta: {
    backgroundColor: `${theme.palette.error.main} !important`,
  },
  pte: {
    backgroundColor: `${theme.palette.warning.main} !important`,
  },
  finalizada: {
    backgroundColor: `${theme.palette.success.main} !important`,
  },
  card: {
    borderTop: `2px solid ${theme.palette.grey[200]}`,
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
}));

function ListItemVenta({ venta, selected = false, ...props }) {
  const classes = useStyles();

  const avatarClassName =
    (!!venta.sincronizada && classes.finalizada) ||
    (!venta.sincronizada && !!venta.cerrada && classes.pte) ||
    (!venta.sincronizada && !venta.cerrada && classes.abierta);

  const avatarIcon =
    (!!venta.sincronizada && "done") ||
    (!venta.sincronizada && !!venta.cerrada && "sync_problem") ||
    (!venta.sincronizada && !venta.cerrada && "hourglass_empty");

  return (
    <ListItem className={selected ? classes.cardSelected : classes.card} {...props} disableGutters>
      <ListItemAvatar>
        <Avatar className={avatarClassName}>
          <Icon>{avatarIcon}</Icon>
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">{`${venta.nombreCliente || "Cliente TPV"}`}</Box>
              <Box display="inline">{`${util.euros(venta.total)}`}</Box>
            </Box>
          </>
        }
        secondary={
          <>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">
                <Typography component="span" variant="body2" color="textPrimary">
                  {venta.codigo === "nueva" ? `Borrador ${venta.id}` : venta.codigo}
                </Typography>
              </Box>
              <Box display="inline">
                <Typography component="span" variant="body2" color="textPrimary">
                  {`${util.formatDate(venta.fecha)}`}
                </Typography>
              </Box>
            </Box>
          </>
        }
      />
    </ListItem>
  );
}

export default ListItemVenta;
