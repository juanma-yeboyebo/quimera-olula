import { Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { React, useCallback } from "react";

import { ListItemShPreparacionDePedidos } from "../../../comps";

function ShPreparacionDePedidosMaster({ codPreparacionDePedido, useStyles }) {
  const [{ preparaciones }, dispatch] = useStateValue();
  const classes = useStyles()

  const callbackNewPreparacionChanged = useCallback(
    payload => dispatch({ type: "onNewPreparacionChanged", payload }),
    [],
  );

  const width = useWidth();
  const mobile = ["xs", "sm", "md"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const botones = [
    {
      icon: "filter_alt",
      id: "mostrarFiltro",
      text: "Mostrar filtro",
      badgeVisible: Object.keys(preparaciones.filter?.and ?? {}).length,
      badgeContent: Object.keys(preparaciones.filter?.and ?? {}).length,
    },
  ];

  return (
    <Quimera.Template id="ShPreparacionDePedidosMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo="Preparaciones"
          botones={botones}
        >
          <Quimera.SubView id="ShPreparacionDePedidos/ShPreparacionFiltro" />
          <QListModel data={preparaciones} modelName="preparaciones" ItemComponent={ListItemShPreparacionDePedidos} />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default ShPreparacionDePedidosMaster;
