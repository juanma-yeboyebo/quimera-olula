import { Box, QBox, QBoxButton, QListModel, QModelBox, QSection } from "@quimera/comps";
import { Totales } from "@quimera-extension/base-area_clientes";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth } from "quimera";
import React from "react";

import {
  DocAgente,
  DocClienteYDir,
  DocDirCliente,
  DocFecha,
  LineaPedidoCliComp as LineaPedidoCli,
} from "../../../comps";

function PedidoDetalle({ useStyles }) {
  const [{ lineas, logic, pedidos, vistaDetalle }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const pedido = pedidos.dict[pedidos.current];
  const schema = getSchemas().pedidos;
  const editable = logic.pedidoEditable(pedido);

  return (
    <Quimera.Template id="PedidoDetalle">
      {pedidos.dict[pedidos.current] && (
        <QBox
          width={anchoDetalle}
          titulo={`Pedido ${pedidos.dict[pedidos.current].codigo}`}
          botonesCabecera={[
            { icon: "more_horiz", id: "mas", text: "Más" },
            { icon: "arrow_back", id: "atras", text: "Atrás" },
          ]}
          sideButtons={
            <>
              <QBoxButton
                id="deletePedidosItem"
                title="Borrar pedido"
                icon="delete"
                onClick={() =>
                  dispatch({ type: "onDeletePedidosItemClicked", payload: { item: pedido } })
                }
                disabled={!editable}
              />
              <Quimera.Block id="sideButtons" />
            </>
          }
        >
          <QModelBox id="pedidosBuffer" disabled={!editable} schema={schema}>
            {vistaDetalle === "principal" ? (
              <Box>
                <DocClienteYDir />
                <DocDirCliente />
                <Quimera.Block id="afterDireccion" />
                <Box display="flex" justifyContent="space-between">
                  <DocFecha />
                  <QSection actionPrefix="totales" alwaysInactive>
                    <Totales
                      totales={[
                        { name: "Neto", value: pedidos.dict[pedidos.current].neto },
                        { name: "Total IVA", value: pedidos.dict[pedidos.current].totalIva },
                        { name: "Total", value: pedidos.dict[pedidos.current].total },
                      ]}
                    />
                  </QSection>
                </Box>
                {editable && (
                  <Quimera.View
                    id="LineaPedidoCliNueva"
                    idPedido={pedido.idPedido}
                    inline
                    callbackGuardada={payload =>
                      dispatch({ type: "onLineaPedidoGuardada", payload })
                    }
                  />
                )}
                <QListModel
                  data={lineas}
                  title="Líneas"
                  modelName="lineas"
                  ItemComponent={LineaPedidoCli}
                  itemProps={{
                    variant: "section",
                  }}
                  disabled={!editable}
                />
                <Quimera.Block id="afterLineas" />
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

export default PedidoDetalle;
