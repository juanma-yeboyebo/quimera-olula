import { Box, Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import React from "react";

function PartesCarrosFiltro() {
  const [{ codigoParte, filtroVisible }, dispatch] = useStateValue();

  const initialFilter = {
    codigoparte: {
      value: false,
      filter: ["codigoparte", "eq", codigoParte],
    },
  };

  return (
    <Quimera.Template id="PartesCarrosFiltro">
      <FilterBox
        id="partesCarros.filter"
        schema={getSchemas().partescarros}
        open={filtroVisible}
        initialFilter={codigoParte ? initialFilter : {}}
      >
        <Filter.Schema id="codigoParte" />
        <Filter.Schema id="nombreCliente" />
        {/* <Filter.Schema id="firmado" /> */}
        <Filter.Schema id="fecha" type="interval" />
        <Box display="flex" justifyContent="space-between">
          <Filter.Schema id="fecha" type="desde" />
          <Filter.Schema id="fecha" type="hasta" />
        </Box>
      </FilterBox>
    </Quimera.Template>
  );
}

export default PartesCarrosFiltro;
