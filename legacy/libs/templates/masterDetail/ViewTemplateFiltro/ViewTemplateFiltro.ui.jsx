import { Box, Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import React from "react";

function TemplateNameFiltro() {
  const [{ filtroVisible }, dispatch] = useStateValue();

  return (
    <Quimera.Template id="TemplateNameFiltro">
      <FilterBox id="templateName.filter" schema={getSchemas().templateName} open={filtroVisible}>
        {/* <Filter.Schema id="codigo" /> */}
      </FilterBox>
    </Quimera.Template>
  );
}

export default TemplateNameFiltro;
