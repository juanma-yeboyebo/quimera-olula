import { Box, Container } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

function InformeClientesComparativa({ idClienteProp, useStyles }) {
  const [{ idCliente }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    dispatch({ type: "init", payload: { idClienteProp } });
  }, [dispatch, idClienteProp]);

  useEffect(() => {
    util.getSetting("appDispatch")({
      type: "setNombrePaginaActual",
      payload: { nombre: `${idCliente ? "Comparativa artículos" : "Comparativa clientes"}` },
    });

    return () =>
      util.getSetting("appDispatch")({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [dispatch, idCliente]);

  return (
    <Quimera.Template id="InformeClientesComparativa">
      <Container className={classes.container} disableGutters={width === "xs" || width === "sm"}>
        {!idCliente ? (
          <Box>
            <Quimera.SubView id="InformeClientesComparativa/ComparativaClientes" />
          </Box>
        ) : (
          <Box>
            <Quimera.SubView id="InformeClientesComparativa/ComparativaArticulos" />
          </Box>
        )}
      </Container>
    </Quimera.Template>
  );
}

export default InformeClientesComparativa;
