import { Box, Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";

function FilterReparaciones() {
  const [{ showFilter }] = useStateValue();

  return (
    <Quimera.Template id="FilterReparaciones">
      <FilterBox id="reparaciones.filter" schema={getSchemas().reparaciones} open={showFilter}
        initialFilter={{
          estado: {
            value: "PTE",
            filter: ["estado", "eq", "PTE"],
          },
        }}
      >
        <Filter.Schema id="idReparacion" />
        <Filter.Schema id="estado" />
        <Filter.Schema id="fecha" type="interval" />
        <Box display="flex" justifyContent="space-between">
          <Filter.Schema id="fecha" type="desde" />
          <Filter.Schema id="fecha" type="hasta" />
        </Box>
      </FilterBox>
    </Quimera.Template >
  );
}

export default FilterReparaciones;
