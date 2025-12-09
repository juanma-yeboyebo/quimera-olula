import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useCallback, useEffect } from "react";

function GenerarPreparaciones({ idPedido, useStyles }) {
  const [{ modalAgruparPedidosGenerarPreparaciones, pedidosGenerarPreparaciones }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: "onIdPedidosGenerarPreparacionesProp",
      payload: { id: idPedido ? parseInt(idPedido) : "" },
    });
  }, [idPedido]);

  const callbackPedidoCambiado = useCallback(
    payload => dispatch({ type: "onPedidosGenerarPreparacionesItemChanged", payload }),
    [],
  );

  const mobile = true;
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !pedidosGenerarPreparaciones.current);
  const detalleVisible = desktop || (mobile && pedidosGenerarPreparaciones.current);

  return (
    <Quimera.Template id="GenerarPreparaciones">
      {masterVisible && (
        <Quimera.SubView id="GenerarPreparaciones/PedidosMaster" idPedido={idPedido} />
      )}
      {detalleVisible && (
        <Quimera.View
          id="PedidoGenerarPreparaciones"
          initPedido={pedidosGenerarPreparaciones.dict[pedidosGenerarPreparaciones.current]}
          idPedido={pedidosGenerarPreparaciones.current}
          callbackChanged={callbackPedidoCambiado}
        />
      )}
      {/* <QMasterDetail
        MasterComponent={
          <Quimera.SubView id="GenerarPreparaciones/PedidosMaster" idPedido={idPedido} />
        }
        DetailComponent={
          <Quimera.View
            id="PedidoGenerarPreparaciones"
            initPedido={pedidosGenerarPreparaciones.dict[pedidosGenerarPreparaciones.current]}
            callbackChanged={callbackPedidoCambiado}
          />
        }
        current={pedidosGenerarPreparaciones.current}
      /> */}

      {modalAgruparPedidosGenerarPreparaciones && (
        <Quimera.SubView
          id="GenerarPreparaciones/AgruparPedidos"
          callbackVolver={() => dispatch({ type: "cerrarModalAgruparPedidosGenerarPreparaciones" })}
        />
      )}
    </Quimera.Template>
  );
}

export default GenerarPreparaciones;
