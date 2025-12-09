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

  const mobile = true;
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !inventarios.current);
  const detalleVisible = desktop || (mobile && inventarios.current);

  return (
    <Quimera.Template id="Inventarios">
      {masterVisible && (
        <Quimera.SubView id="Inventarios/InventariosMaster" codInventario={codInventario} />
      )}
      {detalleVisible && (
        <Quimera.View
          id="Inventario"
          initInventario={inventarios.dict[inventarios.current]}
          codInventario={inventarios.current}
          callbackChanged={callbackInventarioCambiado}
        />
      )}
    </Quimera.Template>
  );
}

export default Inventarios;
