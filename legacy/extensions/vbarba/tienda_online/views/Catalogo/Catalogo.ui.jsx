import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useEffect } from "react";

function Catalogo({ referenciaProp, useStyles }) {
  const [{ catalogo }, dispatch] = useStateValue();
  useEffect(() => {
    console.log("onInit_________");
    dispatch({
      type: "onInit",
      payload: { referenciaProp },
    });
  }, [dispatch, referenciaProp]);

  // const callbackProductoCambiado = useCallback((payload) => dispatch({ type: 'onCatalogoItemChanged', payload }), [dispatch])

  return (
    <Quimera.Template id="Catalogo">
      <Quimera.SubView id="Catalogo/CatalogoMaster" />
    </Quimera.Template>
  );
}

export default Catalogo;
