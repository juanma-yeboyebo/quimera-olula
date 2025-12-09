import { Field, Grid, QSection } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

function CampanaNueva({ callbackGuardado, useStyles, ...props }) {
  const [{ campana }, dispatch] = useStateValue();
  const schema = getSchemas().campanas;
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  // const classes = useStyles()

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        callbackCampanaChanged: callbackGuardado,
        ...props,
      },
    });
  }, [callbackGuardado]);

  useEffect(() => {
    util.publishEvent(campana.event, callbackGuardado);
  }, [campana.event.serial]);

  return (
    <Quimera.Template id="CampanaNueva">
      <QSection
        actionPrefix="nuevoCampana"
        alwaysActive
        dynamicComp={() => (
          <Grid container>
            <Grid item xs={12}>
              <Field.Schema
                id="campana.buffer/nombre"
                label="Nombre"
                fullWidth
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={mobile ? 12 : 4}>
              <Field.Date
                id="campana.buffer/fechaInicio"
                label="Fecha inicio"
                fullWidth
                autoComplete="off"
              />
            </Grid>
            {/* <Grid item xs={12}>
              <Field.Currency
                id="campana.buffer/topeConsumidorComercio"
                label="Tope consumidor comercio"
                fullWidth
              />
            </Grid> */}
          </Grid>
        )}
        saveDisabled={() => !schema.isValid(campana.buffer)}
      ></QSection>
    </Quimera.Template>
  );
}

export default CampanaNueva;
