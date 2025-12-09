import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import { useEffect } from "react";

function MisPedidos({ idPedido }) {
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
    <Quimera.Template id="MisPedidos">
      <Box mx={desktop ? 0.5 : 0}>
        <Box width={1} display="flex">
          {masterVisible && <Quimera.SubView id="MisPedidos/MisPedidosMaster" />}
          {detalleVisible && <Quimera.SubView id="MisPedidos/MisPedidosDetalle" />}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default MisPedidos;
