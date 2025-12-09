import { Box, QBox, Typography } from "@quimera/comps";
import { Avatar, List } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React from "react";

import { ListItemMisReparaciones } from "../../../comps";

function MisReparacionesMaster({ useStyles }) {
  const [{ reparaciones, pendientes }, dispatch] = useStateValue();
  const classes = useStyles();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const desktop = !mobile;

  return (
    <Quimera.Template id="MisReparacionesMaster">
      <Box width={anchoDetalle} mx={desktop ? 1 : 0}>
        <QBox titulo="Mis reparaciones">
          <Quimera.SubView id="MisReparaciones/FiltroMaster" />
          {reparaciones.idList.length > 0 ? (
            <List>
              {reparaciones.idList.map(idReparacion => (
                <ListItemMisReparaciones
                  key={idReparacion}
                  selected={idReparacion === reparaciones.current}
                  divider
                  renderAvatar={() => (
                    <Avatar
                      className={
                        reparaciones.dict[idReparacion].estado === "PTE"
                          ? classes.pte
                          : reparaciones.dict[idReparacion].estado === "TERMINADO"
                          ? classes.terminado
                          : reparaciones.dict[idReparacion].estado === "SERVIDO"
                          ? classes.cargado
                          : classes.produccion
                      }
                    >
                      {reparaciones.dict[idReparacion].estado === "PTE"
                        ? "P"
                        : reparaciones.dict[idReparacion].estado === "TERMINADO"
                        ? "T"
                        : reparaciones.dict[idReparacion].estado === "SERVIDO"
                        ? "S"
                        : "PR"}
                    </Avatar>
                  )}
                  pedido={reparaciones.dict[idReparacion]}
                  funSecondaryLeft={pedido =>
                    pedido.descripcion ? pedido.descripcion : "Sin descripcion"
                  }
                  // onClick={() => dispatch({ type: 'onPedidosClicked', payload: { item: reparaciones.dict[idReparacion] } })}
                />
              ))}
            </List>
          ) : (
            <Box>
              {!pendientes ? (
                <Box display="flex" justifyContent="center">
                  <Typography variant="h5" className={classes.texto}>
                    Todavía no hemos registrado ninguna reparación
                  </Typography>
                </Box>
              ) : (
                <Box display="flex" justifyContent="center">
                  <Typography variant="h5" className={classes.texto}>
                    No hay reparaciones pendientes
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

export default MisReparacionesMaster;
