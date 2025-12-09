import { Box, Field, Icon, IconButton, QListItemModel, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { ListItemText } from "@quimera/thirdparty";
import { useStateValue } from "quimera";
import { useState } from "react";

import { noImage } from "../../static/local";

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

function ItemLineaCarritoCheckout({ model, modelName, selected = false, avatar = "C", ...props }) {
  // const classes = useStyles()
  const [cantidad, setCantidad] = useState(model.cantidad);
  const [validation, setValidation] = useState({ error: false, helperText: "" });
  const [_, dispatch] = useStateValue();

  const handleChangeCantidad = e => {
    setValorCantidad(e.floatValue);
  };

  const handleSumaClicked = c => {
    const multiplo = 1;
    setValorCantidad(cantidad + c * multiplo);
  };

  const setValorCantidad = c => {
    c > 0 ? setCantidad(c) : setCantidad(0);
    if (cantidad !== model.cantidad) {
      dispatch({
        type: "onCambiarCantidadLineaClicked",
        payload: {
          referencia: model.referencia,
          cantidad,
          idLinea: model.idLinea,
        },
      });
    }
  };

  const linea = model;

  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      <img
        src={linea.urlImagen}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = noImage;
        }}
        height={100}
        alt={linea.descripcion}
        loading="lazy"
      />
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Typography variant="body1">{`${linea.referencia} - ${linea.descripcion}`}</Typography>
          </Box>
        }
        secondary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Box display="inline">
              <Typography component="span" variant="body2" color="textPrimary">
                {`${model.pvp}`}
              </Typography>
            </Box>
          </Box>
        }
      />
      <Box display="flex" justifyContent="space-around" alignItems="flex-end">
        <Box display="flex" alignItems="flex-start" justifyContent={"center"}>
          <IconButton id="resta" onClick={() => handleSumaClicked(-1)}>
            <Icon fontSize="small" color="secondary">
              remove_circle_outline
            </Icon>
          </IconButton>
          <Box width={50}>
            <Field.Int
              id="cantidad"
              value={cantidad}
              onChange={handleChangeCantidad}
              error={validation.error}
              helperText={validation.helperText}
            />
          </Box>
          <IconButton id="suma" onClick={() => handleSumaClicked(1)}>
            <Icon fontSize="small" color="secondary">
              add_circle_outline
            </Icon>
          </IconButton>
        </Box>
      </Box>
    </QListItemModel>
  );
}

export default ItemLineaCarritoCheckout;
