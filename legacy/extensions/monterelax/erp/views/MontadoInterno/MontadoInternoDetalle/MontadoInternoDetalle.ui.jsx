import { Box, Button, Field, Grid, Icon, QBox } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React from "react";
// import { Grid, Button, Column, Field, Table, Dialog, DialogContent, IconButton, Icon, Typography } from '@quimera/comps'

function MontadoInternoDetalle({ useStyles }) {
  const [{ unidades, iniciada, pausada }, dispatch] = useStateValue();
  const classes = useStyles();

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const desktop = !mobile;

  return (
    <Quimera.Template id="MontadoInternoDetalle">
      {unidades.dict[unidades.current] && (
        <Box width={anchoDetalle} mx={desktop ? 0.5 : 0}>
          <QBox
            titulo={
              unidades.dict[unidades.current].idUnidad
                ? `${unidades.dict[unidades.current].idUnidad}`
                : `Detalle`
            }
            botonesCabecera={mobile ? [{ id: "atras", icon: "arrow_back", disabled: false }] : []}
          >
            <Box>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Field.Text
                    id={`unidades.dict.${unidades.current}.modelo`}
                    fullWidth
                    label="Modelo"
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field.Text
                    id={`unidades.dict.${unidades.current}.configuracion`}
                    fullWidth
                    label="Configuración"
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field.Text
                    id={`unidades.dict.${unidades.current}.idtela`}
                    fullWidth
                    label="Tela"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    height={1}
                  >
                    {!iniciada ? (
                      <Button
                        id="iniciar"
                        variant="contained"
                        disabled={pausada}
                        color="primary"
                        startIcon={<Icon>play_circle_outline</Icon>}
                      >
                        Iniciar
                      </Button>
                    ) : (
                      <Button
                        id="terminar"
                        variant="contained"
                        disabled={pausada}
                        color="primary"
                        startIcon={<Icon>check_circle_outline</Icon>}
                      >
                        Terminar
                      </Button>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="flex-end" justifyContent="flex-end" height={1}>
                    {!pausada ? (
                      <Button
                        id="pausar"
                        variant="contained"
                        disabled={!iniciada}
                        color="primary"
                        startIcon={<Icon>pause_circle_outline</Icon>}
                      >
                        Pausar
                      </Button>
                    ) : (
                      <Button
                        id="reanudar"
                        variant="contained"
                        color="primary"
                        startIcon={<Icon>not_started</Icon>}
                      >
                        Reanudar
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </QBox>
        </Box>
      )}
    </Quimera.Template>
  );
}

export default MontadoInternoDetalle;
