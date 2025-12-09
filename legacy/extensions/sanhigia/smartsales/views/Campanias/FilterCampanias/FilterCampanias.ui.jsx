import { Box, Field, Filter, FilterBox } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";

function FilterCampania() {
  const [{ mostrarArchivadas, showFilter }] = useStateValue();

  return (
    <Quimera.Template id="FilterCampania">
      <FilterBox id="campanias.filter" schema={getSchemas().campania} open={showFilter}>
        <Filter.Schema id="nombre" />
        <Filter.Schema id="tipo" />
        <Filter.Schema id="tipoProducto" />
        <Filter.Schema id="estado" />
        <Filter.Schema id="fechaAlta" />
        <Box mt={2}>
          <Field.CheckBox
            id="mostrarArchivadas"
            label="Mostrar archivadas"
            checked={mostrarArchivadas}
          />
        </Box>
      </FilterBox>
    </Quimera.Template>
  );
}

export default FilterCampania;
