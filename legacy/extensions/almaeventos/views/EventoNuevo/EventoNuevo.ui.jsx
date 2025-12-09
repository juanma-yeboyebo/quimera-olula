import { Field, Grid, QSection } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth } from "quimera";
import React, { useEffect } from "react";

import { EventosFieldSelect } from "../../comps";

function EventoNuevo({ callbackGuardado, callbackCerrado, useStyles, ...props }) {
  const [{ evento }, dispatch] = useStateValue();
  const schema = getSchemas().eventos;
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  // const classes = useStyles()

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        callbackGuardado,
        ...props,
      },
    });
  }, [callbackGuardado]);

  return (
    <Quimera.Template id="EventoNuevo">
      <QSection
        actionPrefix="nuevoEvento"
        alwaysActive
        dynamicComp={() => (
          <Grid container>
            <Grid item xs={12}>
              <EventosFieldSelect id="evento.buffer/referencia" label="Producto" fullWidth async />
            </Grid>
            <Grid item xs={12}>
              <Field.Schema
                id="evento.buffer/descripcion"
                label="Nombre"
                fullWidth
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12}>
              <Field.Date
                id="evento.buffer/fechaInicio"
                label="Fecha"
                fullWidth
                autoComplete="off"
              />
            </Grid>
          </Grid>
        )}
        cancel={{ callback: callbackCerrado }}
        saveDisabled={() => !schema.isValid(evento.buffer)}
      ></QSection>
    </Quimera.Template>
  );
}

export default EventoNuevo;
