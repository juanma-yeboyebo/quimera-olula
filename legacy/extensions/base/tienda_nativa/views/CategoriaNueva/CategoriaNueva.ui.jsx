import { Field, Grid, QSection } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import React, { useEffect } from "react";

function CategoriaNueva({ callbackGuardado, useStyles, ...props }) {
  const [{ categoria }, dispatch] = useStateValue();
  const schema = getSchemas().categorias;
  // const classes = useStyles()

  useEffect(() => {
    util.publishEvent(categoria.event, callbackGuardado);
  }, [categoria.event.serial]);

  return (
    <Quimera.Template id="CategoriaNueva">
      <QSection
        actionPrefix="nuevaCategoria"
        title="Nueva categoria"
        alwaysActive
        dynamicComp={() => (
          <Grid container>
            <Grid item xs={12}>
              <Field.Schema id="categoria.buffer/nombre" schema={schema} fullWidth autoFocus />
            </Grid>
          </Grid>
        )}
        saveDisabled={() => !schema.isValid(categoria)}
      ></QSection>
    </Quimera.Template>
  );
}

export default CategoriaNueva;
