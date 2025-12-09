import { Box, Field, FilterBox, Grid } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import React from "react";

function ConsultaUsuariosFiltro() {
  const [{ filtroVisible, soloAceptaComunicacion }, dispatch] = useStateValue();

  return (
    <Quimera.Template id="ConsultaUsuariosFiltro">
      <Box m={2}>
        <FilterBox
          id="consultas.filter"
          schema={getSchemas().consumidoresConsulta}
          open={filtroVisible}
          initialFilter={{
            consulta: {
              value: true,
              filter: ["1", "eq", "1"],
            },
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Field.CheckBox
                id="soloAceptaComunicacion"
                label="Solo usuarios que admiten marketing"
                checked={soloAceptaComunicacion}
              />
            </Grid>
          </Grid>
        </FilterBox>
      </Box>
    </Quimera.Template>
  );
}

export default ConsultaUsuariosFiltro;
