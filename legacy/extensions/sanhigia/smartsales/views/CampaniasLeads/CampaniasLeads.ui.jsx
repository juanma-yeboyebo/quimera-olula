import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import { useCallback, useEffect } from "react";

function CampaniasLeads({ idCampania }) {
  const [{ campaniasLeads }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdCampaniasLeadsProp",
      payload: { id: idCampania ? parseInt(idCampania) : "" },
    });
  }, [dispatch, idCampania]);

  const callbackCampaniaChanged = useCallback(
    payload => dispatch({ type: "onCampaniasLeadsItemChanged", payload }),
    [dispatch],
  );

  return (
    <Quimera.Template id="CampaniasLeads">
      <QMasterDetail
        MasterComponent={
          <Quimera.SubView id="CampaniasLeads/MasterCampaniasLeads" idCampania={idCampania} />
        }
        DetailComponent={
          <Quimera.View
            id="Campania"
            initCampania={campaniasLeads.dict[campaniasLeads.current]}
            callbackChanged={callbackCampaniaChanged}
            origen="leadpacientes"
          />
        }
        current={campaniasLeads.current}
      />
    </Quimera.Template>
  );
}

export default CampaniasLeads;
