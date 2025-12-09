import { Box } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
import { util } from "quimera";

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: `${theme.palette.success.main} !important`,
  },
  card: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
}));

function ListItemLineaMisPedidos({ linea, selected = false, funPrimaryLeft, funPrimaryRight, hideSecondary = false, ...props }) {
  const classes = useStyles();

  return (
    <ListItem className={selected ? classes.cardSelected : classes.card} {...props} disableGutters>
      <ListItemAvatar>
        <Avatar className={classes.avatar}>{linea.cantidad}</Avatar>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Box display="inline">
              {funPrimaryLeft ? funPrimaryLeft(linea) : `${linea.descripcion}`}
            </Box>
            <Box display="inline">
              {funPrimaryRight ? funPrimaryRight(linea) : `${util.euros(linea.pvpTotal)}`}
            </Box>
          </Box>
        }
        secondary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Box display="inline">
              <Typography
                component="span"
                variant="body2"
                color="textPrimary"
              >{`${linea.estado}`}</Typography>
            </Box>
            <Box display="inline">
              <Typography component="span" variant="body2" color="textPrimary">{`${linea.cantidad
                } x ${util.euros(linea.pvpUnitario)}`}</Typography>
            </Box>
          </Box>
        }
      />
    </ListItem>
  );
}

export default ListItemLineaMisPedidos;
