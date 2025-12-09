import { Box, Field, Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import React from "react";

function ComerciosFiltro() {
  const [
    {
      filtroVisible,
    },
    dispatch,
  ] = useStateValue();

  return (
    <Quimera.Template id="ComerciosFiltro">
      <FilterBox
        id="comercios.filter"
        schema={getSchemas().comercios}
        open={filtroVisible}
      >
        <Filter.Schema id="nombre" />
        <Filter.Schema id="idcomercio" />
      </FilterBox>
    </Quimera.Template>
  );
}

export default ComerciosFiltro;
