import { Box, Filter, FilterBox } from "@quimera/comps";
import { Familia } from "@quimera-extension/base-almacen";
import { Agente, ComunidadAutonoma } from "@quimera-extension/base-ventas";
import Quimera, { getSchemas, PropValidation } from "quimera";

function BiFiltros({
  codAgente = null,
  codFamilia = null,
  comunidad = null,
  intervals = [],
  defaultInterval = null,
}) {
  return (
    <Quimera.Template id="BiFiltros">
      {/* <Field.RealAutocomplete
        id="hola"
        options={[
          { key: 1, value: 'Uno' },
          { key: 2, value: 'Dos' },
          { key: 3, value: 'Tres' },
          { key: 4, value: 'Cuatro' },
          { key: 5, value: 'Cinco' },
          { key: 6, value: 'Seis' },
        ]}
        fullWidth
      /> */}
      <FilterBox id="filter" schema={getSchemas().filtroGraficos} open={true}>
        <Filter.Schema
          id="fecha"
          type="interval"
          initial={{ interval: defaultInterval }}
          intervals={intervals}
        />
        <Box display="flex" justifyContent="space-between">
          <Filter.Schema id="fecha" type="desde" />
          <Filter.Schema id="fecha" type="hasta" />
        </Box>
        <Filter.Schema id="agente" Comp={Agente} initial={codAgente} />
        <Filter.Schema id="familia" Comp={Familia} initial={codFamilia} />
        <Filter.Schema
          id="comunidad"
          Comp={ComunidadAutonoma}
          initial={comunidad ? parseInt(comunidad) : null}
        />
      </FilterBox>
    </Quimera.Template>
  );
}

export default BiFiltros;
