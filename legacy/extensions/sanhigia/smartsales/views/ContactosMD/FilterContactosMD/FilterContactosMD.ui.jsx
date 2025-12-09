import { Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";

import { AgenteSmartsales } from "../../../comps";

function FilterContactosMD() {
  const [{ externalFilter, showFilter }] = useStateValue();

  return (
    <Quimera.Template id="FilterContactosMD">
      <FilterBox
        id="contactos.filter"
        schema={getSchemas().contactoSummary}
        open={showFilter}
        externalFilter={externalFilter}
      >
        <Filter.Schema id="codpostal" />
        <AgenteSmartsales id="codagente" label="Agente" filterField={true} fullWidth async />
      </FilterBox>
    </Quimera.Template>
  );
}

export default FilterContactosMD;
