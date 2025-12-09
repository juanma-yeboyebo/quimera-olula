import { Box, Dialog, Field, Icon, IconButton, QListItemModel, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { ListItemText } from "@quimera/thirdparty";
import { useStateValue, util } from "quimera";
import React, { useState } from "react";

import { ChipNoDisponible } from "../../comps";
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
  littleImg: {
    "&:hover": {
      cursor: "zoom-in",
    },
  },
  bigImg: {
    "&:hover": {
      cursor: "zoom-out",
    },
  },
}));

function ItemLineaCarritoCheckout({ model, modelName, selected = false, ...props }) {
  const classes = useStyles();
  const [cantidad, setCantidad] = useState(model.cantidad);
  const [imagenValida, setImagenValida] = useState(true);
  const [zoom, setZoom] = useState(false);
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

  console.log("Linea Carrito", model);

  const linea = model;

  return (
    <QListItemModel modelName={modelName} model={model} selected={selected}>
      <Box minWidth={100}>
        <img
          src={linea.urlImagen}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = noImage;
            setImagenValida(false);
          }}
          height={100}
          alt={linea.descripcion}
          loading="lazy"
          className={imagenValida ? classes.littleImg : null}
          onClick={() => imagenValida && setZoom(true)}
        />
      </Box>
      <ListItemText
        disableTypography
        primary={
          <Box width={1} display="flex" justifyContent="space-between">
            <Typography variant="body1">{`${linea.descripcion}`}</Typography>
          </Box>
        }
        secondary={
          <Box width={1}>
            <Box display="flex" alignItems="flex-start">
              <Icon fontSize="small">open_in_full</Icon>
              <Box pl={1}></Box>
              <Typography component="span" variant="body1" color="textPrimary">
                {`${model.litraje || ""}`}
              </Typography>
              {!model.disponible && (
                <Box pl={1}>
                  <ChipNoDisponible />
                </Box>
              )}
            </Box>
            <Typography component="span" variant="body1" color="textPrimary">
              {`${util.euros(model.pvpUnitario)}`}
            </Typography>
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

      {zoom && (
        <Dialog open={zoom} maxWidth="md" onClose={() => setZoom(false)}>
          <Box display="flex" py={2} px={2} className="ItemCatalogoBody">
            <img
              src={linea.urlImagen}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = noImage;
              }}
              height={600}
              alt={linea.descripcion}
              loading="lazy"
              className={classes.bigImg}
              onClick={() => setZoom(false)}
            />
          </Box>
        </Dialog>
      )}
    </QListItemModel>
  );
}

export default ItemLineaCarritoCheckout;
