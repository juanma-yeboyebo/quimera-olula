import { Button, Field, Grid, Icon, QSection } from "@quimera/comps";
import { CircularProgress } from "@quimera/thirdparty";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import { useEffect } from "react";

import { Evento, TratosPresupuesto } from "../../../comps";

function PresupuestosCliNuevoNoRegistrado({ callback, presupuesto, tratosAgente }) {
  const [{ idTratoProp, savingPresupuesto }, dispatch] = useStateValue();
  const schema = getSchemas().presupuestoCliNuevoNoRegistrado;

  // console.log('mimensaje_NoRegistrado', "hola");
  // console.log('mimensaje_presupuestoNoRegistrado', presupuesto);

  useEffect(() => {
    util.publishEvent(presupuesto.event, callback);
  }, [presupuesto.event.serial]);

  return (
    <Quimera.Template id="PresupuestosCliNuevoNoRegistrado">
      <QSection
        actionPrefix="nuevoPresupuestoNoRegistrado"
        alwaysActive
        dynamicComp={() => (
          <Grid container direction="column">
            <Grid item xs={12}>
              <Field.Text
                id="presupuestoNoRegistrado.buffer/nombre"
                label="Nombre"
                fullWidth
                async
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <Field.Text
                id="presupuestoNoRegistrado.buffer/direccion"
                label="Direccion"
                fullWidth
                async
              />
            </Grid>
            <Grid item xs={12}>
              <Evento
                id="presupuestoNoRegistrado.buffer/codEvento"
                codEvento={presupuesto.buffer.codEvento}
                label="Evento"
                meses={2}
                fullWidth
              />
            </Grid>
            {!idTratoProp && (
              <Grid item xs={12} container justifyContent="flex-end">
                <TratosPresupuesto
                  id="presupuestoNoRegistrado.buffer/idTrato"
                  idTrato={presupuesto.buffer.idTrato}
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

export default PresupuestosCliNuevoNoRegistrado;
