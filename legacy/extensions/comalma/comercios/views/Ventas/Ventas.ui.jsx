import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React, { useCallback, useEffect } from "react";

function Ventas({ idVenta, useStyles }) {
  const [{ ventas }, dispatch] = useStateValue();
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: "onCargaTamaño",
      payload: {
        escritorio: !mobile,
      },
    });
  }, [mobile]);

  useEffect(() => {
    dispatch({
      type: "onIdVentasProp",
      payload: { id: idVenta ? parseInt(idVenta) : "" },
    });
  }, [idVenta]);

  const callbackPedidoCambiado = useCallback(
    payload => dispatch({ type: "onVentasItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="Ventas">
      <QMasterDetail
        MasterComponent={<Quimera.SubView id="Ventas/VentasMaster" idVenta={idVenta} />}
        DetailComponent={
          <Quimera.View
            id="Venta"
            initVenta={ventas.dict[ventas.current]}
            idVenta={ventas.current}
            callbackChanged={callbackPedidoCambiado}
          />
        }
        current={ventas.current}
      />
    </Quimera.Template>
  );
}

export default Ventas;
