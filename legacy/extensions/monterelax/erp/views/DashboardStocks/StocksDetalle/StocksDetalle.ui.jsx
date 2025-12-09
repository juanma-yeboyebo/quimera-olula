import { Box, Button, Field, QBox } from "@quimera/comps";
import { clsx } from "@quimera/styles";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import React from "react";

function StocksDetalle({ useStyles }) {
  const [{ stocks, estadoCantidad, stocksPedido, cantidad }, dispatch] = useStateValue();
  const classes = useStyles();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const desktop = !mobile;

  const baseImageSrc = util.getEnvironment().getUrlImages();
  const noImage = `${baseImageSrc}/noimage.png`;

  return (
    <Quimera.Template id="StocksDetalle">
      {stocks.dict[stocks.current] && (
        <Box width={anchoDetalle} mx={desktop ? 1 : 0}>
          <QBox
            titulo={`${stocks.dict[stocks.current].modelo} ${stocks.dict[stocks.current].configuracion
              }`}
            botonesCabecera={mobile ? [{ id: "atras", icon: "arrow_back", disabled: false }] : []}
          >
            {/* { mobile &&
              <Box className={classes.container} display='flex' justifyContent='flex-start'>
                <Box className={clsx(classes.greenBox, classes.mobileBox)}>
                  { stocks.dict[stocks.current].canterminadas }
                </Box>
                <Box className={clsx(classes.yellowBox, classes.mobileBox)}>
                  { stocks.dict[stocks.current].cancosidas }
                </Box>
              </Box>
            } */}
            {stocksPedido.map(s => {
              if (s.id === stocks.current) {
                return (
                  <Box key={s.id} className={clsx(classes.container, classes.boldBox)}>
                    En el pedido: {s.cantidad}
                  </Box>
                );
              }
            })}
            <Box className={classes.container}>
              <Field.Text
                id={`stocks.dict.${stocks.current}.tela`}
                fullWidth
                label="Tela"
                disabled
              />
            </Box>
            <Box className={classes.container} display="flex" justifyContent="flex-start">
              <Box display="flex" alignItems="flex-end" justifyContent="flex-start">
                <Box
                  className={clsx(classes.greenBox, classes.mobileBox)}
                  display="flex"
                  alignItems="flex-end"
                  justifyContent="flex-start"
                >
                  {stocks.dict[stocks.current].canterminadas}
                </Box>
                <Box
                  className={clsx(classes.yellowBox, classes.mobileBox)}
                  display="flex"
                  alignItems="flex-end"
                  justifyContent="flex-start"
                >
                  {stocks.dict[stocks.current].cancosidas}
                </Box>
              </Box>
              <Box flexGrow={1}>
                <Field.Int
                  id="cantidad"
                  label="Cantidad"
                  error={estadoCantidad.error}
                  helperText={estadoCantidad.texto}
                  fullWidth
                />
              </Box>
              <Box display="flex" alignItems="flex-end" justifyContent="flex-end">
                <Button
                  id="agregar"
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  disabled={estadoCantidad.error || cantidad === 0}
                >
                  Añadir
                </Button>
              </Box>
            </Box>
            <Box
              mt={2}
              border={0}
              borderColor="blue"
              style={{ overflow: "hidden", gap: 10 }}
              display="flex"
              justifyContent="flex-end"
              bgColor="red"
              width={1}
            >
              <img
                src={`${baseImageSrc}/telas/${stocks.dict[stocks.current].tela}.jpg`}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = noImage;
                }}
                width={"50%"}
                alt="poner nombre"
                loading="lazy"
              />
              <img
                src={`${baseImageSrc}/modelos/${stocks.dict[
                  stocks.current
                ].modelo.toUpperCase()}.jpg`}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = noImage;
                }}
                width={"50%"}
                alt="poner nombre"
                loading="lazy"
              />
            </Box>
          </QBox>
        </Box>
      )}
    </Quimera.Template>
  );
}

export default StocksDetalle;
