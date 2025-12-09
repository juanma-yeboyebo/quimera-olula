import { Box, QBox, QListModel } from "@quimera/comps";
import { ListItemInventario } from "@quimera-extension/base-almacen";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

function InventariosMaster({ codInventario }) {
  const [{ inventarios }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewPedidoChanged = useCallback(
    payload => dispatch({ type: "onNewPedidoChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="InventariosMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo={codInventario === "nuevo" ? "Nuevo pedido" : "Inventarios"}
          sideButtons={
            <>
              {/* <QBoxButton id='nuevoPedido' title='Nuevo pedido' icon='add_circle' /> */}
              {/* <QBoxButton id='mostrarFiltro' title='Mostrar filtro' icon='filter_alt' /> */}
            </>
          }
        >
          {/* {codInventario === 'nuevo' &&
						<Quimera.View id='PedidosCliNuevo' callbackGuardado={callbackNewPedidoChanged} />
					} */}
          {/* <Quimera.SubView id='PedidosCli/PedidosFiltro' /> */}
          <QListModel
            data={inventarios}
            modelName="inventarios"
            ItemComponent={ListItemInventario}
          // itemProps={{
          // 	renderAvatar: () => <Avatar>{pedidos.dict[codInventario]?.nombreCliente?.charAt(0)}</Avatar>
          // }}
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default InventariosMaster;
