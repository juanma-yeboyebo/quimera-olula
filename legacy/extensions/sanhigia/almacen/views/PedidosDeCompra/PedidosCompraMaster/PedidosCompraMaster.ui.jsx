import { Avatar, Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

import { ListItemPedidoCompra } from "../../../comps";

function PedidosCompraMaster({ idPedido }) {
  const [{ arrayMultiCheck, habilitarMulticheck, modalAgruparPedidos, pedidosProv }, dispatch] =
    useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewPedidoChanged = useCallback(
    payload => dispatch({ type: "onNewPedidoChanged", payload }),
    [],
  );

  const botones = [
    {
      icon: "filter_alt",
      id: "mostrarFiltro",
      text: "Mostrar filtro",
      badgeVisible: Object.keys(pedidosProv.filter?.and ?? {}).length,
      badgeContent: Object.keys(pedidosProv.filter?.and ?? {}).length,
    },
    {
      icon: "library_add_check",
      id: "habilitarMulticheck",
      text: "Habilitar multicheck",
    },
  ];

  return (
    <Quimera.Template id="PedidosCompraMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo={"Pedidos de compra"}
          botones={botones}
          sideButtons={
            <>
              <QBoxButton
                id="botonAgruparPedidos"
                title="Agrupar pedidos"
                icon="content_copy"
                disabled={arrayMultiCheck.length < 1}
              />
            </>
          }
        >
          <Quimera.SubView id="PedidosDeCompra/PedidosCompraFiltro" />
          <QListModel
            data={pedidosProv}
            modelName={habilitarMulticheck ? "pedidosCheck" : "pedidosProv"}
            // modelName={"pedidos"}
            ItemComponent={ListItemPedidoCompra}
            itemProps={{
              renderAvatar: () => (
                <Avatar>{pedidosProv.dict[idPedido]?.nombreCliente?.charAt(0)}</Avatar>
              ),
              renderId: () => pedidosProv.dict[idPedido]?.nombreCliente,
              habilitarMulticheck,
              arrayMultiCheck,
            }}
            funSecondaryLeft={pedido =>
              pedido.descripcion ? pedido.descripcion : "Sin descripcion"
            }
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default PedidosCompraMaster;
