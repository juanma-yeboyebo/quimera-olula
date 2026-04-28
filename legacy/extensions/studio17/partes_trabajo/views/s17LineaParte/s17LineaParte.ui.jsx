import { SelectorValores } from "@quimera-extension/base-almacen";
import {
  Box,
  Button,
  Collapse,
  Field,
  Grid,
  Icon,
  LinearProgress,
  QSection,
  Typography,
} from "@quimera/comps";
// import { QArticulo } from "@quimera-extension/base-almacen";
// import { Totales } from "@quimera-extension/base-area_clientes";
import Quimera, { getSchemas, useStateValue, useWidth, util } from "quimera";
import { useEffect } from "react";

import { Proyecto, S17Articulo } from "../../comps";

function s17LineaParte({ callbackGuardada, disabled, lineaInicial, useStyles }) {
  const [{ linea, lineaHoras, lineaMinutos, sections }, dispatch] = useStateValue();
  const classes = useStyles();
  const schema = getSchemas().partesTrabajo;
  const width = useWidth();
  const { buffer } = linea;

  useEffect(() => {
    util.publishEvent(linea.event, callbackGuardada);
  }, [linea.event.serial]);

  useEffect(() => {
    dispatch({
      type: "onInitLinea",
      payload: {
        initLinea: lineaInicial,
      },
    });
  }, [lineaInicial]);

  const mobile = ["xs", "sm"].includes(width);

  const intHoras = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const intMinutos = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const codCentroEspecial = util.getUser().codecentroespecial;

  return (
    <Quimera.Template id="LineaPedidoCli">
      {linea.buffer._status === "deleting" && (
        <Box width={1}>
          <Typography variant="body2">Borrando línea...</Typography>
          <LinearProgress />
        </Box>
      )}
      <Collapse in={linea.buffer._status !== "deleting"}>
        <Grid container spacing={0} direction="column">
          <Grid size={12}>
            <Box display="flex" justifyContent="right" mt={1}>
              {!disabled && (
                <Button
                  id="deleteLinea"
                  text="Borrar"
                  variant="outlined"
                  color="primary"
                  startIcon={<Icon>delete</Icon>}
                  onClick={() =>
                    dispatch({ type: "onDeleteLineaClicked", payload: { item: linea.buffer } })
                  }
                />
              )}
            </Box>
          </Grid>

          <Box
            display="flex"
            justifyContent="space-between"
            flexWrap="wrap"
            fullWidth
            style={{ width: "100%" }}
          >
            <Grid size={12}>
              <QSection
                title="Horas"
                actionPrefix="linea/horas"
                alwaysInactive={false}
                dynamicComp={() => (
                  <Grid container size={12} spacing={2}>
                    <Grid size={mobile ? 6 : 2}>
                      <SelectorValores
                        id="lineaHoras"
                        label="Horas"
                        valores={intHoras}
                        value={lineaHoras}
                        fullWidth
                      ></SelectorValores>
                    </Grid>
                    <Grid size={mobile ? 6 : 2}>
                      <SelectorValores
                        id="lineaMinutos"
                        label="Minutos"
                        valores={intMinutos}
                        value={lineaMinutos}
                        fullWidth
                      ></SelectorValores>
                    </Grid>
                  </Grid>
                )}
                saveDisabled={() => !schema.isValid(linea.buffer) || linea.buffer.horas <= 0}
              >
                <Typography variant="h5">{util.horasToHorasMins(linea.buffer.horas)}</Typography>
              </QSection>
            </Grid>
            <Grid size={12}>
              <QSection
                title={linea.buffer.referencia}
                actionPrefix="linea/referencia"
                alwaysInactive={false}
                dynamicComp={() => (
                  <Grid container spacing={1} direction="column" >
                    <Grid size={12}>
                      <S17Articulo
                        id="linea.buffer/referencia"
                        label="Trabajo"
                        superfamilia="MANO DE OBRA"
                        fullWidth
                        estatico={false}
                      />
                    </Grid>
                  </Grid>
                )}
                saveDisabled={() => !schema.isValid(linea.buffer)}
              >
                <S17Articulo
                  id="linea.buffer/referencia"
                  label="Trabajo"
                  superfamilia="MANO DE OBRA"
                  fullWidth
                  estatico={true}
                />
              </QSection>
            </Grid>
            <Grid size={12}>
              <QSection
                title={linea.buffer.proyecto}
                actionPrefix="linea/proyecto"
                alwaysInactive={false}
                dynamicComp={() => (
                  <Grid container spacing={1} direction="column" >
                    <Grid size={12}>
                      <Proyecto
                        id="linea.buffer/proyecto"
                        label="Proyecto"
                        fullWidth
                        estatico={false}
                      />
                    </Grid>
                  </Grid>
                )}
                saveDisabled={() => !schema.isValid(linea.buffer)}
              >
                <Proyecto
                  id="linea.buffer/proyecto"
                  label="Proyecto"
                  fullWidth
                  estatico={true}
                  value={linea.buffer.proyecto}
                />
              </QSection>
            </Grid>
            {linea.buffer.proyecto === codCentroEspecial ?
              <Grid size={12}>
                <QSection
                  title="Observaciones"
                  actionPrefix="linea/observaciones"
                  alwaysInactive={false}
                  dynamicComp={() => (
                    <Box width={1}>
                      <Field.TextArea id="linea.buffer.observaciones" fullWidth />
                    </Box>
                  )}
                  saveDisabled={() => !schema.isValid(linea.buffer)}
                >
                  <Box display="flex">
                    <Typography variant="body2">
                      {linea.buffer.observaciones}
                    </Typography>
                  </Box>
                </QSection>
              </Grid> : <></>
            }
          </Box>
        </Grid>
      </Collapse>
    </Quimera.Template>
  );
}

export default s17LineaParte;
