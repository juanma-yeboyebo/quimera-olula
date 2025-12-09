import { Box } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Typography } from "@quimera/thirdparty";
import { navigate } from "quimera";
import { useAppValue, useStateValue, useWidth, util } from "quimera";
import React, { useState } from "react";
import { useTranslation } from "@quimera/thirdparty";

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

function ItemCatalogo({ renderAvatar, model, modelName, selected = false, // avatar = 'C', ...props }) {
  // const classes = useStyles()
  const [open, setOpen] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [validation, setValidation] = useState({ error: false, helperText: "" });
  const [_, dispatch] = useStateValue();
  const [{ carrito }] = useAppValue();
  const { t } = useTranslation();
  const [estado, setEstado] = useState("En catalogo");

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

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const tablet = ["md"].includes(width);

  const producto = model;
  const baseImageSrc = util.getEnvironment().getUrlImages();
  const srcImage = `${baseImageSrc}/modelos/${producto.referencia.toUpperCase()}.jpg`;
  const noImage = `${baseImageSrc}/noimage.png`;

  const innerWidth = window.innerWidth;
  const factorDivisor = mobile ? 2.21 : tablet ? 4.32 : 6.48;
  const ancho = innerWidth / factorDivisor;
  // const width = 250;
  const height = 220;

  return (
    <Box
      minWidth={ancho}
      maxWidth={ancho}
      minHeight={height}
      border={2}
      borderColor="gray"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      onClick={() => navigate(`/modelos/${producto.referencia}`)}
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
            src={srcImage}
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
          <Typography variant="body1" align="center">
            {producto.descripcion}
          </Typography>
        </Box>
        <Box p={1}>
          <Typography variant="body1" align="center">
            <strong>{`Nº referencias: ${producto.total}`}</strong>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default ItemCatalogo;
