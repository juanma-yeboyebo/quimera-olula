import { Box, Field, Grid, QBox, QSection } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

import { Consumidores } from "../../comps";

function VentaNueva({ callbackGuardado, callbackCerrado, desdeMaster, useStyles, ...props }) {
  const [{ venta, nuevoConsumidor }, dispatch] = useStateValue();
  const classes = useStyles();
  const schema = nuevoConsumidor
    ? getSchemas().nuevaVentaNuevoCli
    : getSchemas().nuevaVentaCliExistente;
  // const schemaConsumidor = getSchemas().consumidores;
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const anchoDetalle = mobile || desdeMaster ? 1 : 0.5;

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        callbackVentaChanged: callbackGuardado,
        ...props,
      },
    });
  }, [callbackGuardado]);

  useEffect(() => {
    util.publishEvent(venta.event, callbackGuardado);
  }, [venta.event.serial]);

  function nuevaVenta() {
    return (
      <>
        {/* <Box className={classes.cajaBotonesCliente}>
          <Button
            id="clienteExistente"
            variant="text"
            color="primary"
            text="Cliente existente"
            className={!nuevoConsumidor ? classes.botonSeleccionado : classes.botonNoSeleccionado}
          />
          <Button
            id="nuevoCliente"
            variant="text"
            color="primary"
            text="Nuevo cliente"
            className={nuevoConsumidor ? classes.botonSeleccionado : classes.botonNoSeleccionado}
          />
        </Box> */}
        <QSection
          actionPrefix="nuevaVenta"
          alwaysActive
          dynamicComp={() => (
            <Grid container spacing={1}>
              {!nuevoConsumidor && (
                <Grid item xs={12}>
                  <Consumidores
                    id="venta.buffer/idConsumidor"
                    label="Cliente"
                    idConsumidor={venta.buffer.idConsumidor}
                    fullWidth
                    async
                  />
                </Grid>
              )}
              {/* <Grid item xs={mobile ? 6 : 4}>
                <Field.Date id="venta.buffer/fechaVenta" label="Fecha venta" fullWidth />
              </Grid> */}
              <Grid item xs={mobile ? 6 : 4}>
                <Field.Currency
                  id="venta.buffer/importe"
                  label="Importe"
                  fullWidth
                  value={venta.buffer.importe === 0 ? "" : venta.buffer.importe}
                  autoComplete="off"
                  onClick={event => event.target.select()}
                />
              </Grid>
              {/* <Grid item xs={6}>
                <Field.Schema id="venta.buffer/codTicket" label="Ticket(opcional)" fullWidth />
              </Grid> */}
              {nuevoConsumidor && (
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Field.Schema
                      id="venta.buffer/nombreConsumidor"
                      label="Nombre"
                      fullWidth
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field.Schema
                      id="venta.buffer/apellidosConsumidor"
                      label="Apellidos"
                      fullWidth
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field.Schema
                      id="venta.buffer/telefonoConsumidor"
                      label="Teléfono"
                      fullWidth
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field.Schema
                      id="venta.buffer/cifnifConsumidor"
                      label="CIF/NIF"
                      fullWidth
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field.Date
                      id="venta.buffer/fechaNacimientoConsumidor"
                      label="Fecha Nacimiento"
                      fullWidth
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field.Schema
                      id="venta.buffer/emailConsumidor"
                      label="Email"
                      fullWidth
                      autoComplete="off"
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          )}
          saveDisabled={() => !schema.isValid(venta.buffer)}
          cancel={{ callback: callbackCerrado }}
        ></QSection>
      </>
    );
  }

  return (
    <Quimera.Template id="VentaNueva">
      <Box mx={desktop && !desdeMaster ? 0.5 : 0} width={anchoDetalle}>
        {desdeMaster ? (
          nuevaVenta()
        ) : (
          <QBox titulo={!desdeMaster ? "Nueva Venta" : ""}>{nuevaVenta()}</QBox>
        )}
      </Box>
    </Quimera.Template>
  );
}

export default VentaNueva;
