import { Box, QBox, Typography } from "@quimera/comps";
import { Avatar, List } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React from "react";

import { ListItemPedido } from "../../../comps";

function PedidosMaster({ useStyles }) {
  const [{ pedidos }, dispatch] = useStateValue();
  const classes = useStyles();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const desktop = !mobile;

  //avatar={pedidos.dict[idPedido].estado === 'PTE' ? 'P' : pedidos.dict[idPedido].estado === 'TERMINADO' ? 'T' : pedidos.dict[idPedido].estado === 'CARGADO' ? 'C' : 'PR'}

  return (
    <Quimera.Template id="PedidosMaster">
      <Box width={anchoDetalle} mx={desktop ? 1 : 0}>
        <QBox titulo="Pedidos">
          <Quimera.SubView id="PedidosCliente/FiltroMaster" />
          {pedidos.idList.length > 0 ? (
            <List>
              {pedidos.idList.map(idPedido => (
                //console.log('PEDIDOS:___________________', pedidos) &&
                <ListItemPedido
                  key={idPedido}
                  selected={idPedido === pedidos.current}
                  divider
                  renderAvatar={() => (
                    <Avatar
                      className={
                        pedidos.dict[idPedido].estado === "PTE"
                          ? classes.pte
                          : pedidos.dict[idPedido].estado === "TERMINADO"
                          ? classes.terminado
                          : pedidos.dict[idPedido].estado === "CARGADO"
                          ? classes.cargado
                          : classes.produccion
                      }
                    >
                      {pedidos.dict[idPedido].estado === "PTE"
                        ? "P"
                        : pedidos.dict[idPedido].estado === "TERMINADO"
                        ? "T"
                        : pedidos.dict[idPedido].estado === "CARGADO"
                        ? "C"
                        : "PR"}
                    </Avatar>
                  )}
                  pedido={pedidos.dict[idPedido]}
                  modelName="pedidos"
                  funSecondaryLeft={pedido =>
                    pedido.referencia ? pedido.referencia : "Sin referencia"
                  }
                  onClick={() =>
                    dispatch({ type: "onPedidosClicked", payload: { item: pedidos.dict[idPedido] } })
                  }
                />
              ))}
            </List>
          ) : (
            <Box>
              <Box display="flex" justifyContent="center">
                <Typography variant="h5" className={classes.texto}>
                  No hay pedidos
                </Typography>
              </Box>
            </Box>
          )}
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default PedidosMaster;
