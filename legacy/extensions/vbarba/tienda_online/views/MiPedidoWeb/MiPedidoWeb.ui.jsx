import { Box, QBox, QListModel, QModelBox, QTitleBox, Typography, Button, Icon } from "@quimera/comps";
import { Totales } from "@quimera-extension/base-area_clientes";
import { DocAgente } from "@quimera-extension/base-ventas";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

import { MiLineaCarrito } from "../../comps";

function MiPedido({ callbackChanged, idCarrito, initCarrito, useStyles }) {
  const [{ lineas, logic, carrito, vistaDetalle }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    util.publishEvent(carrito.event, callbackChanged);
  }, [carrito.event.serial]);

  useEffect(() => {
    !!initCarrito &&
      dispatch({
        type: "onInitCarrito",
        payload: {
          initCarrito,
        },
      });
    !initCarrito &&
      !!idCarrito &&
      dispatch({
        type: "onInitCarritoById",
        payload: {
          action: "get_carritos_completados",
          idCarrito,
        },
      });
  }, [initCarrito, idCarrito]);

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().carrito;
  const editable = true;
  // const activoText = carrito.buffer.activo ? "(ACTIVO)" : "";
  const activoText = "";
  if ((!initCarrito && !idCarrito) || initCarrito?._status === "deleted") {
    return null;
  }

  if (idCarrito && !carrito.data.idCarrito) {
    return null;
  }

  return (
    <Quimera.Template id="CarritoDetalle">
      {carrito && (
        <QBox
          width={anchoDetalle}
          titulo={`Pedido ${carrito.buffer.codigo}${activoText}`}
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
        >
          <QModelBox id="carrito.buffer" disabled={!editable} schema={schema}>
            {vistaDetalle === "principal" ? (
              <Box>
                <QTitleBox>
                  <Typography variant="h5">{carrito.buffer.nombreCliente}</Typography>
                </QTitleBox>

                <Box display="flex" justifyContent="flex-end">
                  {/* <QSection
                    title="Observaciones"
                    actionPrefix="editarReferenciaCarrito"
                    collapsible={true}
                    dynamicComp={() => (
                      <Box display="flex" alignItems="center">
                        <Field.Schema id="carrito.buffer/referencia" schema={schema} fullWidth />
                      </Box>
                    )}
                    saveDisabled={() => !schema.isValid(carrito.buffer)}
                  >
                    <Typography variant="h7">{carrito.buffer.referencia}</Typography>
                  </QSection> */}
                  <Totales
                    totales={[
                      { name: "Neto", value: carrito.buffer.neto },
                      { name: "Total IVA", value: carrito.buffer.totalIva },
                      { name: "Total", value: carrito.buffer.total },
                    ]}
                  />
                </Box>
                <Box display="flex" justifyContent="center" style={{ gap: "25px" }}>
                  <Button
                    id="descargarPedido"
                    color="secondary"
                    title="Descargar pedido"
                    variant="contained"
                    startIcon={<Icon>file_download</Icon>}
                  >
                    Exportar a excel
                  </Button>
                </Box>
                <QListModel
                  data={lineas}
                  title="Líneas"
                  modelName="lineas"
                  ItemComponent={MiLineaCarrito}
                  itemProps={{
                    variant: "section",
                  }}
                  disabled={true}
                />
              </Box>
            ) : (
              <Box width={1}>
                <DocAgente />
              </Box>
            )}
          </QModelBox>
        </QBox>
      )}
    </Quimera.Template>
  );
}

export default MiPedido;
