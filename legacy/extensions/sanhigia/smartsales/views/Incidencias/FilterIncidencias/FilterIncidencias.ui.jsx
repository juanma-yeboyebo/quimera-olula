import { Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";

import { Cliente } from "../../../comps";

function FilterIncidencias() {
  const [{ showFilter }] = useStateValue();

  return (
    <Quimera.Template id="FilterIncidencias">
      <FilterBox id="incidencias.filter" schema={getSchemas().incidencias} open={showFilter}>
        {/* <Filter.Schema id="nombre" /> */}
        <Filter.Schema id="estado" />
        <Cliente id="codcliente" label="Cliente" filterField={true} fullWidth async />
      </FilterBox>
    </Quimera.Template>
  );
}

export default FilterIncidencias;
