import { Box, Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import React from "react";

function PedidosFiltro() {
  const [{ filtroVisible }, dispatch] = useStateValue();

  return (
    <Quimera.Template id="PedidosFiltro">
      <FilterBox id="pedidos.filter" schema={getSchemas().pedidos} open={filtroVisible}>
        <Filter.Schema id="codigo" />
        <Filter.Schema id="nombreCliente" />
        <Filter.Schema id="fecha" type="interval" />
        <Box display="flex" justifyContent="space-between">
          <Filter.Schema id="fecha" type="desde" />
          <Filter.Schema id="fecha" type="hasta" />
        </Box>
      </FilterBox>
    </Quimera.Template>
  );
}

export default PedidosFiltro;
