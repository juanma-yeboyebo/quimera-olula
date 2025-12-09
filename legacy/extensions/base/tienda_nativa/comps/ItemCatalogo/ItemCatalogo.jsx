import { Box, Button, Field, Icon, IconButton } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Typography } from "@quimera/thirdparty";
import { useAppValue, useStateValue, util } from "quimera";
import React, { useState } from "react";

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

function ItemCatalogo({ renderAvatar, model, modelName, selected = false, ...props }) {
  // const classes = useStyles()
  const [open, setOpen] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [validation, setValidation] = useState({ error: false, helperText: "" });
  const [_, dispatch] = useStateValue();
  const [{ carrito }] = useAppValue();

  const handleToggleOpenClicked = () => {
    setOpen(!open);
  };
  const handleChangeCantidad = e => {
    setValorCantidad(e.floatValue);
  };

  const handleSumaClicked = c => {
    const multiplo = 1;
    setValorCantidad(cantidad + c * multiplo);
  };

  const setValorCantidad = c => {
    c > 0 ? setCantidad(c) : setCantidad(0);
  };

  const producto = model;
  const baseImageUrl = "http://barnaplant.com/imagenes/disponible";
  const urlImage = `${baseImageUrl}/${producto.referencia.toUpperCase()}.JPG`;
  const noImage = "/img/noimage.png";
  const width = 250;
  const height = 420;

  return (
    <Box
      minWidth={width}
      maxWidth={width}
      minHeight={height}
      border={2}
      borderColor="gray"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box>
        <Box
          border={0}
          borderColor="blue"
          style={{ "overflow": "hidden", "background-color": "white" }}
          display="flex"
          justifyContent="center"
          bgColor="red"
          width={1}
        >
          <img
            src={urlImage}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = noImage;
            }}
            height={200}
            alt={producto.descripcion}
            loading="lazy"
          />
        </Box>
        <Box p={1}>
          <Typography variant="body2">{`REF: ${producto.referencia}`}</Typography>
          <Typography variant="body1">{producto.descripcion}</Typography>
        </Box>
      </Box>
      <Box width={1}>
        <Box p={1}>
          <Box display="flex" alignItems="center" justifyContent={"center"}>
            <IconButton id="resta" onClick={() => handleSumaClicked(-1)}>
              <Icon fontSize="medium" color="secondary">
                remove_circle_outline
              </Icon>
            </IconButton>
            <Box maxWidth={100}>
              <Field.Float
                id="cantidad"
                value={cantidad}
                onChange={handleChangeCantidad}
                error={validation.error}
                helperText={validation.helperText}
              />
            </Box>
            <IconButton id="suma" onClick={() => handleSumaClicked(1)}>
              <Icon fontSize="medium" color="secondary">
                add_circle_outline
              </Icon>
            </IconButton>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography component="span" variant="body1" color="textPrimary">
              {`${util.euros(producto.pvp)}`}
            </Typography>
            <Button
              id="save"
              variant="text"
              color="primary"
              startIcon={<Icon>shopping_cart</Icon>}
              onClick={() =>
                dispatch({
                  type: "onAnadirProductoACarritoClicked",
                  payload: {
                    referencia: producto.referencia,
                    cantidad,
                    idCarrito: carrito.idCarrito,
                  },
                })
              }
              disabled={!cantidad || validation.error}
              text="Comprar"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ItemCatalogo;
