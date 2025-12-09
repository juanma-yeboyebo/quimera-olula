import { Grid, QSection } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import React, { useEffect } from "react";

// import { Cliente, DirCliente } from '@quimera-extension/base-ventas'
import { Cliente, DirCliente } from "../../comps";

function PedidosCliNuevo({ callbackGuardado, useStyles, ...props }) {
  const [{ pedido }, dispatch] = useStateValue();
  const schema = getSchemas().pedidoCliNuevo;
  // const classes = useStyles()

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        callbackPedidoChanged: callbackGuardado,
        ...props,
      },
    });
  }, [callbackGuardado]);

  useEffect(() => {
    util.publishEvent(pedido.event, callbackGuardado);
  }, [pedido.event.serial]);

  return (
    <Quimera.Template id="PedidosCliNuevo">
      <QSection
        actionPrefix="nuevoPedido"
        alwaysActive
        dynamicComp={() => (
          <Grid container>
            <Grid item xs={12}>
              <Cliente
                id="pedido.buffer/codCliente"
                label={`Cliente ${pedido.buffer.codCliente ?? ""}`}
                fullWidth
                async
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <DirCliente
                id="pedido.buffer/codDir"
                codCliente={pedido.buffer.codCliente}
                label="Dirección"
                fullWidth
              />
            </Grid>
          </Grid>
        )}
        saveDisabled={() => !schema.isValid(pedido.buffer)}
      ></QSection>
    </Quimera.Template>
  );
}

export default PedidosCliNuevo;
