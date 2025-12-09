import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import { useCallback, useEffect } from "react";

function PresupuestosCli({ idPresupuesto }) {
  const [{ presupuestos }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: "onIdPresupuestosProp",
      payload: { id: idPresupuesto ? parseInt(idPresupuesto) : "" },
    });
  }, [idPresupuesto]);

  const callbackPresupuestoCambiado = useCallback(
    payload => dispatch({ type: "onPresupuestosItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="PresupuestosCli">
      <QMasterDetail
        MasterComponent={
          <Quimera.SubView id="PresupuestosCli/Master" idPresupuesto={idPresupuesto} />
        }
        DetailComponent={
          <Quimera.View
            id="PresupuestoCli"
            initPresupuesto={presupuestos.dict[presupuestos.current] ?? undefined}
            idPresupuesto={presupuestos.current}
            callbackChanged={callbackPresupuestoCambiado}
          />
        }
        current={presupuestos.current}
      />
    </Quimera.Template>
  );
}

export default PresupuestosCli;
