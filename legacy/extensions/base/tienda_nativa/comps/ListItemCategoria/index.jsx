import { Box, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { ListItemText, Typography } from "@quimera/thirdparty";
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

function ListItemCategoria({ renderAvatar, model, modelName, selected = false, funSecondaryLeft, avatar = "C", ...props }) {
  // const classes = useStyles()
  const categoria = model;

  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      {/* <ListItemAvatar>
        <Badge invisible={!categoria.habilitado} color="primary" overlap="circle" badgeContent='R'>
          {renderAvatar
            ? renderAvatar()
            : null
          }
        </Badge>
      </ListItemAvatar> */}
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Typography variant="body1">{categoria.nombre}</Typography>
            <Typography variant="body1">{categoria.metatile}</Typography>
          </Box>
        }
        secondary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Box display="inline">
              <Typography component="span" variant="body2" color="textPrimary">
                {funSecondaryLeft ? funSecondaryLeft(categoria) : `${categoria.idcategoria}`}
              </Typography>
            </Box>
            <Box display="inline">
              <Typography component="span" variant="body2" color="textPrimary">
                {categoria.metatile}
              </Typography>
            </Box>
          </Box>
        }
      />
    </QListItemModel>
  );
}

export default ListItemCategoria;
