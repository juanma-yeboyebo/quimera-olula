import { Box, FilterBox, Grid } from "@quimera/comps";
import Quimera, { getSchemas, useStateValue } from "quimera";

import { EventosFieldSelect } from "../../../comps";

function CalendarioEventosFiltro() {
  const [{ filtroVisible, soloAceptaComunicacion }, dispatch] = useStateValue();

  return (
    <Quimera.Template id="CalendarioEventosFiltro">
      <Box m={2}>
        <FilterBox
          id="eventos.filter"
          schema={getSchemas().eventos}
          open={true}
        // initialFilter={{
        //   evento: {
        //     value: true,
        //     filter: ["1", "eq", "1"],
        //   },
        // }}
        >
          <Grid container spacing={1} direction="column" >
            <Grid size={12}>
              <EventosFieldSelect id="articuloProyectoFiltro" label="Producto" fullWidth async />
            </Grid>
          </Grid>
        </FilterBox>
      </Box>
    </Quimera.Template>
  );
}

export default CalendarioEventosFiltro;
