import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useCallback, useEffect } from "react";

function Categorias({ idCategoria, useStyles }) {
  const [{ categorias }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdCategoriasProp",
      payload: { id: idCategoria ? parseInt(idCategoria) : "" },
    });
  }, [idCategoria]);

  const callbackCategoriaCambiada = useCallback(
    payload => dispatch({ type: "onCategoriasItemChanged", payload }),
    [dispatch],
  );

  return (
    <Quimera.Template id="Categorias">
      <QMasterDetail
        MasterComponent={
          <Quimera.SubView id="Categorias/CategoriasMaster" idCategoria={idCategoria} />
        }
        DetailComponent={
          <Quimera.View
            id="Categoria"
            initCategoria={categorias.dict[categorias.current]}
            idCategoria={categorias.current}
            callbackChanged={callbackCategoriaCambiada}
          />
        }
        current={categorias.current}
      />
    </Quimera.Template>
  );
}

export default Categorias;
