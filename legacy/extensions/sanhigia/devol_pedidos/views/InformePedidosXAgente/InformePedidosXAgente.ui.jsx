import { Agente } from "@quimera-extension/base-ventas";
import { Box, Button, Field, Grid, Icon, QBox } from "@quimera/comps";
import Quimera, { useStateValue } from "quimera";
import { useEffect } from "react";

import initialData from "./initial-data";

function InformePedidosXAgente({ useStyles }) {
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

  const puedoBuscar = () => filtro.fechaDesde != null && filtro.fechaHasta != null;

  return (
    <Quimera.Template id="InformePedidosXAgente">
      <QBox
        titulo={`Pedidos por agente`}
        botonesCabecera={[{ icon: "close", id: "atras", text: "Atrás" }]}
      >
        <Grid container direction="column" spacing={1}>
          <Grid size={12}>
            <Box width={1} border={0}>
              <Agente id="filtro.idAgente" label="Agente" fullWidth />
            </Box>
          </Grid>
          <Grid size={12}>
            <Box width={1} border={0}>
              <Field.Select
                id="filtro.intervaloFecha"
                label="Intervalo"
                options={initialData.intervalos}
                fullWidth
              />
            </Box>
          </Grid>
          <Grid container spacing={1}>
            <Grid size={6}>
              <Field.Date id="filtro.fechaDesde" label="Fecha desde" className={classes.field} />
            </Grid>
            <Grid size={6}>
              <Field.Date id="filtro.fechaHasta" label="Fecha hasta" className={classes.field} />
            </Grid>
          </Grid>

        </Grid>
        <Box display="flex" justifyContent="space-around" mt={2}>
          <Button
            id="cargarDatos"
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

export default InformePedidosXAgente;
