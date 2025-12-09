import { Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";

function FilterCursos() {
  const [{ showFilter }] = useStateValue();

  return (
    <Quimera.Template id="FilterCursos">
      <FilterBox id="cursos.filter" schema={getSchemas().eventosCurso} open={showFilter}>
        <Filter.Schema id="nombre" />
        <Filter.Schema id="estado" />

      </FilterBox>
    </Quimera.Template>
  );
}

export default FilterCursos;
