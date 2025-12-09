import { Grid, QSection } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import React, { useEffect } from "react";

function TemplateNameNuevo({ callbackGuardado, useStyles, ...props }) {
  const [{ templateNameNuevo }, dispatch] = useStateValue();
  templateSchema
  const schema = getSchemas().templateSchema;
  // const classes = useStyles()

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        callbackTemplateNameChanged: callbackGuardado,
        ...props,
      },
    });
  }, [callbackGuardado]);

  useEffect(() => {
    util.publishEvent(templateNameNuevo.event, callbackGuardado);
  }, [templateNameNuevo.event.serial]);

  return (
    <Quimera.Template id="TemplateNameNuevo">
      <QSection
        actionPrefix="nuevoTemplateName"
        alwaysActive
        dynamicComp={() => (
          <Grid container>
            <Grid item xs={12}>

            </Grid>
          </Grid>
        )}
        saveDisabled={() => !schema.isValid(templateNameNuevo.buffer)}
      ></QSection>
    </Quimera.Template>
  );
}

export default TemplateNameNuevo;
