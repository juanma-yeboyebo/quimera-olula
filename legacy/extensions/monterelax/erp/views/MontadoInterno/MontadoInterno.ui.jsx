import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

function MontadoInterno({ idUnidad, useStyles }) {
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
    util.appDispatch({ type: "setNombrePaginaActual", payload: { nombre: "Montado Interno" } });

    return () => util.appDispatch({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [dispatch]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !unidades.current);
  const detalleVisible = desktop || (mobile && unidades.current);

  return (
    <Quimera.Template id="MontadoInterno">
      {/* <Box className={classes.counterBox} display='flex' width={1} justifyContent='flex-end'>
        <Typography style={{marginRight: '15px'}} ><strong>Tareas de montado terminadas: { contador }</strong></Typography>
      </Box> */}
      <Box mx={desktop ? 0.5 : 0}>
        <Box width={1} display="flex">
          {masterVisible && <Quimera.SubView id="MontadoInterno/MontadoInternoMaster" />}
          {detalleVisible && <Quimera.SubView id="MontadoInterno/MontadoInternoDetalle" />}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default MontadoInterno;
