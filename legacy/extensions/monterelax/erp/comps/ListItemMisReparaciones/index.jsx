import { Box } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Badge, ListItem, ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
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

function ListItemMisReparaciones({ renderAvatar, pedido, selected = false, funSecondaryLeft, avatar = "P", ...props }) {
  const classes = useStyles();

  return (
    <ListItem className={selected ? classes.cardSelected : classes.card} {...props} disableGutters>
      <ListItemAvatar>
        <Badge invisible={!pedido.reclamado} color="primary" overlap="circle" badgeContent="R">
          {renderAvatar ? renderAvatar() : null}
        </Badge>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <React.Fragment>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">{`${pedido.referencia || "SIN REFERENCIA"} / ${
                pedido.estado
              }`}</Box>
              <Box display="inline">{`${util.formatDate(pedido.fecha)}`}</Box>
            </Box>
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">
                <Typography component="span" variant="body2" color="textPrimary">
                  {funSecondaryLeft ? funSecondaryLeft(pedido) : `${pedido.codigo}`}
                </Typography>
              </Box>
              {/* <Box display='inline'><Typography component="span" variant='body2' color='textPrimary'>{ pedido.estado }</Typography></Box> */}
            </Box>
          </React.Fragment>
        }
      />
    </ListItem>
  );
}

export default ListItemMisReparaciones;
