import { Box, QBox, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

import { ListItemPedido } from "../../../comps";

function PedidosMaster({ idPedido }) {
  const [{ contadorFiltros, filtroVisible, pedidos }, dispatch] = useStateValue();

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
        // sideButtons={
        //   idPedido === "nuevo" ? (
        //     <>
        //       <QBoxButton id="volverListadoPartes" title="Volver" icon="arrow_back" />
        //     </>
        //   ) : (
        //     <>
        //       <QBoxButton id="nuevoParteCarro" title="Nuevo parte" icon="add_circle" />
        //       <Badge color="primary" overlap="circle" badgeContent={contadorFiltros}>
        //         <QBoxButton id="mostrarFiltro" title="Mostrar filtro" icon="filter_alt" />
        //       </Badge>
        //     </>
        //   )
        // }
        >
          {idPedido === "nuevo" ? (
            <Quimera.View id="ParteCarroNuevo" callbackGuardado={callbackNewPedidoChanged} />
          ) : (
            <>
              {/* <Quimera.SubView id="Pedidos/PedidosFiltro" /> */}
              <QListModel
                data={pedidos}
                modelName="pedidos"
                ItemComponent={ListItemPedido}
                scrollable={true}
                altoCabecera={filtroVisible ? 500 : 160}
              />
            </>
          )}
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default PedidosMaster;
