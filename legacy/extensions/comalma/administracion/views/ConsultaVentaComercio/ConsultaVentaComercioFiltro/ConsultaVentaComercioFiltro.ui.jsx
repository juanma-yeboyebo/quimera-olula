import { Box, Filter, FilterBox, Grid } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import React from "react";

import { CampanasFieldSelect } from "../../../comps";

function ConsultaVentaComercioFiltro() {
  const [{ filtroVisible, soloAceptaComunicacion }, dispatch] = useStateValue();

  return (
    <Quimera.Template id="ConsultaVentaComercioFiltro">
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
              <CampanasFieldSelect id="idCampana" label="Campaña" fullWidth async />
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <Filter.Schema
                  id="fechaCompra"
                  label="Periodo de compra"
                  type="interval"
                  autoComplete="off"
                />
              </Grid>
              <Box display="flex" justifyContent="space-between">
                <Filter.Schema id="fechaCompra" type="desde" autoComplete="off" />
                <Filter.Schema id="fechaCompra" type="hasta" autoComplete="off" />
              </Box>
            </Grid>
          </Grid>
        </FilterBox>
      </Box>
    </Quimera.Template>
  );
}

export default ConsultaVentaComercioFiltro;
