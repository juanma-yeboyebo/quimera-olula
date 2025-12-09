import { Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import React from "react";

function CampanasFiltro() {
  const [{ filtroVisible }, dispatch] = useStateValue();

  return (
    <Quimera.Template id="CampanasFiltro">
      <FilterBox id="campanas.filter" schema={getSchemas().campanas} open={filtroVisible}>
        <Filter.Schema id="nombre" autoComplete="off" />
      </FilterBox>
    </Quimera.Template>
  );
}

export default CampanasFiltro;
