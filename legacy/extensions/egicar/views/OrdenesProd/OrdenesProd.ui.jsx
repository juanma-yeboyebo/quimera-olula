import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useCallback, useEffect } from "react";

function OrdenesProd({ codOrdenProp, idTareaProp, useStyles }) {
  const [{ idTarea, ordenes }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: { idTareaProp, codOrdenProp },
    });
  }, [idTareaProp]);

  useEffect(() => {
    dispatch({
      type: "onIdOrdenesProp",
      payload: { id: codOrdenProp ? codOrdenProp : "" },
    });
  }, [codOrdenProp]);

  const callbackOrdenCambiado = useCallback(
    payload => dispatch({ type: "onOrdenesItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="OrdenesProd">
      <QMasterDetail
        MasterComponent={
          <Quimera.SubView id="OrdenesProd/OrdenesProdMaster" codOrden={codOrdenProp} />
        }
        DetailComponent={
          <Quimera.View
            id="OrdenProd"
            initOrden={ordenes.dict[ordenes.current]}
            codOrden={ordenes.current}
            callbackChanged={callbackOrdenCambiado}
            urlAtrasProp={idTarea ? `tareas/tareasterminal/${idTarea}` : null}
            idTareaProp={idTarea}
          />
        }
        loading={ordenes.loading}
        current={ordenes.current}
        variant={idTarea ? "onlydetail" : "partida_vertical"}
      />
    </Quimera.Template>
  );
}

export default OrdenesProd;
