import { Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

import { ListItemCompra } from "../../../comps";

function ComprasMaster({ idCompra }) {
  const [{ arrayMultiCheck, habilitarMulticheck, compras }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewCompraChanged = useCallback(
    payload => dispatch({ type: "onNewCompraChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="ComprasMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo={idCompra === "nueva" ? "Nueva Compra" : "Mis Compras"}
        // sideButtons={
        //   <>
        //     <QBoxButton id="nuevaCompra" title="Nueva Compra" icon="add_circle" />
        //   </>
        // }
        >
          {idCompra === "nueva" && (
            <Quimera.View
              id="CompraNueva"
              desdeMaster={true}
              callbackGuardado={callbackNewCompraChanged}
            />
          )}
          <QListModel
            data={compras}
            modelName={habilitarMulticheck ? "comprasCheck" : "compras"}
            // modelName={"compras"}
            ItemComponent={ListItemCompra}
            itemProps={{
              renderId: () => compras.dict[idCompra]?.nombre,
              habilitarMulticheck,
              arrayMultiCheck,
            }}
            funSecondaryLeft={compra =>
              compra.codConsumidor ? compra.codConsumidor : "Sin nombre"
            }
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default ComprasMaster;
