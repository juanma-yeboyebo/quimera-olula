import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useCallback, useEffect } from "react";

function Campanas({ idCampana, useStyles }) {
  const [{ campanas }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: "onIdCampanasProp",
      payload: { id: idCampana ? parseInt(idCampana) : "" },
    });
  }, [idCampana]);

  const callbackPedidoCambiado = useCallback(
    payload => dispatch({ type: "onCampanasItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="Campanas">
      <QMasterDetail
        MasterComponent={<Quimera.SubView id="Campanas/CampanasMaster" idCampana={idCampana} />}
        DetailComponent={
          <Quimera.View
            id="Campana"
            initCampana={campanas.dict[campanas.current]}
            idCampana={campanas.current}
            callbackChanged={callbackPedidoCambiado}
          />
        }
        current={campanas.current}
      />
    </Quimera.Template>
  );
}

export default Campanas;
