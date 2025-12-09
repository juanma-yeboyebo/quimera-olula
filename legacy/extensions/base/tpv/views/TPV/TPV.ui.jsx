import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useEffect } from "react";

import { TpvDb } from "../../lib";

function TPV({ idVenta }) {
  const [{ ventas }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdVentasProp",
      payload: { id: idVenta ? parseInt(idVenta) : "" },
    });
  }, [dispatch, idVenta]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !ventas.current);
  const detalleVisible = !!ventas.current;

  const getNewSync = () => {
    const noSincro = Object.values(ventas?.dict ?? {})
      .filter(v => !!v.cerrada && !v.sincronizada)
      .map(v => v.id);
    const ventasSincro = TpvDb.estanVentasSincronizadas(noSincro);
    dispatch({ type: "onSyncVentas", payload: { ventasSincro } });
  };

  useEffect(() => {
    const timer = setInterval(getNewSync, 25_000);

    return () => clearInterval(timer);
  }, [getNewSync]);

  return (
    <Quimera.Template id="TPV">
      <Box mx={desktop ? 0.5 : 0}>
        <Box width={1} display="flex">
          {masterVisible && <Quimera.SubView id="TPV/VentasMaster" />}
          {detalleVisible && <Quimera.SubView id="TPV/VentasDetalle" />}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default TPV;
