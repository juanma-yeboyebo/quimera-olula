import { Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

import { ListItemVenta } from "../../../comps";

function VentasMaster({ idVenta }) {
  const [{ arrayMultiCheck, habilitarMulticheck, nueva, ventas }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewVentaChanged = useCallback(
    payload => dispatch({ type: "onNewVentaChanged", payload }),
    [],
  );

  const callbackNewVentaCerrado = useCallback(() => dispatch({ type: "onNuevaVentaClicked" }), []);

  return (
    <Quimera.Template id="VentasMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo={nueva ? "Nueva Venta" : "Ventas"}
          sideButtons={
            !nueva && (
              <>
                <QBoxButton id="nuevaVenta" title="Nueva Venta" icon="add_circle" />
              </>
            )
          }
        >
          {nueva && (
            <Box mb={2}>
              <Quimera.View
                id="VentaNueva"
                desdeMaster={true}
                callbackGuardado={callbackNewVentaChanged}
                callbackCerrado={callbackNewVentaCerrado}
              />
            </Box>
          )}
          <QListModel
            data={ventas}
            modelName={habilitarMulticheck ? "ventasCheck" : "ventas"}
            // modelName={"ventas"}
            ItemComponent={ListItemVenta}
            itemProps={{
              renderId: () => ventas.dict[idVenta]?.nombre,
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

export default VentasMaster;
