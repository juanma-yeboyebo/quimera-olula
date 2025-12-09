import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import { useEffect } from "react";

function MisReparaciones({ idReparacion }) {
  const [{ reparaciones }, dispatch] = useStateValue();
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !reparaciones.current);
  // const detalleVisible = desktop || (mobile && reparaciones.current)

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdReparacionesProp",
      payload: { id: idReparacion ? parseInt(idReparacion) : "" },
    });
  }, [dispatch, idReparacion]);

  useEffect(() => {
    dispatch({ type: "onInit" });
    util.getSetting("appDispatch")({
      type: "setNombrePaginaActual",
      payload: { nombre: "Mis Reparaciones" },
    });

    return () =>
      util.getSetting("appDispatch")({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [dispatch]);

  return (
    <Quimera.Template id="MisReparaciones">
      <Box mx={desktop ? 0.5 : 0}>
        <Box width={1} display="flex">
          {masterVisible && <Quimera.SubView id="MisReparaciones/MisReparacionesMaster" />}
          {/* { detalleVisible &&
            
          } */}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default MisReparaciones;
