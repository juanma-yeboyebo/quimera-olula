import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React, { useCallback, useEffect } from "react";

function MisFacturas({ idFactura, useStyles }) {
  const [{ facturas }, dispatch] = useStateValue();
  // const _c = useStyles()

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdFacturasProp",
      payload: { id: idFactura ? parseInt(idFactura) : "" },
    });
  }, [idFactura]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;

  const callbackFacturaCambiado = useCallback(
    payload => dispatch({ type: "onFacturasItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="MisFacturas">
      <QMasterDetail
        MasterComponent={<Quimera.SubView id="FacturasMaster" idFactura={idFactura} />}
        DetailComponent={
          <Quimera.View
            id="MiFactura"
            initFactura={facturas.dict[facturas.current]}
            idFactura={facturas.current}
            callbackChanged={callbackFacturaCambiado}
          />
        }
        current={facturas.current}
      />
    </Quimera.Template>
  );
}

export default MisFacturas;
