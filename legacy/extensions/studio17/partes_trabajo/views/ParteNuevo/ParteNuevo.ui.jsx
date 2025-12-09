import { Box, Field, Grid, QSection } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, util } from "quimera";
import React, { useEffect, useRef } from "react";

//import { QArticulo } from '@quimera-extension/base-almacen'

function ParteNuevo({ callbackGuardado, callbackChanged, useStyles, ...props }) {
  const [{ focusArticulo, parte }, dispatch] = useStateValue();
  const schema = getSchemas().partesTrabajo;
  const inputProducto = useRef(null);
  // const _c = useStyles()

  useEffect(() => {
    dispatch({
      type: "onInitParte",
      callbackParteChanged: callbackGuardado,
      payload: {
        ...props,
        initParte: {
          codParte: '0',
          fecha: new Date().toISOString().substring(0, 10),
          estadoParte: 'Borrador'
        }
      },
    });
  }, [callbackGuardado]);

  useEffect(() => {
    util.publishEvent(parte.event, callbackGuardado);
  }, [parte.event.serial]);

  useEffect(() => {
    inputProducto?.current && inputProducto.current.focus();
  }, [focusArticulo]);

  return (
    <Quimera.Template id="ParteNuevo">
      <QSection
        title="Nuevo Parte"
        actionPrefix="nuevoParte"
        alwaysActive
        dynamicComp={() => (
          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            <Grid item xs={4}>
              <Field.Date id="parte.buffer/fecha" label="Fecha" fullWidth />
              {/* <Field.Date id="parteNuevoFecha" label="Fecha" fullWidth /> */}
            </Grid>
          </Box>
        )}
        saveDisabled={() => !schema.isValid(parte.buffer)}
        save={{
          text: "Crear parte",
        }}
      ></QSection>
    </Quimera.Template>
  );
}

export default ParteNuevo;
