import { Box, Grid, QListItemModel, QSection } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Typography } from "@quimera/thirdparty";
import { SelectorValores } from "@quimera-extension/base-almacen";
import { useStateValue, useWidth } from "quimera";
import React, { useEffect, useState } from "react";

// import { SelectorValores } from "../../comps";

const useStyles = makeStyles(theme => ({
  card: {
    borderTop: `2px solid ${theme.palette.grey[200]}`,
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
  numVerde: {
    color: "#228b22",
    fontWeight: "1000",
  },
  numRojo: {
    color: theme.palette.error.main,
    fontWeight: "1000",
  },
  neutro: {
    backgroundColor: "inherit",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // border: "1px solid blue",
    justifyContent: "center",
  },
  entradaPositiva: {
    backgroundColor: theme.palette.success.light,
    alignItems: "center",
  },
  salidaPositiva: {
    backgroundColor: theme.palette.error.light,
    alignItems: "center",
  },
}));

function calculaColorSaldo(saldo) {
  const clase = "numRojo";
  if (saldo && saldo > 0) {
    return "numVerde";
  }

  return clase;
}

// function calculaColorSalida(salida) {
//   if (salida && salida > 0) {
//     return "numRojo";
//   }

//   return;
// }

function ListItemParteCarro({ renderAvatar, model, modelName, disabled = false, selected = false, funSecondaryLeft, avatar = "P", ...props }) {
  const classes = useStyles();
  const tipoCarro = model;
  const [{ resetOpen }] = useStateValue();
  const [openEntrada, setOpenEntrada] = useState(false);
  const [openSalida, setOpenSalida] = useState(false);

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const tablet = ["md"].includes(width);

  const estilosEntrada = {
    box: {
      activada: classes.neutro,
      desactivada: tipoCarro.entrada > 0 ? classes.entradaPositiva : classes.neutro,
      inhabilitada: tipoCarro.entrada > 0 ? classes.entradaPositiva : classes.neutro,
    },
  };

  const estilosSalida = {
    box: {
      activada: classes.neutro,
      desactivada: tipoCarro.salida > 0 ? classes.salidaPositiva : classes.neutro,
      inhabilitada: tipoCarro.salida > 0 ? classes.salidaPositiva : classes.neutro,
    },
  };

  const arrayCarros = [];
  for (let i = 0; i <= 100; i++) {
    arrayCarros[i] = i;
  }

  useEffect(() => {
    setOpenEntrada(false);
    setOpenSalida(false);
  }, [tipoCarro.idCarro, resetOpen]);

  function compEntradaSalida(tipo) {
    return (
      <Box width={1}>
        <QSection
          title={`${tipo}: ${tipo === "entrada" ? tipoCarro.entrada : tipoCarro.salida}`}
          actionPrefix={`tipoCarro/${tipo}`}
          mr={1}
          estilos={tipo === "entrada" ? estilosEntrada : estilosSalida}
          alwaysInactive={disabled}
          activation={{
            active: selected && (tipo === "entrada" ? openEntrada : openSalida),
            setActive: value => (tipo === "entrada" ? setOpenEntrada(value) : setOpenSalida(value)),
          }}
          dynamicComp={desactivar => (
            <Grid container justifyContent="center">
              <Grid item xs={12}>
                <SelectorValores
                  id={`${tipo}TipoCarro`}
                  valores={arrayCarros}
                  value={tipo === "entrada" ? tipoCarro.entrada : tipoCarro.salida}
                  variant={"outlined"}
                  index={tipoCarro.codigo}
                  fullWidth
                  desactivar={desactivar}
                ></SelectorValores>
              </Grid>
            </Grid>
          )}
          save={{
            display: "none",
          }}
          cancel={{
            display: "none",
          }}
        >
          <></>
        </QSection>
      </Box>
    );
  }

  return (
    <QListItemModel modelName={modelName} model={tipoCarro} selected={selected}>
      <Box
        width={1}
        display={"flex"}
        flexDirection={mobile ? "column" : "row"}
        justifyContent={"space-between"}
      >
        <Box width={1} display={"flex"} justifyContent={"space-between"}>
          <Box display={"flex"} flexDirection={"column"} justifyContent={"space-between"}>
            <Typography variant="body1">{`${tipoCarro.descripcion}`}</Typography>
            <Box display="flex" style={{ gap: 4 }}>
              <Typography variant="body2">{`SALDO ANTES: `}</Typography>
              <Typography
                variant="body2"
                className={classes[calculaColorSaldo(tipoCarro.saldo_antes)]}
              >
                {tipoCarro.saldo_antes}
              </Typography>
            </Box>
          </Box>
          {mobile && (
            <Box display={"flex"} flexDirection={"column"} justifyContent={"flex-end"}>
              <Box display="flex" style={{ gap: 4 }}>
                <Typography variant="body2">{`SALDO DESPUÉS: `}</Typography>
                <Typography
                  variant="body2"
                  className={classes[calculaColorSaldo(tipoCarro.saldo_despues)]}
                >
                  {tipoCarro.saldo_despues}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
        {mobile ? (
          <Box width={1} display={"flex"} alignItems={"flex-end"} justifyContent={"flex-end"}>
            {compEntradaSalida("entrada")}
            {compEntradaSalida("salida")}
          </Box>
        ) : (
          <>
            {compEntradaSalida("entrada")}
            {compEntradaSalida("salida")}
          </>
        )}

        {!mobile && (
          <Box display={"flex"} alignItems={"flex-end"} justifyContent={"flex-end"} width={1}>
            <Box display="flex" style={{ gap: 4 }}>
              <Typography variant="body2">{`SALDO DESPUÉS: `}</Typography>
              <Typography
                variant="body2"
                className={classes[calculaColorSaldo(tipoCarro.saldo_despues)]}
              >
                {tipoCarro.saldo_despues}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </QListItemModel>
  );
}

export default ListItemParteCarro;
