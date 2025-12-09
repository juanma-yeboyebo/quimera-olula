import { Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import React from "react";

function LineasFiltro({ useStyles }) {
  const [{ filtroLineasVisible }, dispatch] = useStateValue();
  // const classes = useStyles()

  return (
    <Quimera.Template id="LineasFiltro">
      <FilterBox
        id="lineas.filter"
        schema={getSchemas().lineasInventario}
        open={filtroLineasVisible}
      >
        <Filter.Schema id="referencia" />
        <Filter.Schema id="codigolote" />
      </FilterBox>
    </Quimera.Template>
  );
}

export default LineasFiltro;
