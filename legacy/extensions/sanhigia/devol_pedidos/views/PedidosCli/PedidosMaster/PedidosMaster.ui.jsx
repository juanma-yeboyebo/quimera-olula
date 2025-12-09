import { Avatar, Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import Quimera, { useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

import { ListItemPedido } from "../../../comps";

function PedidosMaster({ idPedido }) {
  const [{ pedidos }, dispatch] = useStateValue();
  const [{ filtroVisible }] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewPedidoChanged = useCallback(
    payload => dispatch({ type: "onNewPedidoChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="PedidosMaster">
      <Box width={anchoDetalle} >
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
          {console.log("filtroVisible", filtroVisible)}
          {idPedido !== "nuevo" && !filtroVisible && (
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
            />
          )}
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default PedidosMaster;
