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

function VentaComercio({ callbackChanged, idVenta, initVentaComercio, useStyles }) {
  const [{ ventaComercio, status, vistaDetalle }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    util.publishEvent(ventaComercio.event, callbackChanged);
  }, [ventaComercio.event.serial]);

  useEffect(() => {
    !!initVentaComercio &&
      dispatch({
        type: "onInitVentaComercio",
        payload: {
          initVentaComercio,
          callbackChanged,
        },
      });
    !initVentaComercio &&
      !!idVenta &&
      dispatch({
        type: "onInitVentaComercioById",
        payload: {
          idVenta,
          callbackChanged,
        },
      });
  }, [initVentaComercio, idVenta]);

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().ventasComercio;
  const editable = true;
  const titulo = `${ventaComercio.data.fechaVenta ? `${util.formatDate(ventaComercio.data.fechaVenta)} - ` : ""
    }${ventaComercio.data.importe ? `(${util.euros(ventaComercio.data.importe)})` : ""} `;

  if ((!initVentaComercio && !idVenta) || initVentaComercio?._status === "deleted") {
    return null;
  }

  if (idVenta && !ventaComercio.data.idVenta) {
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
    <Quimera.Template id="VentaComercio">
      {ventaComercio && (
        <QBox
          width={anchoDetalle}
          titulo={titulo}
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
          sideButtons={
            <>
              <QBoxButton
                id="deleteVentaComercio"
                title="Borrar venta"
                icon="delete"
                disabled={!editable}
              />
            </>
          }
        >
          <Grid container>
            <QModelBox id="ventaComercio.buffer" disabled={!editable} schema={schema}>
              <Grid item /* justify='center' */ xs={12} sm={12} md={12}>
                <QSection
                  title="Cliente"
                  actionPrefix="ventaComercio.buffer/idVenta"
                  alwaysInactive={true}
                  dynamicComp={() => (
                    <Box width={1}>
                      <Consumidores
                        id="ventaComercio.buffer/idConsumidor"
                        label="Cliente"
                        idConsumidor={ventaComercio.buffer.idConsumidor}
                        fullWidth
                        async
                      />
                      {/* <Field.Text id="ventaComercio.buffer.codConsumidor" label="" fullWidth /> */}
                    </Box>
                  )}
                >
                  <Box display="flex">
                    <Typography variant="body1">
                      {ventaComercio.buffer.nombreConsumidor || "Sin Nombre"}{" "}
                      {ventaComercio.buffer.apellidosConsumidor || ""}
                    </Typography>
                  </Box>
                </QSection>
              </Grid>

              <Grid item container xs={12} sm={12} md={12} justifyContent="space-between">
                <Box width={mobile ? 0.49 : 0.3}>
                  <QSection
                    title="Fecha Venta"
                    actionPrefix="ventaComercio.buffer/idVenta"
                    alwaysInactive
                    dynamicComp={() => (
                      <Box md={6}>
                        <Field.Date id="ventaComercio.buffer.fechaVenta" label="" fullWidth />
                      </Box>
                    )}
                  >
                    <Box display="flex">
                      <Typography variant="body1">
                        {util.formatDate(ventaComercio.buffer.fechaVenta) || "Sin fecha venta"}
                      </Typography>
                    </Box>
                  </QSection>
                </Box>
                <Box width={mobile ? 0.5 : 0.3}>
                  <QSection
                    title="Importe"
                    actionPrefix="ventaComercio.buffer/idVenta"
                    alwaysInactive={!editable}
                    // estilos={estilosBoxImporte}
                    dynamicComp={() => (
                      <Box>
                        <Field.Currency
                          id="ventaComercio.buffer.importe"
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
                        {util.euros(ventaComercio.buffer.importe || 0)}
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

export default VentaComercio;
