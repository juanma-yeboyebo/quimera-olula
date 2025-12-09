import { Box, QBox, Typography } from "@quimera/comps";
import { Avatar, List } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React from "react";

import { ListItemMisPedidos } from "../../../comps";

function MisPedidosMaster({ useStyles }) {
  const [{ pedidos, pendientes }, dispatch] = useStateValue();
  const classes = useStyles();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const desktop = !mobile;

  return (
    <Quimera.Template id="MisPedidosMaster">
      <Box width={anchoDetalle} mx={desktop ? 1 : 0}>
        <QBox titulo="Mis pedidos">
          <Quimera.SubView id="MisPedidos/FiltroMaster" />
          {pedidos.idList.length > 0 ? (
            <List>
              {pedidos.idList.map(idPedido => (
                <ListItemMisPedidos
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
                  // funSecondaryLeft={pedido => pedido.referencia ? pedido.referencia : 'Sin referencia'}
                  funSecondaryLeft={pedido => (pedido.estado ? pedido.estado : "Sin estado")}
                  onClick={() =>
                    dispatch({
                      type: "onPedidosClicked",
                      payload: { item: pedidos.dict[idPedido] },
                    })
                  }
                />
              ))}
            </List>
          ) : (
            <Box>
              {!pendientes ? (
                <Box display="flex" justifyContent="center">
                  <Typography variant="h5" className={classes.texto}>
                    Todavía no hemos registrado ningún pedido
                  </Typography>
                </Box>
              ) : (
                <Box display="flex" justifyContent="center">
                  <Typography variant="h5" className={classes.texto}>
                    No hay pedidos pendientes
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default MisPedidosMaster;
