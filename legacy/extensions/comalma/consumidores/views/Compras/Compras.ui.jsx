import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useCallback, useEffect } from "react";

function Compras({ idCompra, useStyles }) {
  const [{ compras }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: "onIdComprasProp",
      payload: { id: idCompra ? parseInt(idCompra) : "" },
    });
  }, [idCompra]);

  const callbackPedidoCambiado = useCallback(
    payload => dispatch({ type: "onComprasItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="Compras">
      <QMasterDetail
        MasterComponent={<Quimera.SubView id="Compras/ComprasMaster" idCompra={idCompra} />}
        DetailComponent={
          <Quimera.View
            id="Compra"
            initCompra={compras.dict[compras.current]}
            idCompra={compras.current}
            callbackChanged={callbackPedidoCambiado}
          />
        }
        current={compras.current}
      />
    </Quimera.Template>
  );
}

export default Compras;
