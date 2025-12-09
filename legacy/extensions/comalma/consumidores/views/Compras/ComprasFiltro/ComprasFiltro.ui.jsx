import { Box, Field, Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import React from "react";

function ComprasFiltro() {
  const [
    {
      filtroVisible,
    },
    dispatch,
  ] = useStateValue();

  return (
    <Quimera.Template id="ComprasFiltro">
      <FilterBox
        id="compras.filter"
        schema={getSchemas().compras}
        open={filtroVisible}
      >
        <Filter.Schema id="nombre" />
      </FilterBox>
    </Quimera.Template>
  );
}

export default ComprasFiltro;
