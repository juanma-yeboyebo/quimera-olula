import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

function PedidosCliente({ idPedido }) {
  const [{ pedidos }, dispatch] = useStateValue();
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !pedidos.current);
  const detalleVisible = desktop || (mobile && pedidos.current);

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdPedidosProp",
      payload: { id: idPedido ? parseInt(idPedido) : "" },
    });
  }, [dispatch, idPedido]);

  useEffect(() => {
    dispatch({ type: "onInit" });
    util.getSetting("appDispatch")({
      type: "setNombrePaginaActual",
      payload: { nombre: "Mis Pedidos" },
    });

    return () =>
      util.getSetting("appDispatch")({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [dispatch]);

  return (
    <Quimera.Template id="PedidosCliente">
      <Box mx={desktop ? 0.5 : 0}>
        <Box width={1} display="flex">
          {masterVisible && <Quimera.SubView id="PedidosCliente/PedidosMaster" />}
          {detalleVisible && <Quimera.SubView id="PedidosCliente/PedidosDetalle" />}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default PedidosCliente;
