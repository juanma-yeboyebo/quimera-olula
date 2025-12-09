import { Box, QBox, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

import { ListItemVentaComercio } from "../../../comps";

function VentasComercioMaster({ idVenta }) {
  const [{ arrayMultiCheck, habilitarMulticheck, nombreComercio, ventasComercio }, dispatch] =
    useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewVentaChanged = useCallback(
    payload => dispatch({ type: "onNewVentaChanged", payload }),
    [],
  );

  const callbackNewVentaCerrado = useCallback(() => dispatch({ type: "onNuevaVentaClicked" }), []);

  return (
    <Quimera.Template id="VentasComercioMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo={`Ventas comercio (${nombreComercio})`}
        // sideButtons={
        //   !nueva && (
        //     <>
        //       <QBoxButton id="nuevaVenta" title="Nueva Venta" icon="add_circle" />
        //     </>
        //   )
        // }
        >
          {/* {nueva && (
            <Box mb={2}>
              <Quimera.View
                id="VentaNueva"
                desdeMaster={true}
                callbackGuardado={callbackNewVentaChanged}
                callbackCerrado={callbackNewVentaCerrado}
              />
            </Box>
          )} */}
          <QListModel
            data={ventasComercio}
            modelName={"ventasComercio"}
            // modelName={"ventasComercio"}
            ItemComponent={ListItemVentaComercio}
            itemProps={{
              renderId: () => ventasComercio.dict[idVenta]?.nombre,
              habilitarMulticheck,
              arrayMultiCheck,
            }}
            funSecondaryLeft={venta => (venta.codConsumidor ? venta.codConsumidor : "Sin nombre")}
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default VentasComercioMaster;
