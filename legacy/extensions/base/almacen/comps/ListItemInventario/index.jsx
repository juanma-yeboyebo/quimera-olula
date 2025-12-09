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

function ListItemInventario({ model, modelName, selected = false, funSecondaryLeft, ...props }) {
  const classes = useStyles();
  const pedido = model;

  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Typography variant="body1">{`${model.codAlmacen} - ${model.nombreAlmacen}`}</Typography>
            <Typography variant="body1">{model.codAlmacen}</Typography>
          </Box>
        }
        secondary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Typography component="span" variant="body2" color="textPrimary">
              {util.formatDate(model.fecha)}
            </Typography>
          </Box>
        }
      />
    </QListItemModel>
  );
}

export default ListItemInventario;
