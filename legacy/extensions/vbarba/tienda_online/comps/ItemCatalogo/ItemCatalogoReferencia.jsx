import { Box, Button, Field, Icon, IconButton } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Typography, useTranslation } from "@quimera/thirdparty";
import { useAppValue, useStateValue, util } from "quimera";
import { useState } from "react";

import { ChipNoDisponible } from "../../comps";

const useStyles = makeStyles(theme => ({
  logo: {
    marginTop: "0px",
  },
  pvp: {},
  buttonComprar: {
    paddingRight: "4px",
  },
  icon: {
    paddingLeft: "0px"
  },
}));

function ItemCatalogoReferencia({ model, modelName, ...props }) {
  const [cantidad, setCantidad] = useState(1);
  const [validation, setValidation] = useState({ error: false, helperText: "" });
  const [_, dispatch] = useStateValue();
  const [{ carrito }] = useAppValue();
  const classes = useStyles();
  const guest = util.getUser().user === "guest";
  const { t } = useTranslation();

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
  // console.log(util.formatter(model.pvp));
  // const ref = String(Math.round(model.pvp * 100)).split("").reverse().join("");
  // console.log(ref);
  const strPvp = String(util.euros(model.pvpReferencia));
  // const refInvertida = "Ref " + strPvp.substring(0, strPvp.length - 2).replace(",", ".").split("").reverse().join("");
  const refInvertida = "";

  return (
    <Box px={1} pb={0}>
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" px={0} pt={1} pb={0} pr={0.5}>
        <Box display="flex" alignItems="flex-start" >
          <Icon fontSize="small" className={classes.logo}>open_in_full</Icon>
          <Box pl={0.4}></Box>
          <Box display="flex" flexDirection="row" justifyContent="space-between" pt={0.3}>
            <Typography component="span" variant="body2" color="textPrimary">
              {`${model.litraje || ""}`} {`${model.forma || ""}`} {`${model.altura || ""}`} {`${model.perimetro || ""}`}
            </Typography>
            {/* {!guest && ( */}
            <Box pl={1}>
              <Typography component="span" variant="body2" color="textPrimary">
                {refInvertida}
              </Typography>
            </Box>
            {/* )} */}
          </Box>
        </Box>
        {!guest && (
          <Typography component="span" variant="body1" color="textPrimary" className={classes.pvp}>
            {`${util.euros(model.pvp)}`}
          </Typography>
        )}
      </Box>
      <Box display="flex" alignItems="flex-start" >
        <Box pl={0.4}></Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between" pt={0.3}>
          <Typography component="span" variant="body2" color="textPrimary">
            {`${model.nombre3 || ""}`} {`${model.nombre4 || ""}`}
          </Typography>
        </Box>
      </Box>
      {!model.disponible && (
        <Box pt={1} pb={1} display="flex" justifyContent="flex-end" >
          <ChipNoDisponible />
        </Box>
      )}
      {!guest && (
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={-1}>
          <Box display="flex" alignItems="flex-start" justifyContent={"center"}>
            <IconButton id="resta" onClick={() => handleSumaClicked(-1)} className={classes.icon}>
              <Icon fontSize="small" color="secondary">
                remove_circle_outline
              </Icon>
            </IconButton>
            <Box maxWidth={50}>
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
          <Button
            id="save"
            variant="text"
            color="primary"
            startIcon={<Icon>shopping_cart</Icon>}
            className={classes.buttonComprar}
            onClick={() =>
              dispatch({
                type: "onAnadirProductoACarritoClicked",
                payload: {
                  referencia: model.referencia,
                  cantidad,
                  idCarrito: carrito.idCarrito,
                },
              })
            }
            disabled={!cantidad || validation.error}
            text={t("itemCatalogo.comprar")}
          />
        </Box>
      )}
      {/* : <Box pt={0.5}>
        <Chip label="NO DISPONIBLE" color="warning" />
      </Box> }*/}
    </Box>
  );
}

export default ItemCatalogoReferencia;
