import { Box, QBox, QListModel, Typography } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React from "react";

import { ListItemMisPedidos } from "../../../comps";

function PedidosMaster({ useStyles }) {
  const [{ pedidos }, dispatch] = useStateValue();
  // const classes = useStyles()

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  return (
    <Quimera.Template id="PedidosMaster">
      <Box width={anchoDetalle}>
        <QBox titulo="Mis pedidos">
          {pedidos.idList.length > 0 ? (
            <QListModel data={pedidos} modelName="pedidos" ItemComponent={ListItemMisPedidos} />
          ) : (
            <Typography variant="h5">No hay pedidos</Typography>
          )}
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default PedidosMaster;
