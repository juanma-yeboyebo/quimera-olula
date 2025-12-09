import { Box, Button, Icon, QBox, QListModel, QModelBox, QTitleBox, QBoxButton, Typography } from "@quimera/comps";
import { DocAgente } from "@quimera-extension/base-ventas";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useCallback, useEffect } from "react";

import { Direccion, MiLineaPedido, Totales } from "@quimera-extension/base-area_clientes";

function MiPedido({ callbackChanged, idPedido, initPedido, useStyles }) {
  const [{ lineas, logic, pedido, vistaDetalle }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    util.publishEvent(pedido.event, callbackChanged);
  }, [pedido.event.serial]);

  useEffect(() => {
    !!initPedido &&
      dispatch({
        type: "onInitPedido",
        payload: {
          initPedido,
        },
      });
    !initPedido &&
      !!idPedido &&
      dispatch({
        type: "onInitPedidoById",
        payload: {
          idPedido,
        },
      });
  }, [initPedido, idPedido]);

  // Necesario para que no salte el useEffect de onInit en cada render de LineaPedidoCliNueva
  const callbackNuevaLinea = useCallback(
    payload => dispatch({ type: "onLineaCreada", payload }),
    [dispatch],
  );

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().misPedidos;
  const editable = logic.pedidoEditable(pedido.data);

  if ((!initPedido && !idPedido) || initPedido?._status === "deleted") {
    return null;
  }

  if (idPedido && !pedido.data.idPedido) {
    return null;
  }

  return (
    <Quimera.Template id="PedidoDetalle">
      {pedido && (
        <QBox
          width={anchoDetalle}
          titulo={`Pedido ${pedido.data.codigo}`}
          botonesCabecera={[
            { icon: "arrow_back", id: "atras", text: "Atrás" },
          ]}
          sideButtons={
            <QBoxButton
              id="descargarPedido"
              title="Descargar pedido"
              icon="receipt"
              disabled={false}
            />
          }
        >
          <QModelBox id="pedido.buffer" disabled={!editable} schema={schema}>
            {vistaDetalle === "principal" ? (
              <Box>
                <QTitleBox titulo={`Cliente`}>
                  <Typography variant="h5">{pedido.buffer.nombreCliente}</Typography>
                </QTitleBox>
                <QTitleBox titulo="Dirección">
                  <Direccion documento={pedido.buffer} inline />
                </QTitleBox>

                <Box display="flex" justifyContent="space-between">
                  <QTitleBox titulo="Fecha">
                    <Box display="flex" alignItems="center">
                      <Box mr={1}>
                        <Icon color="action" fontSize="default">
                          event
                        </Icon>
                      </Box>
                      <Typography variant="h5">{util.formatDate(pedido.buffer.fecha)}</Typography>
                    </Box>
                  </QTitleBox>
                  <Totales
                    totales={[
                      { name: "Neto", value: pedido.buffer.neto },
                      { name: "Total IVA", value: pedido.buffer.totalIva },
                      { name: "Total", value: pedido.buffer.total },
                    ]}
                  />
                </Box>
                <Box display="flex" justifyContent="center" style={{ gap: "25px" }}>
                  <Button
                    id="exportarPedido"
                    color="secondary"
                    title="Exportar pedido"
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
                  ItemComponent={MiLineaPedido}
                  itemProps={{
                    variant: "section",
                  }}
                  disabled={!editable}
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
