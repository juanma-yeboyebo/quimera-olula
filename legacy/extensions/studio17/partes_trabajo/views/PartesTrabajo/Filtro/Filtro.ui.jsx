import { Box, Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import React from "react";

function Filtro({ useStyles }) {
  const [{ filtroVisible }, dispatch] = useStateValue();
  // const classes = useStyles()

  return (
    <Quimera.Template id="Filtro">
      <FilterBox id="partes.filter" schema={getSchemas().partesTrabajo} open={filtroVisible}>
        <Filter.Schema id="fecha" type="interval" />
        <Box display="flex" justifyContent="space-between">
          <Filter.Schema id="fecha" type="desde" />
          <Filter.Schema id="fecha" type="hasta" />
        </Box>
      </FilterBox>
    </Quimera.Template>
  );
}

export default Filtro;
