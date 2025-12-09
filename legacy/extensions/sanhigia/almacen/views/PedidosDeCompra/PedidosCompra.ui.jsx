import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useCallback, useEffect } from "react";

function PedidosCompra({ idPedido, useStyles }) {
  const [{ pedidosProv }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: "onIdPedidosProvProp",
      payload: { id: idPedido ? parseInt(idPedido) : "" },
    });
  }, [idPedido]);

  const callbackPedidoCambiado = useCallback(
    payload => dispatch({ type: "onPedidosProvItemChanged", payload }),
    [],
  );

  const mobile = true;
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !pedidosProv.current);
  const detalleVisible = desktop || (mobile && pedidosProv.current);

  return (
    <Quimera.Template id="PedidosCompra">
      {masterVisible && (
        <Quimera.SubView id="PedidosDeCompra/PedidosCompraMaster" idPedido={idPedido} />
      )}
      {detalleVisible && (
        <Quimera.View
          id="PedidoCompra"
          initPedido={pedidosProv.dict[pedidosProv.current]}
          idPedido={pedidosProv.current}
          callbackChanged={callbackPedidoCambiado}
        />
      )}
      {/* <QMasterDetail
        MasterComponent={
          <Quimera.SubView id="PedidosDeCompra/PedidosCompraMaster" idPedido={idPedido} />
        }
        DetailComponent={
          <Quimera.View
            id="PedidoCompra"
            initPedido={pedidos.dict[pedidos.current]}
            callbackChanged={callbackPedidoCambiado}
          />
        }
        current={pedidos.current}
      /> */}
    </Quimera.Template>
  );
}

export default PedidosCompra;
