import { Field, Grid, QSection } from "@quimera/comps";
import { SelectorValores } from "@quimera-extension/base-almacen";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

function ComercioNuevo({ callbackGuardado, useStyles, ...props }) {
  const [{ comercio }, dispatch] = useStateValue();
  const schema = getSchemas().comercios;
  // const classes = useStyles()
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        callbackComercioChanged: callbackGuardado,
        ...props,
      },
    });
  }, [callbackGuardado]);

  useEffect(() => {
    util.publishEvent(comercio.event, callbackGuardado);
  }, [comercio.event.serial]);

  const tiposComercio = [
    { key: "Restauracion", value: "Restauración" },
    { key: "Comercio", value: "Comercio" },
  ];

  return (
    <Quimera.Template id="ComercioNuevo">
      <QSection
        actionPrefix="nuevoComercio"
        alwaysActive
        dynamicComp={() => (
          <Grid container>
            <Grid item xs={12}>
              <Field.Schema
                id="comercio.buffer/nombre"
                label={"Nombre"}
                fullWidth
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12}>
              <Field.Schema
                id="comercio.buffer/email"
                label={"Email"}
                fullWidth
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={mobile ? 12 : 3}>
              <Field.Schema
                id="comercio.buffer/cifnif"
                label={"CIF/NIF"}
                fullWidth
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={mobile ? 0 : 1} />
            <Grid
              item
              xs={mobile ? 12 : 3}
              style={{
                display: "flex",
                alignItems: "flex-end",
                paddingBottom: "4px",
              }}
            >
              <SelectorValores
                id="comercio.buffer/tipo"
                stateField="tipo"
                label="Tipo"
                valores={tiposComercio}
                value={comercio.buffer.tipo}
                arrayKeyValue
                fullWidth
              ></SelectorValores>
            </Grid>
          </Grid>
        )}
        saveDisabled={() => !schema.isValid(comercio.buffer)}
      ></QSection>
    </Quimera.Template>
  );
}

export default ComercioNuevo;
