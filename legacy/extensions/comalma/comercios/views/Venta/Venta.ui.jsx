import {
  Box,
  Field,
  Grid,
  QBox,
  QBoxButton,
  QModelBox,
  QSection,
  Typography,
} from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

import { Consumidores } from "../../comps";

function Venta({ callbackChanged, idVenta, initVenta, useStyles }) {
  const [{ venta, status, vistaDetalle }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    util.publishEvent(venta.event, callbackChanged);
  }, [venta.event.serial]);

  useEffect(() => {
    !!initVenta &&
      dispatch({
        type: "onInitVenta",
        payload: {
          initVenta,
          callbackChanged,
        },
      });
    !initVenta &&
      !!idVenta &&
      dispatch({
        type: "onInitVentaById",
        payload: {
          idVenta,
          callbackChanged,
        },
      });
  }, [initVenta, idVenta]);

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().ventas;
  const editable = true;
  const titulo = `${venta.data.fechaVenta ? `${util.formatDate(venta.data.fechaVenta)} - ` : ""}${venta.data.importe ? `(${util.euros(venta.data.importe)})` : ""
    } `;

  if ((!initVenta && !idVenta) || initVenta?._status === "deleted") {
    return null;
  }

  if (idVenta && !venta.data.idVenta) {
    return null;
  }

  const estilosBoxImporte = {
    box: {
      activada: classes.neutro,
      desactivada: classes.neutro,
      inhabilitada: classes.neutro,
    },
  };

  return (
    <Quimera.Template id="Venta">
      {venta && (
        <QBox
          width={anchoDetalle}
          titulo={titulo}
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
          sideButtons={
            <>
              <QBoxButton
                id="deleteVenta"
                title="Borrar venta"
                icon="delete"
                disabled={!editable}
              />
            </>
          }
        >
          <Grid container>
            <QModelBox id="venta.buffer" disabled={!editable} schema={schema}>
              <Grid item /* justify='center' */ xs={12} sm={12} md={12}>
                <QSection
                  title="Cliente"
                  actionPrefix="venta.buffer/idVenta"
                  alwaysInactive={true}
                  dynamicComp={() => (
                    <Box width={1}>
                      <Consumidores
                        id="venta.buffer/idConsumidor"
                        label="Cliente"
                        idConsumidor={venta.buffer.idConsumidor}
                        fullWidth
                        async
                      />
                      {/* <Field.Text id="venta.buffer.codConsumidor" label="" fullWidth /> */}
                    </Box>
                  )}
                >
                  <Box display="flex">
                    <Typography variant="body1">
                      {venta.buffer.nombreConsumidor || "Sin Nombre"}{" "}
                      {venta.buffer.apellidosConsumidor || ""}
                    </Typography>
                  </Box>
                </QSection>
              </Grid>

              <Grid item container xs={12} sm={12} md={12} justifyContent="space-between">
                <Box width={mobile ? 0.49 : 0.3}>
                  <QSection
                    title="Fecha Venta"
                    actionPrefix="venta.buffer/idVenta"
                    alwaysInactive
                    dynamicComp={() => (
                      <Box md={6}>
                        <Field.Date
                          id="venta.buffer.fechaVenta"
                          label=""
                          fullWidth
                          autoComplete="off"
                        />
                      </Box>
                    )}
                  >
                    <Box display="flex">
                      <Typography variant="body1">
                        {util.formatDate(venta.buffer.fechaVenta) || "Sin fecha venta"}
                      </Typography>
                    </Box>
                  </QSection>
                </Box>
                <Box width={mobile ? 0.5 : 0.3}>
                  <QSection
                    title="Importe"
                    actionPrefix="venta.buffer/idVenta"
                    alwaysInactive={!editable}
                    // estilos={estilosBoxImporte}
                    dynamicComp={() => (
                      <Box>
                        <Field.Currency
                          id="venta.buffer.importe"
                          label=""
                          fullWidth
                          autoComplete="off"
                          onClick={event => event.target.select()}
                        />
                      </Box>
                    )}
                  >
                    <Box display="flex" md={6}>
                      <Typography variant="body1">
                        {util.euros(venta.buffer.importe || 0)}
                      </Typography>
                    </Box>
                  </QSection>
                </Box>
              </Grid>
            </QModelBox>
          </Grid>
        </QBox>
      )}
    </Quimera.Template>
  );
}

export default Venta;
