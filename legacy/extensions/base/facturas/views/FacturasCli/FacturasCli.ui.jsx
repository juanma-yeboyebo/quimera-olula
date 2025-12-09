import { QMasterDetail } from "@quimera/comps";
import Quimera, { useStateValue } from "quimera";
import { useCallback, useEffect } from "react";

function FacturasCli({ idFactura, useStyles }) {
  const [{ facturas }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: "onIdFacturasProp",
      payload: { id: idFactura ? parseInt(idFactura) : "" },
    });
  }, [idFactura]);

  const callbackFacturaCambiado = useCallback(
    payload => dispatch({ type: "onFacturasItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="FacturasCli">
      <QMasterDetail
        MasterComponent={<Quimera.SubView id="FacturasCli/FacturasMaster" idFactura={idFactura} />}
        DetailComponent={
          <Quimera.View
            id="FacturaCli"
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

export default FacturasCli;
