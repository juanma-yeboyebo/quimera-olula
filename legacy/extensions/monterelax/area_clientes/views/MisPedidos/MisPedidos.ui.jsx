import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React, { useCallback, useEffect } from "react";

function MisPedidos({ idPedido, useStyles }) {
  const [{ pedidos }, dispatch] = useStateValue();
  // const _c = useStyles()

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
  }, [idPedido]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;

  const callbackPedidoCambiado = useCallback(
    payload => dispatch({ type: "onPedidosItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="MisPedidos">
      <QMasterDetail
        MasterComponent={<Quimera.SubView id="PedidosMaster" idPedido={idPedido} />}
        DetailComponent={
          <Quimera.View
            id="MiPedido"
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

export default MisPedidos;
