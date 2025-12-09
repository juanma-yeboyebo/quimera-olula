import { Box, Button, Field, Grid, Icon, QBox } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useEffect } from "react";

function InformeProductosaCaducar({ useStyles }) {
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

  const puedoBuscar = () => filtro.meses;

  return (
    <Quimera.Template id="InformeProductosaCaducar">
      <QBox
        titulo={`Productos a caducar`}
        botonesCabecera={[{ icon: "close", id: "atras", text: "Atrás" }]}
      >
        <Grid container direction="column" item spacing={1} alignItems="flex-end">
          <Grid item xs={6}>
            <Field.Int id="filtro.meses" label="Meses para caducar" className={classes.field} />
          </Grid>
          <Grid item xs={6}>
            <Field.CheckBox
              id="filtro.incluirYaCaducados"
              label="Incluir productos ya caducados"
              checked={filtro.incluirYaCaducados}
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

export default InformeProductosaCaducar;
