import { Button, Grid, Icon, QSection } from "@quimera/comps";
import { CircularProgress } from "@quimera/thirdparty";
import { SelectorValores } from "@quimera-extension/base-almacen";
import { Cliente, DirCliente } from "@quimera-extension/base-ventas";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import { useEffect } from "react";

import { Evento, TratosPresupuesto } from "../../../comps";

function PresupuestosCliNuevoRegistrado({ callback, presupuesto, tratosAgente }) {
  const [{ dirCanaria, origenMercanciaOptions, idTratoProp, savingPresupuesto }, dispatch] =
    useStateValue();

  const schema = getSchemas().presupuestoCliNuevo; //t

  useEffect(() => {
    dispatch({
      type: "onDireccionCambiada",
      payload: { codDir: presupuesto.buffer.codDir },
    });
  }, [presupuesto.buffer.codDir]);

  // console.log("mimensaje_RegistradoPresupuesto", presupuesto);

  useEffect(() => {
    util.publishEvent(presupuesto.event, callback);
  }, [presupuesto.event.serial]);

  return (
    <Quimera.Template id="PresupuestosCliNuevoRegistrado">
      <QSection
        actionPrefix="nuevoPresupuesto"
        alwaysActive
        dynamicComp={() => (
          <Grid container direction="column">
            <Grid item xs={12}>
              <Cliente
                id="presupuesto.buffer/codCliente"
                label={`Cliente ${presupuesto.buffer.codCliente ?? ""}`}
                filtros={{ incluir_baja: false }}
                fullWidth
                async
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <DirCliente
                id="presupuesto.buffer/codDir"
                codCliente={presupuesto.buffer.codCliente}
                soloDirEnvio={true}
                label="Dirección"
                fullWidth
              />
            </Grid>
            {dirCanaria && (
              <Grid item xs={12}>
                <SelectorValores
                  id="presupuesto.buffer.regimenIva"
                  label="Origen de salida"
                  valores={origenMercanciaOptions}
                  value={presupuesto.buffer.regimenIva}
                  arrayKeyValue
                  fullWidth
                ></SelectorValores>
              </Grid>
            )}
            <Grid item xs={12}>
              <Evento
                id="presupuesto.buffer/codEvento"
                codEvento={presupuesto.buffer.codEvento}
                label="Evento"
                meses={2}
                fullWidth
              />
            </Grid>
            {!idTratoProp && (
              <Grid item xs={12} container justifyContent="flex-end">
                <TratosPresupuesto
                  id="presupuesto.buffer/idTrato"
                  idTrato={presupuesto.buffer.idTrato}
                  codCliente={presupuesto.buffer.codCliente}
                  label="Trato"
                  fullWidth
                />
                <Button id="nuevoTrato" variant="text" text="+ Nuevo trato" color="primary" />
              </Grid>
            )}
          </Grid>
        )}
        save={{
          icon: savingPresupuesto ? <CircularProgress /> : <Icon>close</Icon>,
          text: savingPresupuesto ? "Creando presupuesto" : "Crear presupuesto",
          disabled: () => savingPresupuesto,
        }}
        cancel={{
          disabled: () => savingPresupuesto,
        }}
        saveDisabled={() => !schema.isValid(presupuesto.buffer)}
      ></QSection>
    </Quimera.Template>
  );
}

export default PresupuestosCliNuevoRegistrado;
