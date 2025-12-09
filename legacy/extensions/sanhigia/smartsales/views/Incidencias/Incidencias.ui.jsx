import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import { useCallback, useEffect } from "react";

function Incidencias({ codIncidencia }) {
  const [{ incidencias }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdIncidenciasProp",
      payload: { id: codIncidencia ? codIncidencia : "" },
    });
  }, [dispatch, codIncidencia]);

  const callbackIncidenciaChanged = useCallback(
    payload => dispatch({ type: "onIncidenciasItemChanged", payload }),
    [dispatch],
  );

  // console.log("????????????", codIncidencia, incidencias?.current);

  return (
    <Quimera.Template id="Incidencias">
      <QMasterDetail
        MasterComponent={
          <Quimera.SubView id="Incidencias/MasterIncidencias" codIncidencia={codIncidencia} />
        }
        DetailComponent={
          <Quimera.View
            id="Incidencia"
            initIncidencia={incidencias.dict[incidencias.current]}
            codIncidencia={codIncidencia}
            callbackChanged={callbackIncidenciaChanged}
          />
        }
        current={incidencias.current}
      />
    </Quimera.Template>
  );
}

export default Incidencias;
