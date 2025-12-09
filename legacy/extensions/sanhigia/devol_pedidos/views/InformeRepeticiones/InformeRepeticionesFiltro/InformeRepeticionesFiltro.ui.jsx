import { Field, Grid } from "@quimera/comps";
import { Box } from "@quimera/thirdparty";
import { QArticulo } from "@quimera-extension/base-almacen";
import Quimera, { PropValidation } from "quimera";
import React from "react";

import initialData from "../initial-data";

function InformeRepeticionesFiltro({ useStyles }) {
  // const [{ visibleGerencia, bufferFiltro }, dispatch] = useStateValue()
  const classes = useStyles();

  return (
    <Quimera.Template id="InformeRepeticionesFiltro">
      <Grid container direction="column" item spacing={1}>
        <Grid item xs={12} sm={3} md={3}>
          <Box width={1} border={0}>
            <QArticulo id="referencia" label="Referencia" fullWidth />
          </Box>
        </Grid>
        <Grid item xs={12} sm={2} md={2}>
          <Box width={1} border={0}>
            <Field.Select
              id="intervaloFecha"
              label="Intervalo"
              options={initialData.intervalos}
              fullWidth
            />
          </Box>
        </Grid>
        <Grid item xs={6} sm={5} md={5}>
          <Field.Date
            id="fechaDesde"
            field="fechaDesde"
            label="Fecha desde"
            className={classes.field}
          />
        </Grid>
        <Grid item xs={6} sm={5} md={5}>
          <Field.Date
            id="fechaHasta"
            field="fechaHasta"
            label="Fecha hasta"
            className={classes.field}
          />
        </Grid>
        <Grid item xs={6} sm={2} md={2}>
          <Field.Int id="intervaloDias" label="Intervalo días" />
        </Grid>
      </Grid>
    </Quimera.Template>
  );
}

export default InformeRepeticionesFiltro;
