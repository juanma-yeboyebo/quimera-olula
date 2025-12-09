import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

function CosidoInterno({ idUnidad, useStyles }) {
  const [{ unidades }, dispatch] = useStateValue();
  const classes = useStyles();

  useEffect(() => {
    dispatch({
      type: "onIdUnidadesProp",
      payload: { id: idUnidad },
    });
  }, [idUnidad]);

  useEffect(() => {
    dispatch({ type: "onInit" });
  }, [dispatch]);

  useEffect(() => {
    util.appDispatch({ type: "setNombrePaginaActual", payload: { nombre: "Cosido Interno" } });

    return () => util.appDispatch({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [dispatch]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !unidades.current);
  const detalleVisible = desktop || (mobile && unidades.current);

  return (
    <Quimera.Template id="CosidoInterno">
      {/* <Box className={classes.counterBox} display='flex' width={1} justifyContent='flex-end'>
        <Typography style={{marginRight: '15px'}} ><strong>Tareas de Cosido terminadas: { contador }</strong></Typography>
      </Box> */}
      <Box mx={desktop ? 0.5 : 0}>
        <Box width={1} display="flex">
          {masterVisible && <Quimera.SubView id="CosidoInterno/CosidoInternoMaster" />}
          {detalleVisible && <Quimera.SubView id="CosidoInterno/CosidoInternoDetalle" />}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default CosidoInterno;
