import { Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import React from "react";

function CategoriasFiltro({ _useStyles }) {
  const [{ filtroVisible }, dispatch] = useStateValue();
  // const classes = useStyles()

  return (
    <Quimera.Template id="CategoriasFiltro">
      <FilterBox id="categoria.filter" schema={getSchemas().categorias} open={filtroVisible}>
        <Filter.Schema id="idcategoria" />
        <Filter.Schema id="idcatpadre" />
        <Filter.Schema id="habilitado" />
        {}
      </FilterBox>
    </Quimera.Template>
  );
}

export default CategoriasFiltro;
