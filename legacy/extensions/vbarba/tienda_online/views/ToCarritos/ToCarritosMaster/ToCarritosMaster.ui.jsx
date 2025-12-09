import { Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { React, useCallback } from "react";

import { ListItemToCarritos } from "../../../comps";

function ToCarritosMaster({ idCarrito, useStyles }) {
  const [{ carritos }, dispatch] = useStateValue();
  // const classes = useStyles()

  const callbackNewCarritoChanged = useCallback(
    payload => dispatch({ type: "onNewCarritoChanged", payload }),
    [],
  );

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  return (
    <Quimera.Template id="ToCarritosMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo={idCarrito === "nuevo" ? "Nuevo carrito" : "Mis carritos"}
          sideButtons={
            <>
              <QBoxButton id="nuevoCarrito" title="Nuevo Carrito" icon="add_circle" />
            </>
          }
        >
          {idCarrito === "nuevo" && (
            <Quimera.View id="ToCarritoNuevo" callbackGuardado={callbackNewCarritoChanged} />
          )}
          <QListModel data={carritos} modelName="carritos" ItemComponent={ListItemToCarritos} />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default ToCarritosMaster;
