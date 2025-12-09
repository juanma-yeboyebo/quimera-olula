import { Box, Icon, QListItemModel } from "@quimera/comps";
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
}));

function ListItemReparaciones({ renderAvatar, model, selected = false, funSecondaryLeft, avatar = "P", ...props }) {
  const reparacion = model;
  const classes = useStyles();

  const avatares = {
    "PTE": {
      icon: "more_horiz",
      color: "#ef5350",
    },
    "PTE RECOGIDA": {
      icon: "local_shipping",
      color: "#eb910c",
    },
    "TERMINADO": {
      icon: "done",
      color: "#0b9adb",
    },
    "SERVIDO": {
      icon: "done_all",
      color: "#4caf50",
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
        <Avatar style={{ background: avatares[reparacion.estado].color }}>
          <Icon>{avatares[reparacion.estado].icon}</Icon>
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <React.Fragment>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">{reparacion?.idReparacion ?? ""}</Box>
              <Box display="inline" mr={1}>
                {util.formatDate(reparacion?.fecha)}
              </Box>
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
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {reparacion.descripcionCausa}
                </Typography>
              </Box>
            </Box>
          </React.Fragment>
        }
      />
    </QListItemModel>
  );
}

export default ListItemReparaciones;
