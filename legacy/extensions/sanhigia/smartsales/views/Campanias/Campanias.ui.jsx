import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import { useCallback, useEffect } from "react";

function Campanias({ idCampania }) {
  const [{ campanias }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdCampaniasProp",
      payload: { id: idCampania ? parseInt(idCampania) : "" },
    });
  }, [dispatch, idCampania]);

  const callbackCampaniaChanged = useCallback(
    payload => dispatch({ type: "onCampaniasItemChanged", payload }),
    [dispatch],
  );

  return (
    <Quimera.Template id="Campanias">
      <QMasterDetail
        MasterComponent={<Quimera.SubView id="Campanias/MasterCampanias" idCampania={idCampania} />}
        DetailComponent={
          <Quimera.View
            id="Campania"
            initCampania={campanias.dict[campanias.current]}
            callbackChanged={callbackCampaniaChanged}
            origen="campania"
          />
        }
        current={campanias.current}
      />
    </Quimera.Template>
  );
}

export default Campanias;
