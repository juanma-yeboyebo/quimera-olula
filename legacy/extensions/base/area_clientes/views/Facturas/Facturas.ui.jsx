import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React, { useEffect } from "react";

function Facturas({ idFactura, useStyles }) {
  const [{ facturas }, dispatch] = useStateValue();
  // const _c = useStyles()

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdFacturasProp",
      payload: { id: idFactura ? parseInt(idFactura) : "" },
    });
  }, [idFactura]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  // const masterVisible = desktop || (mobile && !facturas.current);
  const masterVisible = true;
  const detalleVisible = desktop || (mobile && facturas.current);

  return (
    <Quimera.Template id="Facturas">
      <Box mx={desktop ? 0.5 : 0}>
        <Box width={1} display="flex">
          {masterVisible && <Quimera.SubView id="Facturas/FacturasMaster" />}
          {/* {detalleVisible && <Quimera.SubView id="Facturas/FacturaDetalle" />} */}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default Facturas;
