import { Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth } from "quimera";
import React from "react";

function CatalogoFiltro({ _useStyles }) {
  const [{ filtroVisible }, dispatch] = useStateValue();
  // const classes = useStyles()
  const mobile = ["xs", "sm"].includes(useWidth());

  const filterBox = (
    <FilterBox id="categoria.filter" schema={getSchemas().categorias} open={filtroVisible}>
      <Filter.Schema id="idcategoria" />
      <Filter.Schema id="idcatpadre" />
      <Filter.Schema id="habilitado" />
      {}
    </FilterBox>
  );

  return <Quimera.Template id="CatalogoFiltro">{mobile ? {} : filterBox}</Quimera.Template>;
}

export default CatalogoFiltro;
