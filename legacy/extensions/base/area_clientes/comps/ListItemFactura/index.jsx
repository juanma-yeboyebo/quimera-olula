import { Box } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import {
  Avatar,
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@quimera/thirdparty";
import { util } from "quimera";
import React from "react";

const useStyles = makeStyles(theme => ({
  pte: {
    backgroundColor: `${theme.palette.error.main}`,
  },
  terminado: {
    backgroundColor: `${theme.palette.success.main}`,
  },
  produccion: {
    backgroundColor: `${theme.palette.warning.main}`,
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

function ListItemFactura({ avatar = "F", factura, selected = false, ...props }) {
  const classes = useStyles();

  return (
    <ListItem className={selected ? classes.cardSelected : classes.card} {...props}>
      <ListItemAvatar>
        <Badge invisible={!factura.reclamado} color="primary" overlap="circle" badgeContent="R">
          <Avatar
            className={
              factura.estado === "PTE"
                ? classes.pte
                : factura.estado === "TERMINADO"
                  ? classes.terminado
                  : classes.produccion
            }
          >
            {avatar}
          </Avatar>
        </Badge>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <React.Fragment>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">{`${factura.nombreCliente || "CLIENTE"}`}</Box>
              <Box display="inline">{`${util.euros(factura.total)}`}</Box>
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
                >{`${factura.codigo}`}</Typography>
              </Box>
              <Box display="inline">
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >{`${util.formatDate(factura.fecha)}`}</Typography>
              </Box>
            </Box>
          </React.Fragment>
        }
      />
    </ListItem>
  );
}

export default ListItemFactura;
