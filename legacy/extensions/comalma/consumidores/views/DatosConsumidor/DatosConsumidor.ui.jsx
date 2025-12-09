import { Box, Field, Grid, QBox, QSection, Typography } from "@quimera/comps";
import { SelectorValores } from "@quimera-extension/base-almacen";
import { Provincia } from "@quimera-extension/base-ventas";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

function DatosConsumidor({ callbackGuardado, useStyles, ...props }) {
  const [{ consumidor }, dispatch] = useStateValue();
  const schema = getSchemas().consumidores;
  // const classes = useStyles()
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const anchoDetalle = mobile ? 1 : 0.5;

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        email: util.getUser().user,
      },
    });
  }, []);

  // useEffect(() => {
  //   util.publishEvent(consumidor.event, callbackGuardado);
  // }, [consumidor.event.serial]);

  const tiposGenero = [
    { key: "Hombre", value: "Hombre" },
    { key: "Mujer", value: "Mujer" },
    { key: "Otro", value: "Otro" },
  ];

  return (
    <Quimera.Template id="DatosConsumidor">
      <Box mx={desktop ? 0.5 : 0} width={anchoDetalle}>
        <QBox titulo={"Mis datos"}>
          <QSection
            actionPrefix="consumidor"
            alwaysActive
            dynamicComp={() => (
              <Grid container>
                <Grid item xs={mobile ? 12 : 5}>
                  <Field.Schema
                    id="consumidor.nombre"
                    label={"Nombre"}
                    fullWidth
                    autoComplete="off"
                    onClick={event => event.target.select()}
                  />
                </Grid>
                <Grid item xs={mobile ? 0 : 1} />
                <Grid item xs={mobile ? 12 : 6}>
                  <Field.Schema
                    id="consumidor.apellidos"
                    label={"Apellidos"}
                    fullWidth
                    autoComplete="off"
                    onClick={event => event.target.select()}
                  />
                </Grid>

                <Grid item xs={mobile ? 12 : 8}>
                  <Field.Schema
                    id="consumidor.email"
                    label={"Email"}
                    fullWidth
                    disabled
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={mobile ? 0 : 1} />
                <Grid item xs={mobile ? 12 : 3}>
                  <Field.Schema
                    id="consumidor.telefono"
                    label={"Teléfono"}
                    fullWidth
                    autoComplete="off"
                    onClick={event => event.target.select()}
                  />
                </Grid>

                <Grid item xs={mobile ? 12 : 5}>
                  <Field.Schema
                    id="consumidor.cifnif"
                    label={"D.N.I./Pasaporte/Tarjeta Residencia"}
                    fullWidth
                    autoComplete="off"
                    onClick={event => event.target.select()}
                  />
                </Grid>
                <Grid item xs={mobile ? 0 : 4} />
                <Grid item xs={mobile ? 12 : 3}>
                  <Field.Date
                    id="consumidor.fechaNacimiento"
                    label="Fecha de nacimiento"
                    fullWidth
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={mobile ? 12 : 3}>
                  <Field.Text
                    id="consumidor.ciudad"
                    label="Ciudad"
                    fullWidth
                    autoComplete="off"
                    onClick={event => event.target.select()}
                  />
                </Grid>
                <Grid item xs={mobile ? 0 : 1} />
                <Grid item xs={mobile ? 12 : 3}>
                  <Field.Text
                    id="consumidor.codPostal"
                    label="Código postal"
                    fullWidth
                    autoComplete="off"
                    onClick={event => event.target.select()}
                  />
                </Grid>
                <Grid item xs={mobile ? 0 : 1} />
                <Grid item xs={mobile ? 12 : 4}>
                  <Provincia id="consumidor.provincia" label="Provincia" fullWidth />
                </Grid>

                {/* <Grid item xs={mobile ? 0 : 1} /> */}
                <Grid
                  item
                  xs={mobile ? 12 : 3}
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    paddingBottom: "4px",
                  }}
                >
                  <SelectorValores
                    id="consumidor.genero"
                    stateField="genero"
                    label="Género"
                    valores={tiposGenero}
                    value={consumidor.genero}
                    arrayKeyValue
                    fullWidth
                  ></SelectorValores>
                </Grid>
                <Box
                  my={2}
                  width={1}
                  display={"flex"}
                  flexDirection={"column"}
                  style={{ gap: mobile ? "15px" : "none" }}
                >
                  <Grid item xs={12}>
                    <Field.CheckBox
                      id="consumidor.aceptaCondiciones"
                      label={
                        <Typography>
                          He leido y acepto la política de{" "}
                          <a
                            href="https://www.almansaentucorazon.es/politica-privacidad/"
                            target="_blank"
                          >
                            privacidad
                          </a>
                        </Typography>
                      }
                      checked={consumidor.aceptaCondiciones}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field.CheckBox
                      id="consumidor.aceptaComunicacion"
                      label="Quiero recibir novedades y comunicaciones promocionales de almansaentucorazon"
                      checked={consumidor.aceptaComunicacion}
                    />
                  </Grid>
                </Box>
              </Grid>
            )}
            saveDisabled={() => !schema.isValid(consumidor)}
            cancel={{ display: "none" }}
          ></QSection>
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default DatosConsumidor;
