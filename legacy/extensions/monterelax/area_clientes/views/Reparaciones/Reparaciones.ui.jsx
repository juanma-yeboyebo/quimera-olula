import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import { useCallback, useEffect } from "react";

function Reparaciones({ idReparacion }) {
  const [{ reparaciones }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdReparacionesProp",
      payload: { id: idReparacion ? idReparacion : "" },
    });
  }, [dispatch, idReparacion]);

  const callbackReparacionChanged = useCallback(
    payload => dispatch({ type: "onReparacionesItemChanged", payload }),
    [dispatch],
  );

  // console.log("????????????", idReparacion, reparaciones?.current);

  return (
    <Quimera.Template id="Reparaciones">
      <QMasterDetail
        MasterComponent={
          <Quimera.SubView id="Reparaciones/MasterReparaciones" idReparacion={idReparacion} />
        }
        DetailComponent={
          <Quimera.View
            id="Reparacion"
            initReparacion={reparaciones.dict[reparaciones.current]}
            callbackChanged={callbackReparacionChanged}
          />
        }
        current={reparaciones.current}
      />
    </Quimera.Template>
  );
}

export default Reparaciones;
