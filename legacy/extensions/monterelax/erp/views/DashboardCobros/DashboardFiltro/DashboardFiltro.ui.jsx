import { Grid } from "@quimera/comps";
import { Box } from "@quimera/thirdparty";
import { Agente } from "@quimera-extension/base-ventas";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React from "react";

function DashboardFiltro({ useStyles }) {
  const [{ visibleGerencia, bufferFiltro }, dispatch] = useStateValue();
  const classes = useStyles();

  return (
    <Quimera.Template id="DashboardFiltro">
      <Grid container item spacing={1}>
        <Grid item xs={12} sm={4} md={4}>
          <Box width={1} visibility={visibleGerencia}>
            {/* <Field.Autocomplete variant='standard' id='bufferFiltro.codagente' label='Agente' async fullWidth /> */}
            <Agente id="bufferFiltro.codagente" label="Agente" fullWidth />
          </Box>
        </Grid>
      </Grid>
    </Quimera.Template>
  );
}

export default DashboardFiltro;
