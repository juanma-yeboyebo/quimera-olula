import { Box, Button, Field, Grid, Icon, QSection } from "@quimera/comps";
import { CircularProgress } from "@quimera/thirdparty";
import { Agente, Cliente, DirCliente } from "@quimera-extension/base-ventas";
import { navigate } from "hookrouter";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import React, { useEffect, useState } from "react";


function NuevoCurso({ callbackCerrado, codCliente = false }) {
  const schemaCurso = getSchemas().eventosCurso;
  const [{ curso, estadoEmail }, dispatch] = useStateValue();
  const [timer, setTimer] = useState();

  useEffect(() => {
    !!callbackCerrado &&
      dispatch({
        type: "onInit",
        payload: { callbackCerrado, codCliente },
      });
  }, [callbackCerrado]);

  useEffect(() => {
    util.publishEvent(curso.event, callbackCerrado);
  }, [curso.event.serial]);


  return (
    <Quimera.Template id="NuevoCurso">
      <QSection
        actionPrefix="nuevoCurso"
        alwaysActive
        dynamicComp={() => (
          <Grid container>
            <Grid size={12}>
              <Field.Schema
                id="curso.buffer/nombre"
                label="Nombre"
                fullWidth
                autoComplete="off"
              />
            </Grid>
            <Grid size={12}>
              <Cliente id="curso.buffer.codCliente" label="Cliente" fullWidth async />
            </Grid>
            <Grid size={12}>
              <DirCliente
                id="curso.buffer/codDir"
                codCliente={curso.buffer.codCliente}
                label="Dirección"
                fullWidth
              />
            </Grid>
            <Grid size={12}>
              <Agente id="curso.buffer/codAgente" label="Responsable" fullWidth async />
            </Grid>
            <Grid container size={12}>
              <Grid size={6}>
                <Field.Date
                  id="curso.buffer/fechaIni"
                  label="Fecha Inicio"
                  fullWidth
                  autoComplete="off"
                />
              </Grid>
              <Grid size={6}>
                <Box pl={12}>
                  <Field.Time id="curso.buffer/horaIni" label="Hora Inicio" />
                </Box>
              </Grid>
            </Grid>
            <Grid container size={12}>
              <Grid size={6}>
                <Field.Date
                  id="curso.buffer/fechaFin"
                  label="Fecha Fin"
                  fullWidth
                  autoComplete="off"
                />
              </Grid>
              <Grid size={6}>
                <Box pl={12}>
                  <Field.Time id="curso.buffer/horaFin" label="Hora Fin" />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        )}
        saveDisabled={() => !schemaCurso.isValid(curso.buffer)}
      ></QSection>
    </Quimera.Template>
  );
}

export default NuevoCurso;
