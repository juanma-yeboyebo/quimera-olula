import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

function DashboardTesoreria() {
  const [{ fechaCurrent }, dispatch] = useStateValue();
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && fechaCurrent === null);
  const detalleVisible = desktop || (mobile && fechaCurrent !== null);

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({ type: "onInit" });
    util.getSetting("appDispatch")({
      type: "setNombrePaginaActual",
      payload: { nombre: "Dashboard Tesoreria" },
    });

    return () =>
      util.getSetting("appDispatch")({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [dispatch]);

  return (
    <Quimera.Template id="DashboardTesoreria">
      <Box mx={desktop ? 0.5 : 0}>
        <Box width={1} display="flex">
          {masterVisible && <Quimera.SubView id="DashboardTesoreria/TesoreriaMaster" />}
          {detalleVisible && <Quimera.SubView id="DashboardTesoreria/TesoreriaDetalle" />}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default DashboardTesoreria;
