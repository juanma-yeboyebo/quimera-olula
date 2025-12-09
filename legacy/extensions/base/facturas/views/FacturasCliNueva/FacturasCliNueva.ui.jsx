import { Grid, QSection } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import React, { useEffect } from "react";

import { Cliente, DirCliente } from '@quimera-extension/base-ventas';
// import { Cliente, DirCliente } from "../../comps";

function FacturasCliNueva({ callbackGuardado, useStyles, ...props }) {
  const [{ factura }, dispatch] = useStateValue();
  const schema = getSchemas().facturaCliNueva;
  // const classes = useStyles()

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        callbackFacturaChanged: callbackGuardado,
        ...props,
      },
    });
  }, [callbackGuardado]);

  useEffect(() => {
    util.publishEvent(factura.event, callbackGuardado);
  }, [factura.event.serial]);

  return (
    <Quimera.Template id="FacturasCliNueva">
      <QSection
        actionPrefix="nuevaFactura"
        alwaysActive
        dynamicComp={() => (
          <Grid container>
            <Grid item xs={12}>
              <Cliente
                id="factura.buffer/codCliente"
                label={`Cliente ${factura.buffer.codCliente ?? ""}`}
                fullWidth
                async
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <DirCliente
                id="factura.buffer/codDir"
                codCliente={factura.buffer.codCliente}
                label="Dirección"
                fullWidth
              />
            </Grid>
          </Grid>
        )}
        saveDisabled={() => !schema.isValid(factura.buffer)}
      ></QSection>
    </Quimera.Template>
  );
}

export default FacturasCliNueva;
