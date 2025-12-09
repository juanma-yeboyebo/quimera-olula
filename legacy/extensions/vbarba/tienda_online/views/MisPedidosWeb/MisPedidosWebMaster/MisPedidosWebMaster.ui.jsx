import { Box, QBox, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { React, useCallback } from "react";

import { ListItemMisPedidos } from "../../../comps";

function MisPedidosMaster({ idCarrito, useStyles }) {
  const [{ carritos }, dispatch] = useStateValue();
  // const classes = useStyles()

  // const callbackNewCarritoChanged = useCallback(
  //   payload => dispatch({ type: "onNewCarritoChanged", payload }),
  //   [],
  // );

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  return (
    <Quimera.Template id="MisPedidosMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo={idCarrito === "nuevo" ? "Nuevo carrito" : "Mis pedidos"}
        // sideButtons={
        //   <>
        //     <QBoxButton id="nuevoCarrito" title="Nuevo Carrito" icon="add_circle" />
        //   </>
        // }
        >
          {/* {idCarrito === "nuevo" && (
            <Quimera.View id="ToCarritoNuevo" callbackGuardado={callbackNewCarritoChanged} />
          )} */}
          <QListModel data={carritos} modelName="carritos" ItemComponent={ListItemMisPedidos} />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default MisPedidosMaster;
