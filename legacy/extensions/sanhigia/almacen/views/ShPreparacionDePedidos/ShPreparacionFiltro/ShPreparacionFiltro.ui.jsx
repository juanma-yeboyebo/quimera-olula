import { Box, Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import React from "react";

function ShPreparacionFiltro() {
  const [{ filtroVisible }, dispatch] = useStateValue();

  return (
    <Quimera.Template id="ShPreparacionFiltro">
      <FilterBox
        id="preparaciones.filter"
        schema={getSchemas().preparacionPedidos}
        open={filtroVisible}
        lastFilter={true}
      >
        <Filter.Schema id="codPreparacionDePedido" />
        <Filter.Schema id="descripcion" />
        <Filter.Schema id="fecha" type="interval" />
        <Box display="flex" justifyContent="space-between">
          <Filter.Schema id="fecha" type="desde" />
          <Filter.Schema id="fecha" type="hasta" />
        </Box>
      </FilterBox>
    </Quimera.Template>
  );
}

export default ShPreparacionFiltro;
