import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useCallback, useEffect } from "react";

function Catalogo({ idModeloProp, useStyles }) {
  const [{ catalogo, idModelo }, dispatch] = useStateValue();
  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdCatalogoProp",
      payload: { idModelo: idModeloProp ? idModeloProp : null },
    });
  }, [idModeloProp]);

  const callbackProductoCambiado = useCallback(
    payload => dispatch({ type: "onCatalogoItemChanged", payload }),
    [dispatch],
  );

  return (
    <Quimera.Template id="Catalogo">
      <Quimera.SubView id="Catalogo/CatalogoMaster" idModelo={idModelo} />
    </Quimera.Template>
  );
}

export default Catalogo;
