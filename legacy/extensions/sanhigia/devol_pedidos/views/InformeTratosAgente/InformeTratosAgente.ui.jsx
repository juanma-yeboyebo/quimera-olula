import { Box, Button, Field, Grid, Icon, QBox } from "@quimera/comps";
import { Agente } from "@quimera-extension/base-ventas";
import { TipoTrato } from "@quimera-extension/sanhigia-smartsales";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useEffect } from "react";

import initialData from "./initial-data";

function InformeTratosAgente({ useStyles }) {
  const [{ filtro }, dispatch] = useStateValue();
  const classes = useStyles();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        dispatch,
      },
    });
  }, [dispatch]);

  const puedoBuscar = () => filtro.fechaDesde && filtro.fechaHasta;

  return (
    <Quimera.Template id="InformeTratosAgente">
      <QBox
        titulo={`Tratos por agente`}
        botonesCabecera={[{ icon: "close", id: "atras", text: "Atrás" }]}
      >
        <Grid container direction="column" item spacing={1}>
          <Grid item xs={12}>
            <Agente id="filtro.codAgente" label="Agente" fullWidth />
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
            <Field.Date
              id="filtro.fechaDesde"
              label="Fecha trato desde"
              className={classes.field}
            />
          </Grid>
          <Grid item xs={6}>
            <Field.Date
              id="filtro.fechaHasta"
              label="Fecha trato hasta"
              className={classes.field}
            />
          </Grid>
          <Grid item xs={12}>
            <Field.Select
              id="filtro.estado"
              label="Estado"
              options={initialData.estados}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TipoTrato
              id="filtro.idTipotrato"
              label="TipoTrato"
              initial={null}
              fullWidth
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-around" mt={1}>
          <Button
            id="lanzarInforme"
            text="Descargar"
            color="primary"
            variant="contained"
            disabled={!puedoBuscar()}
            startIcon={<Icon>file_download</Icon>}
          />
        </Box>
      </QBox>
    </Quimera.Template>
  );
}

export default InformeTratosAgente;
