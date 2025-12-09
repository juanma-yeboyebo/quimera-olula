import { Box, Field, Grid, QBox, QSection, Typography } from "@quimera/comps";
import { SelectorValores } from "@quimera-extension/base-almacen";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

function DatosComercio({ callbackGuardado, useStyles, ...props }) {
  const [{ comercio }, dispatch] = useStateValue();
  const schema = getSchemas().comercios;
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
  //   util.publishEvent(comercio.event, callbackGuardado);
  // }, [comercio.event.serial]);

  const tiposComercio = [
    { key: "Restauracion", value: "Restauración" },
    { key: "Comercio", value: "Comercio" },
  ];

  return (
    <Quimera.Template id="DatosComercio">
      <Box mx={desktop ? 0.5 : 0} width={anchoDetalle}>
        <QBox titulo={"Mis datos"}>
          <QSection
            actionPrefix="comercio"
            alwaysActive
            dynamicComp={() => (
              <Grid container spacing={1} style={{ marginBottom: "8px" }}>
                <Grid item xs={12}>
                  <Field.Schema
                    id="comercio.nombre"
                    label={"Nombre"}
                    fullWidth
                    autoComplete="off"
                    disabled
                    onClick={event => event.target.select()}
                  />
                </Grid>
                <Grid item xs={mobile ? 12 : 8}>
                  <Field.Schema id="comercio.email" label={"Email"} fullWidth disabled />
                </Grid>
                <Grid item xs={mobile ? 0 : 1} />
                <Grid item xs={mobile ? 12 : 3}>
                  <Field.Schema
                    id="comercio.cifnif"
                    label={"Cif/Nif"}
                    fullWidth
                    autoComplete="off"
                    disabled
                    onClick={event => event.target.select()}
                  />
                </Grid>
                <Grid item xs={6}>
                  <SelectorValores
                    id="comercio.tipo"
                    stateField="tipo"
                    label="Tipo"
                    valores={tiposComercio}
                    value={comercio.tipo}
                    arrayKeyValue
                    disabled
                    fullWidth
                  ></SelectorValores>
                </Grid>
                <Grid item xs={12}>
                  <Box mt={2}>
                    <Typography variant="body">
                      Si alguno de los datos no son correctos, desea cambiarlos o tiene alguna duda,
                      por favor envíenos un correo electrónico a{" "}
                      <a href="mailto:info@almansaentucorazon.es">info@almansaentucorazon.es</a>.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}
            // saveDisabled={() => !schema.isValid(comercio)}
            save={{ display: "none" }}
            cancel={{ display: "none" }}
          ></QSection>
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default DatosComercio;
