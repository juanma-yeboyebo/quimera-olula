import { Box } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
import { util } from "quimera";
import React from "react";

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: `${theme.palette.success.main} !important`,
  },
  card: {
    borderTop: `2px solid ${theme.palette.background.paper}`,
    borderBottom: `2px solid ${theme.palette.grey[300]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
}));

function ListItemLineaFactura({ linea, ...props }) {
  const classes = useStyles();

  return (
    <ListItem {...props}>
      <ListItemAvatar>
        <Avatar className={classes.avatar}>{linea.cantidad}</Avatar>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <React.Fragment>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">{`${linea.descripcion}`}</Box>
              <Box display="inline">{`${util.euros(linea.pvpTotal)}`}</Box>
            </Box>
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >{`${linea.referencia}`}</Typography>
              </Box>
              <Box display="inline">
                <Typography component="span" variant="body2" color="textPrimary">{`${linea.cantidad
                  } x ${util.euros(linea.pvpUnitario)}`}</Typography>
              </Box>
            </Box>
          </React.Fragment>
        }
      />
    </ListItem>
  );
}

export default ListItemLineaFactura;
