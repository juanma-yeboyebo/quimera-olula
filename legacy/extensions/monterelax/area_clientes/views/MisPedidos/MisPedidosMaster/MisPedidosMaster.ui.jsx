import { Box, QBox, QBoxButton, QListModel, Typography } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React from "react";

import { ListItemMisPedidos } from "../../../comps";

function PedidosMaster({ useStyles }) {
  const [{ pedidos }, dispatch] = useStateValue();
  // const classes = useStyles()

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const botones = [{
    icon: "filter_alt", id: "mostrarFiltro", text: "Mostrar filtro", badgeVisible: Object.keys(pedidos.filter?.and ?? {}).length,
    badgeContent: Object.keys(pedidos.filter?.and ?? {}).length,
  }];

  return (
    <Quimera.Template id="PedidosMaster">
      <Box width={anchoDetalle}>
        <QBox titulo="Mis pedidos" botones={botones} >
          <Quimera.SubView id="MisPedidos/MisPedidosFiltro" />
          {pedidos.idList.length > 0 ? (
            <QListModel data={pedidos} modelName="pedidos" ItemComponent={ListItemMisPedidos} scrollable={true} altoCabecera={160} />
          ) : (
            <Typography variant="h5">No hay pedidos</Typography>
          )}
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default PedidosMaster;
