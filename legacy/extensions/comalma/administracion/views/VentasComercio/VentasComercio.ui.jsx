import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React, { useCallback, useEffect } from "react";

function VentasComercio({ idVenta, idComercio, useStyles }) {
  const [{ ventasComercio }, dispatch] = useStateValue();
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: { idComercio: idComercio ? parseInt(idComercio) : "" },
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
      type: "onIdVentasComercioProp",
      payload: { id: idVenta ? parseInt(idVenta) : "" },
    });
  }, [idVenta]);

  const callbackPedidoCambiado = useCallback(
    payload => dispatch({ type: "onVentasComercioItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="VentasComercio">
      <QMasterDetail
        MasterComponent={
          <Quimera.SubView id="VentasComercio/VentasComercioMaster" idVenta={idVenta} />
        }
        DetailComponent={
          <Quimera.View
            id="VentaComercio"
            initVentaComercio={ventasComercio.dict[ventasComercio.current]}
            idVenta={ventasComercio.current}
            callbackChanged={callbackPedidoCambiado}
          />
        }
        current={ventasComercio.current}
      />
    </Quimera.Template>
  );
}

export default VentasComercio;
