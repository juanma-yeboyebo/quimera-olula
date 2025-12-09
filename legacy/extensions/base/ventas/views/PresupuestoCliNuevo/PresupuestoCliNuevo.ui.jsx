import { Grid, QSection } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import { useEffect } from "react";

import { Cliente, DirCliente } from "../../comps";

function PresupuestoCliNuevo({ callbackGuardado, useStyles, ...props }) {
  const [{ presupuesto }, dispatch] = useStateValue();
  const schema = getSchemas().presupuestoCliNuevo;

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        callbackPresupuestoChanged: callbackGuardado,
        ...props,
      },
    });
  }, [callbackGuardado]);

  useEffect(() => {
    util.publishEvent(presupuesto.event, callbackGuardado);
  }, [presupuesto.event.serial]);

  return (
    <Quimera.Template id="PresupuestoCliNuevo">
      <QSection
        actionPrefix="nuevoPresupuesto"
        alwaysActive
        dynamicComp={() => (
          <Grid container>
            <Grid item xs={12}>
              <Cliente
                id="presupuesto.buffer/codCliente"
                label={`Cliente ${presupuesto.buffer.codCliente ?? ""}`}
                fullWidth
                async
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <DirCliente
                id="presupuesto.buffer/codDir"
                codCliente={presupuesto.buffer.codCliente}
                label="Dirección"
                fullWidth
              />
            </Grid>
          </Grid>
        )}
        saveDisabled={() => !schema.isValid(presupuesto.buffer)}
      ></QSection>
    </Quimera.Template>
  );
}

export default PresupuestoCliNuevo;
