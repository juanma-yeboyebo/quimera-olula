import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useCallback, useEffect } from "react";

function Inventarios({ codInventario, useStyles }) {
  const [{ inventarios }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: "onIdInventariosProp",
      payload: { id: codInventario ? codInventario : "" },
    });
  }, [codInventario]);

  const callbackInventarioCambiado = useCallback(
    payload => dispatch({ type: "onInventariosItemChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="Inventarios">
      <QMasterDetail
        MasterComponent={
          <Quimera.SubView id="Inventarios/InventariosMaster" codInventario={codInventario} />
        }
        DetailComponent={
          <Quimera.View
            id="Inventario"
            initInventario={inventarios.dict[inventarios.current]}
            codInventario={inventarios.current}
            callbackChanged={callbackInventarioCambiado}
          />
        }
        current={inventarios.current}
      />
    </Quimera.Template>
  );
}

export default Inventarios;
