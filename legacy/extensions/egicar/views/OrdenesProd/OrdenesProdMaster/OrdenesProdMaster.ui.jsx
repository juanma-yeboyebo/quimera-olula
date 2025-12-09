import { Box, QBox, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

import { ListItemOrdenProd } from "../../../comps";

function OrdenesProdMaster({ codOrden }) {
  const [{ arrayMultiCheck, habilitarMulticheck, ordenes }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewCompraChanged = useCallback(
    payload => dispatch({ type: "onNewCompraChanged", payload }),
    [],
  );

  // console.log("mimensaje_ordenes", ordenes);

  return (
    <Quimera.Template id="OrdenesProdMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo={codOrden === "nueva" ? "Nueva Orden" : "Ordenes de producción"}
        // sideButtons={
        //   <>
        //     <QBoxButton id="nuevaCompra" title="Nueva Compra" icon="add_circle" />
        //   </>
        // }
        >
          {/* {codOrden === "nueva" && (
            <Quimera.View
              id="CompraNueva"
              desdeMaster={true}
              callbackGuardado={callbackNewCompraChanged}
            />
          )} */}
          <QListModel
            data={ordenes}
            modelName={"ordenes"}
            ItemComponent={ListItemOrdenProd}
            itemProps={{
              renderId: () => ordenes.dict[codOrden]?.nombre,
              habilitarMulticheck,
              arrayMultiCheck,
            }}
            funSecondaryLeft={orden => (orden.codOrden ? orden.codOrden : "Sin nombre")}
            scrollable={true}
            altoCabecera={160}
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default OrdenesProdMaster;
