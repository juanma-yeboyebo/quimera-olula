import { Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";

import { AgenteSmartsales } from "../../../comps";

function FilterClientes() {
  const [{ showFilter, clientes }] = useStateValue();

  return (
    <Quimera.Template id="FilterClientes">
      <FilterBox id="clientes.filter" schema={getSchemas().clientes} open={showFilter}>
        <Filter.Schema id="nombre" />
        <Filter.Schema id="codCliente" label="Código" />
        <Filter.Schema id="cifNif" />
        <AgenteSmartsales id="codagente" label="Agente" filterField={true} fullWidth async />
      </FilterBox>
    </Quimera.Template>
  );
}

export default FilterClientes;
