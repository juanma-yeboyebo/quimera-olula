import { Grid, QSection } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import React, { useEffect } from "react";

import { Cliente, DirCliente } from '@quimera-extension/base-ventas';
// import { Cliente, DirCliente } from "../../comps";

function AlbaranesCliNuevo({ callbackGuardado, useStyles, ...props }) {
  const [{ albaran }, dispatch] = useStateValue();
  const schema = getSchemas().albaranCliNuevo;
  // const classes = useStyles()

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        callbackAlbaranChanged: callbackGuardado,
        ...props,
      },
    });
  }, [callbackGuardado]);

  useEffect(() => {
    util.publishEvent(albaran.event, callbackGuardado);
  }, [albaran.event.serial]);

  return (
    <Quimera.Template id="AlbaranesCliNuevo">
      <QSection
        actionPrefix="nuevoAlbaran"
        alwaysActive
        dynamicComp={() => (
          <Grid container>
            <Grid item xs={12}>
              <Cliente
                id="albaran.buffer/codCliente"
                label={`Cliente ${albaran.buffer.codCliente ?? ""}`}
                fullWidth
                async
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <DirCliente
                id="albaran.buffer/codDir"
                codCliente={albaran.buffer.codCliente}
                label="Dirección"
                fullWidth
              />
            </Grid>
          </Grid>
        )}
        saveDisabled={() => !schema.isValid(albaran.buffer)}
      ></QSection>
    </Quimera.Template>
  );
}

export default AlbaranesCliNuevo;
