import { Box, Button, Collapse, Field, Grid, Icon, QSection } from "@quimera/comps";
import { SelectorValores } from "@quimera-extension/base-almacen";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

import { Proyecto, S17Articulo } from "../../comps";

function LineaParteNueva({
  callbackFirmarParte,
  callbackGuardada,
  codParte,
  data,
  editable,
  useStyles,
}) {
  const [{ inline, linea, nuevaLineaHoras, nuevaLineaMinutos, proyectos, trabajos }, dispatch] =
    useStateValue();
  const classes = useStyles();
  const schema = getSchemas().lineasParte;
  const width = useWidth();
  useEffect(() => {
    console.log("INIT NUEVA", codParte, dispatch, callbackGuardada);
    dispatch({
      type: "onInit",
      payload: {
        idParentLinea: codParte,
      },
    });
    dispatch({
      type: "guardarCodparte",
      payload: {
        codParte,
      },
    });
  }, [codParte]);

  useEffect(() => {
    util.publishEvent(linea.event, callbackGuardada);
  }, [linea.event.serial]);

  const mobile = ["xs", "sm"].includes(width);

  const intHoras = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const intMinutos = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const horas = data.horas ? util.horasToHorasMins(data.horas) : "00:00";
  const horasParte = data.horasparte
    ? util.segundosToHorasMins(util.horasMinsSegsASegundos(data.horasparte))
    : "00:00";
  const codCentroEspecial = util.getUser().codecentroespecial;

  return (
    <Quimera.Template id="LineaParteNueva">
      {inline && editable && (
        <Box>
          <Box width={1} display="flex" alignItems="flex-end" justifyContent={"space-around"}>
            <Button
              id="expandir"
              text="Nueva línea"
              variant="outlined"
              color="primary"
              startIcon={<Icon>add_circle</Icon>}
            />
            <Button
              id="firmarParte"
              text="Firmar parte"
              variant="outlined"
              color="primary"
              startIcon={<Icon>edit</Icon>}
              onClick={callbackFirmarParte}
              disabled={horas !== horasParte}
            />
          </Box>
        </Box>
      )}
      <Collapse in={!inline} mountOnEnter>
        <QSection
          title={`Nueva línea ${linea.descripcion ?? ""}`}
          actionPrefix="lineaExpandida"
          alwaysActive
          dynamicComp={() => (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <S17Articulo
                  id="linea.buffer/referencia"
                  label="Trabajo"
                  superfamilia="MANO DE OBRA"
                  fullWidth
                  estatico={false}
                />
              </Grid>
              <Grid item xs={12}>
                <Proyecto id="linea.buffer/proyecto" label="Proyecto" fullWidth estatico={false} />
              </Grid>
              <Grid item xs={12}>
                {linea.buffer.proyecto === codCentroEspecial ?
                  <Box width={1}>
                    <Field.TextArea id="linea.buffer.observaciones" label="Observaciones" fullWidth />
                  </Box>
                  : <></>
                }
              </Grid>
              <Grid container item xs={12} spacing={2}>
                <Grid item xs={mobile ? 6 : 2}>
                  <SelectorValores
                    id="nuevaLineaHoras"
                    label="Horas"
                    valores={intHoras}
                    value={nuevaLineaHoras}
                    fullWidth
                  ></SelectorValores>
                </Grid>
                <Grid item xs={mobile ? 6 : 2}>
                  <SelectorValores
                    id="nuevaLineaMinutos"
                    label="Minutos"
                    valores={intMinutos}
                    value={nuevaLineaMinutos}
                    fullWidth
                  ></SelectorValores>
                </Grid>
              </Grid>
            </Grid>
          )}
          saveDisabled={() => !schema.isValid(linea.buffer) || linea.buffer.horas <= 0}
        ></QSection>
      </Collapse>
    </Quimera.Template>
  );
}

export default LineaParteNueva;
