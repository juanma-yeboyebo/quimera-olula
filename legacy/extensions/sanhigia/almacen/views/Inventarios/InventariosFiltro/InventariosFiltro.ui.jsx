import { Box, Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import React from "react";

function InventariosFiltro({ useStyles }) {
  const [{ filtroVisible }, dispatch] = useStateValue();
  // const classes = useStyles()

  return (
    <Quimera.Template id="InventariosFiltro">
      <FilterBox id="inventarios.filter" schema={getSchemas().inventarios} open={filtroVisible}>
        <Filter.Schema id="codInventario" />
        <Filter.Schema id="fecha" type="interval" />
        <Box display="flex" justifyContent="space-between">
          <Filter.Schema id="fecha" type="desde" />
          <Filter.Schema id="fecha" type="hasta" />
        </Box>
        {/* codInventario */}
      </FilterBox>
    </Quimera.Template>
  );
}

export default InventariosFiltro;
