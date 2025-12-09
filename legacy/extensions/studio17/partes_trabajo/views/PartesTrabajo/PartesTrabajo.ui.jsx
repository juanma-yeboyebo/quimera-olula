import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useCallback, useEffect } from "react";

function PartesTrabajo({ codParte, useStyles }) {
  const [{ partes }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: "onIdPartesProp",
      payload: { id: codParte ? codParte : "" },
    });
  }, [codParte]);

  const callbackParteCambiado = useCallback(
    payload => dispatch({ type: "onPartesItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="PartesTrabajo">
      <QMasterDetail
        MasterComponent={<Quimera.SubView id="PartesTrabajo/Master" codParte={codParte} />}
        DetailComponent={
          <Quimera.View
            id="ParteTrabajo"
            initParte={partes.dict[partes.current]}
            codParte={partes.current}
            callbackChanged={callbackParteCambiado}
          />
        }
        current={partes.current}
      />
    </Quimera.Template>
  );
}

export default PartesTrabajo;
