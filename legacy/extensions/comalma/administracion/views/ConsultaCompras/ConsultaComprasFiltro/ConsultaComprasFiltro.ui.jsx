import { Box, Field, Filter, FilterBox, Grid } from "@quimera/comps";
import Quimera, { getSchemas, useStateValue } from "quimera";

import { CampanasFieldSelect } from "../../../comps";

function ConsultaComprasFiltro() {
  const [{ filtroVisible, soloAceptaComunicacion }, dispatch] = useStateValue();

  return (
    <Quimera.Template id="ConsultaComprasFiltro">
      <Box m={2}>
        <FilterBox
          id="consultas.filter"
          schema={getSchemas().ventasComercio}
          open={filtroVisible}
          initialFilter={{
            consulta: {
              value: true,
              filter: ["1", "eq", "1"],
            },
          }}
        >
          <Grid container spacing={1} direction="column" >
            <Grid size={12}>
              <CampanasFieldSelect id="idCampana" label="Campaña" fullWidth async />
            </Grid>
            <Grid size={{ xs: 12, md: 8, lg: 6, xl: 4 }}>
              <Field.Int
                id="comerciosDesde"
                label="Min. establecimientos"
                fullWidth
                autoComplete="off"
                onClick={event => event.target.select()}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 8, lg: 6, xl: 4 }}>
              <Field.Currency
                id="importeDesde"
                label="Importe desde"
                fullWidth
                autoComplete="off"
                onClick={event => event.target.select()}
              />
            </Grid>
            <Grid container size={12} spacing={1}>
              <Grid size={{ xs: 12, md: 8, lg: 6, xl: 4 }}>
                <Field.Int
                  id="numComprasDesde"
                  label="Nº compras desde"
                  fullWidth
                  autoComplete="off"
                  onClick={event => event.target.select()}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 8, lg: 6, xl: 4 }}>
                <Field.Int
                  id="numComprasHasta"
                  label="Nº compras hasta"
                  fullWidth
                  autoComplete="off"
                  onClick={event => event.target.select()}
                />
              </Grid>
            </Grid>
            <Grid size={12}>
              <Grid size={12}>
                <Filter.Schema
                  id="fechaVenta"
                  label="Periodo de compra"
                  type="interval"
                  autoComplete="off"
                />
              </Grid>
              <Box display="flex" justifyContent="space-between">
                <Filter.Schema
                  id="fechaVenta"
                  type="desde"
                  label="Fecha compra"
                  autoComplete="off"
                />
                <Filter.Schema
                  id="fechaVenta"
                  type="hasta"
                  label="Fecha compra"
                  autoComplete="off"
                />
              </Box>
            </Grid>
            <Grid size={12}>
              <Box display="flex" justifyContent="space-between">
                <Filter.Schema
                  id="fechaNacimientoConsumidor"
                  label="Fecha Nacimiento"
                  type="desde"
                  autoComplete="off"
                />
                <Filter.Schema
                  id="fechaNacimientoConsumidor"
                  label="Fecha Nacimiento"
                  type="hasta"
                  autoComplete="off"
                />
              </Box>
            </Grid>
            <Grid size={12}>
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

export default ConsultaComprasFiltro;
