import { Box, Field, QListItemModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { ListItemAvatar, ListItemText, Typography } from "@quimera/thirdparty";
import { useStateValue, util } from "quimera";
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

function ListItemPedido({ arrayMultiCheck = [], renderAvatar, model, modelName, selected = false, funSecondaryLeft, habilitarMulticheck = false, avatar = "P", ...props }) {
  const [_, dispatch] = useStateValue();
  const classes = useStyles();
  const pedido = model;

  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      {habilitarMulticheck && (
        <Field.CheckBox
          id="checkBox"
          onClick={() => {
            arrayMultiCheck.includes(model.idPedido)
              ? dispatch({
                type: `on${util.camelId(modelName)}ItemCheckout`,
                payload: { index: arrayMultiCheck.indexOf(model.idPedido) },
              })
              : dispatch({
                type: `on${util.camelId(modelName)}ItemChecked`,
                payload: { idPedido: model.idPedido },
              });
          }}
          checked={arrayMultiCheck.includes(model.idPedido)}
        />
      )}
      <ListItemAvatar>
        {/* <Badge color="primary" overlap="circle" badgeContent="R"> */}
        {renderAvatar ? renderAvatar(model) : null}
        {/* </Badge> */}
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <>
            <Box width={1} display="flex" justifyContent="space-between">
              <Typography variant="body1">{pedido.nombreCliente || "CLIENTE"}</Typography>
              <Typography variant="body1">{util.euros(pedido.total)}</Typography>
            </Box>
          </>
        }
        secondary={
          <>
            <Box width={1} display="flex" justifyContent="space-between">
              <Box display="inline">
                <Typography component="span" variant="body2" color="textPrimary">
                  {funSecondaryLeft ? funSecondaryLeft(pedido) : `${pedido.codigo}`}
                </Typography>
              </Box>
              <Box display="inline">
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >{`${util.formatDate(pedido.fecha)}`}</Typography>
              </Box>
            </Box>
          </>
        }
      />
    </QListItemModel>
  );
}

export default ListItemPedido;
