import { Box, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { ListItemText, Typography } from "@quimera/thirdparty";
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
      {/* <ListItemAvatar>
        <Avatar>{albaran?.nombreCliente?.charAt(0)}</Avatar>
      </ListItemAvatar> */}
      <ListItemText
        disableTypography
        primary={
          <>
            <Box width={1} display="flex" justifyContent="space-between">
              <Typography variant="body1">
                {funSecondaryLeft ? funSecondaryLeft(albaran) : `${albaran.codigo}`}
              </Typography>
              <Box display="inline" mr={1}>
                <Typography variant="body1">{`${util.formatDate(albaran.fecha)}`}</Typography>
              </Box>
            </Box>
          </>
        }
        secondary={
          <>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">
                <Typography component="span" variant="body2" color="textPrimary">
                  {albaran.nombreCliente || "CLIENTE"}
                </Typography>
              </Box>
              <Box display="inline" mr={1}>
                <Typography component="span" variant="body2" color="textPrimary">
                  {util.euros(albaran.total)}
                </Typography>
              </Box>
            </Box>
          </>
        }
      />
    </QListItemModel>
  );
}

export default ListItemAlbaran;
