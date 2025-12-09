import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useCallback, useEffect } from "react";

function PedidosCliOtrosAgentes({ idPedido, useStyles }) {
  const [{ pedidos }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: "onIdPedidosProp",
      payload: { id: idPedido ? parseInt(idPedido) : "" },
    });
  }, [idPedido]);

  const callbackPedidoCambiado = useCallback(
    payload => dispatch({ type: "onPedidosItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="PedidosCliOtrosAgentes">
      <QMasterDetail
        MasterComponent={
          <Quimera.SubView id="PedidosCliOtrosAgentes/PedidosMaster" idPedido={idPedido} />
        }
        DetailComponent={
          <Quimera.View
            id="PedidoCli"
            initPedido={pedidos.dict[pedidos.current]}
            idPedido={pedidos.current}
            callbackChanged={callbackPedidoCambiado}
          />
        }
        current={pedidos.current}
      />
    </Quimera.Template>
  );
}

export default PedidosCliOtrosAgentes;
