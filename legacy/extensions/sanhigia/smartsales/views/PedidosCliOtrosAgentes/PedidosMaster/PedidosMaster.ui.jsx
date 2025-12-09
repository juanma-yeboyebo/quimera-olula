import { Avatar, Box, QBox, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

import { ListItemPedidoOtrosAgentes } from "../../../comps";

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
        <QBox titulo={"Pedidos de otros agentes"}>
          <Quimera.SubView id="PedidosCliOtrosAgentes/PedidosFiltro" />
          <QListModel
            data={pedidos}
            modelName="pedidos"
            ItemComponent={ListItemPedidoOtrosAgentes}
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
