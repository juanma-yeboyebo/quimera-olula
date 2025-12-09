import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useCallback, useEffect } from "react";

function Comercios({ idComercio, useStyles }) {
  const [{ comercios }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: "onIdComerciosProp",
      payload: { id: idComercio ? parseInt(idComercio) : "" },
    });
  }, [idComercio]);

  const callbackPedidoCambiado = useCallback(
    payload => dispatch({ type: "onComerciosItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="Comercios">
      <QMasterDetail
        MasterComponent={<Quimera.SubView id="Comercios/ComerciosMaster" idComercio={idComercio} />}
        DetailComponent={
          <Quimera.View
            id="Comercio"
            initComercio={comercios.dict[comercios.current]}
            idComercio={comercios.current}
            callbackChanged={callbackPedidoCambiado}
          />
        }
        current={comercios.current}
      />
    </Quimera.Template>
  );
}

export default Comercios;
