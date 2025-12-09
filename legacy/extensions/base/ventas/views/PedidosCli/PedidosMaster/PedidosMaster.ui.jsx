import { Avatar, Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import { ListItemPedido } from "@quimera-extension/base-area_clientes";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

function PedidosMaster({ idPedido }) {
  const [{ pedidos }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewPedidoChanged = useCallback(
    payload => dispatch({ type: "onNewPedidoChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="PedidosMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo={idPedido === "nuevo" ? "Nuevo pedido" : "Pedidos"}
          sideButtons={
            <>
              <QBoxButton id="nuevoPedido" title="Nuevo pedido" icon="add_circle" />
              <QBoxButton id="mostrarFiltro" title="Mostrar filtro" icon="filter_alt" />
            </>
          }
        >
          {idPedido === "nuevo" && (
            <Quimera.View id="PedidosCliNuevo" callbackGuardado={callbackNewPedidoChanged} />
          )}
          <Quimera.SubView id="PedidosCli/PedidosFiltro" />
          <QListModel
            data={pedidos}
            modelName="pedidos"
            ItemComponent={ListItemPedido}
            itemProps={{
              renderAvatar: () => (
                <Avatar>{pedidos.dict[idPedido]?.nombreCliente?.charAt(0)}</Avatar>
              ),
            }}
            scrollable={true}
            altoCabecera={160}
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default PedidosMaster;
