import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React, { useCallback, useEffect } from "react";

function MisAlbaranes({ idAlbaran, useStyles }) {
  const [{ albaranes }, dispatch] = useStateValue();
  // const _c = useStyles()

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdAlbaranesProp",
      payload: { id: idAlbaran ? parseInt(idAlbaran) : "" },
    });
  }, [idAlbaran]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  // const masterVisible = desktop || (mobile && !albaranes.current);
  // const detalleVisible = desktop || (mobile && albaranes.current);

  const callbackAlbaranCambiado = useCallback(
    payload => dispatch({ type: "onAlbaranesItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="MisAlbaranes">
      <QMasterDetail
        MasterComponent={<Quimera.SubView id="AlbaranesMaster" idAlbaran={idAlbaran} />}
        DetailComponent={
          <Quimera.View
            id="MiAlbaran"
            initAlbaran={albaranes.dict[albaranes.current]}
            idAlbaran={albaranes.current}
            callbackChanged={callbackAlbaranCambiado}
          />
        }
        current={albaranes.current}
      />
    </Quimera.Template>
  );
}

export default MisAlbaranes;
