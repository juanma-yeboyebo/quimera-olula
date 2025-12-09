import { QMasterDetail } from "@quimera/comps";
import Quimera, { useStateValue } from "quimera";
import { useCallback, useEffect } from "react";

function AlbaranesCli({ idAlbaran, useStyles }) {
  const [{ albaranes }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: "onIdAlbaranesProp",
      payload: { id: idAlbaran ? parseInt(idAlbaran) : "" },
    });
  }, [idAlbaran]);

  const callbackAlbaranCambiado = useCallback(
    payload => dispatch({ type: "onAlbaranesItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="AlbaranesCli">
      <QMasterDetail
        MasterComponent={
          <Quimera.SubView id="AlbaranesCli/AlbaranesMaster" idAlbaran={idAlbaran} />
        }
        DetailComponent={
          <Quimera.View
            id="AlbaranCli"
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

export default AlbaranesCli;
