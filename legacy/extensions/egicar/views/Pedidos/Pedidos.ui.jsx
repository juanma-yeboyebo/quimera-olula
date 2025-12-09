import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useCallback, useEffect } from "react";

function Pedidos({ codigoOrdenProp, idPedido, idTareaProp, useStyles }) {
  const [{ codigoOrden, idTarea, pedidos }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: { codigoOrdenProp, idPedido, idTareaProp },
    });
  }, [codigoOrdenProp]);

  useEffect(() => {
    dispatch({
      type: "onIdPedidosProp",
      payload: { id: idPedido ? parseInt(idPedido, 10) : "" },
    });
  }, [idPedido]);

  const callbackPedidoCambiado = useCallback(
    payload => dispatch({ type: "onPedidosItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="Pedidos">
      <QMasterDetail
        MasterComponent={<Quimera.SubView id="Pedidos/PedidosMaster" idPedido={idPedido} />}
        DetailComponent={
          <Quimera.View
            id="Pedido"
            urlAtrasProp={
              idTarea
                ? `tareas/tareasterminal/${idTarea}`
                : codigoOrden
                  ? `ordenesprod/${codigoOrden}`
                  : null
            }
            initPedido={pedidos.dict[pedidos.current]}
            idPedido={pedidos.current}
            callbackChanged={callbackPedidoCambiado}
          />
        }
        loading={pedidos.loading}
        variant={codigoOrden ? "onlydetail" : "partida_vertical"}
        current={pedidos.current}
      />
    </Quimera.Template>
  );
}

export default Pedidos;
