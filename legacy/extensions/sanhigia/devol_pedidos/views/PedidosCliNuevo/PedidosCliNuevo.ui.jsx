import { Grid, Icon, QSection } from "@quimera/comps";
import { CircularProgress } from "@quimera/thirdparty";
import { SelectorValores } from "@quimera-extension/base-almacen";
import { Cliente, DirCliente } from "@quimera-extension/base-ventas";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import React, { useEffect } from "react";

import { Evento } from "../../comps";

function PedidosCliNuevo({
  callbackGuardado,
  codAgenteProp,
  codAgenteMktProp,
  useStyles,
  ...props
}) {
  const [{ dirCanaria, origenMercanciaOptions, pedido, savingPedido }, dispatch] = useStateValue();
  const schema = getSchemas().pedidoCliNuevo;
  // const classes = useStyles()

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        callbackPedidoChanged: callbackGuardado,
        codAgenteProp,
        codAgenteMktProp,
        ...props,
      },
    });
  }, [callbackGuardado]);

  useEffect(() => {
    dispatch({
      type: "onDireccionCambiada",
      payload: { codDir: pedido.buffer.codDir },
    });
  }, [pedido.buffer.codDir]);

  useEffect(() => {
    util.publishEvent(pedido.event, callbackGuardado);
  }, [pedido.event.serial]);

  // console.log("mimensaje_pedido", pedido?.buffer.regimenIva);

  return (
    <Quimera.Template id="PedidosCliNuevo">
      <QSection
        actionPrefix="nuevoPedido"
        alwaysActive
        dynamicComp={() => (
          <Grid container direction="column">
            <Grid item xs={12}>
              <Cliente
                id="pedido.buffer/codCliente"
                label={`Cliente ${pedido.buffer.codCliente ?? ""}`}
                filtros={{ incluir_baja: false }}
                fullWidth
                async
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <DirCliente
                id="pedido.buffer/codDir"
                codCliente={pedido.buffer.codCliente}
                soloDirEnvio={true}
                label="Dirección"
                fullWidth
              />
            </Grid>
            {dirCanaria && (
              <Grid item xs={12}>
                <SelectorValores
                  id="pedido.buffer.regimenIva"
                  label="Origen de salida"
                  valores={origenMercanciaOptions}
                  value={pedido.buffer.regimenIva}
                  arrayKeyValue
                  fullWidth
                ></SelectorValores>
              </Grid>
            )}
            <Grid item xs={12}>
              <Evento
                id="pedido.buffer/codEvento"
                codEvento={pedido.buffer.codEvento}
                label="Evento"
                meses={2}
                fullWidth
              />
            </Grid>
          </Grid>
        )}
        save={{
          icon: savingPedido ? <CircularProgress /> : <Icon>close</Icon>,
          text: savingPedido ? "Creando pedido" : "Crear pedido",
          disabled: () => savingPedido,
        }}
        cancel={{
          disabled: () => savingPedido,
        }}
        saveDisabled={() => !schema.isValid(pedido.buffer)}
      ></QSection>
    </Quimera.Template>
  );
}

export default PedidosCliNuevo;
