import { Box, Button, Field, Grid, Icon, QBox } from "@quimera/comps";
import { Cliente } from "@quimera-extension/base-ventas";
import Quimera, { PropValidation, useStateValue } from "quimera";
import { ACL } from "quimera/lib";
import React, { useEffect } from "react";

import initialData from "./initial-data";

function InformeConsumoCliente({ useStyles }) {
  const [
    { clientes, clientesTotal, clientesNoRepetidos, referencia, fechaDesde, fechaHasta, filtro },
    dispatch,
  ] = useStateValue();
  // const _c = useStyles()
  const classes = useStyles();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        dispatch,
      },
    });
  }, [dispatch]);

  const puedoLanzar = () => filtro.fechaDesde && filtro.fechaHasta && filtro.codCliente;

  return (
    <Quimera.Template id="InformeConsumoCliente">
      <QBox
        titulo={`Consumo por cliente`}
        botonesCabecera={[{ icon: "close", id: "atras", text: "Atrás" }]}
      >
        <Grid container direction="column" item spacing={1}>
          <Grid item xs={12}>
            <Cliente
              id="filtro.codCliente"
              label="Cliente"
              todoslosagentes={ACL.can("ss_informes:todoslosagentes")}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Field.Select
              id="filtro.intervaloFecha"
              label="Intervalo"
              options={initialData.intervalos}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Field.Date id="filtro.fechaDesde" label="Fecha desde" className={classes.field} />
          </Grid>
          <Grid item xs={6}>
            <Field.Date id="filtro.fechaHasta" label="Fecha hasta" className={classes.field} />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-around" mt={2}>
          <Button
            id="lanzarInforme"
            text="Lanzar informe"
            color="primary"
            variant="contained"
            disabled={!puedoLanzar()}
            startIcon={<Icon>file_download</Icon>}
          />
        </Box>
      </QBox>
    </Quimera.Template>
  );
}

export default InformeConsumoCliente;
