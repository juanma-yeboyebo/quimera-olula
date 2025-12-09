import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useCallback, useEffect } from "react";

function Catalogo({ referencia, useStyles }) {
  const [{ catalogo }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdCatalogoProp",
      payload: { id: referencia ? referencia : null },
    });
  }, [referencia]);

  const callbackProductoCambiado = useCallback(
    payload => dispatch({ type: "onCatalogoItemChanged", payload }),
    [dispatch],
  );

  return (
    <Quimera.Template id="Catalogo">
      <Quimera.SubView id="Catalogo/CatalogoMaster" referencia={referencia} />
    </Quimera.Template>
  );
}

export default Catalogo;
