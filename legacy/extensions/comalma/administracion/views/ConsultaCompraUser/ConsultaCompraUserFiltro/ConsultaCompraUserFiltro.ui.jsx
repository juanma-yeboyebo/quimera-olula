import { Box, Field, Filter, FilterBox, Grid } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import React from "react";

import { CampanasFieldSelect } from "../../../comps";

function ConsultaCompraUserFiltro() {
  const [{ filtroVisible, soloAceptaComunicacion }, dispatch] = useStateValue();

  return (
    <Quimera.Template id="ConsultaCompraUserFiltro">
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
            <Grid item xs={12} md={8} lg={6} xl={4}>
              <Field.Int
                id="comerciosDesde"
                label="Min. establecimientos"
                fullWidth
                autoComplete="off"
                onClick={event => event.target.select()}
              />
            </Grid>
            <Grid item xs={12} md={8} lg={6} xl={4}>
              <Field.Currency
                id="importeDesde"
                label="Importe desde"
                fullWidth
                autoComplete="off"
                onClick={event => event.target.select()}
              />
            </Grid>
            <Grid item xs={12} container spacing={1}>
              <Grid item xs={12} md={8} lg={6} xl={4}>
                <Field.Int
                  id="numComprasDesde"
                  label="Nº compras desde"
                  fullWidth
                  autoComplete="off"
                  onClick={event => event.target.select()}
                />
              </Grid>
              <Grid item xs={12} md={8} lg={6} xl={4}>
                <Field.Int
                  id="numComprasHasta"
                  label="Nº compras hasta"
                  fullWidth
                  autoComplete="off"
                  onClick={event => event.target.select()}
                />
              </Grid>
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
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Filter.Schema
                  id="fechaNacimiento"
                  label="Fecha Nacimiento"
                  type="desde"
                  autoComplete="off"
                />
                <Filter.Schema
                  id="fechaNacimiento"
                  label="Fecha Nacimiento"
                  type="hasta"
                  autoComplete="off"
                />
              </Box>
            </Grid>
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

export default ConsultaCompraUserFiltro;
