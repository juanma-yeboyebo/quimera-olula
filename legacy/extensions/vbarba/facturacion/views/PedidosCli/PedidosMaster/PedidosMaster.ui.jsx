import { ListItemPedido } from "@quimera-extension/base-area_clientes";
import { Avatar, Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import Quimera, { useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: `${theme.palette.success.main} !important`,
  },
  card: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
}));

function calculaColorAvatar(model) {
  if (model?.editable) {
    return "avatar";
  }

  return "";
}

function PedidosMaster({ idPedido }) {
  const [{ arrayMultiCheck, habilitarMulticheck, pedidos }, dispatch] = useStateValue();
  const classes = useStyles();

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
              <QBoxButton id="mostrarFiltro" title="Mostrar filtro" icon="search" />
              <QBoxButton
                id="habilitarMulticheck"
                title="Habilitar multicheck"
                icon="library_add_check"
              />
              <QBoxButton
                id="botonGenerarPedidosProveedor"
                title="Generar pedidos proveedor"
                icon="content_copy"
                disabled={arrayMultiCheck?.length < 1}
              />
            </>
          }
        >
          {idPedido === "nuevo" && (
            <Quimera.View id="PedidosCliNuevo" callbackGuardado={callbackNewPedidoChanged} />
          )}
          <Quimera.SubView id="PedidosCli/PedidosFiltro" />
          <QListModel
            data={pedidos}
            modelName={habilitarMulticheck ? "pedidosCheck" : "pedidos"}
            ItemComponent={ListItemPedido}
            itemProps={{
              renderAvatar: model => (
                <Avatar className={classes[calculaColorAvatar(model)]}>
                  {model?.nombreCliente?.charAt(0)}
                </Avatar>
              ),
              renderId: () => pedidos.dict[idPedido]?.nombreCliente,
              habilitarMulticheck,
              arrayMultiCheck,
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
