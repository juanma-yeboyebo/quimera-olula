import { Avatar, Box, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
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

function ListItemAlbaran({ renderAvatar, model, modelName, selected = false, funSecondaryLeft, avatar = "P", ...props }) {
  const classes = useStyles();
  const albaran = model;

  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      <ListItemAvatar>
        {/* reclamado invisible={!albaran.reclamado} color="primary" overlap="circle" badgeContent="R"> */}

        {renderAvatar ? renderAvatar(model) : <Avatar>{albaran?.nombreCliente?.charAt(0)}</Avatar>}
        {/* </Badge> */}
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <>
            <Box width={1} display="flex" justifyContent="space-between">
              <Typography variant="body1">{albaran.nombreCliente || "CLIENTE"}</Typography>
              <Typography variant="body1">{util.euros(albaran.total)}</Typography>
            </Box>
          </>
        }
        secondary={
          <>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">
                <Typography component="span" variant="body2" color="textPrimary">
                  {funSecondaryLeft ? funSecondaryLeft(albaran) : `${albaran.codigo}`}
                </Typography>
              </Box>
              <Box display="inline">
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >{`${util.formatDate(albaran.fecha)}`}</Typography>
              </Box>
            </Box>
          </>
        }
      />
    </QListItemModel>
  );
}

export default ListItemAlbaran;
