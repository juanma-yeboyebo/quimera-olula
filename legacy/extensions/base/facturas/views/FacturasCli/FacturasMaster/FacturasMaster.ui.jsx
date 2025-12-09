import { Avatar, Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

import { ListItemFactura } from "../../../comps";

function FacturasMaster({ idFactura }) {
  const [{ facturas, filtroVisible }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewFacturaChanged = useCallback(
    payload => dispatch({ type: "onNewFacturaChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="FacturasMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo={idFactura === "nuevo" ? "Nuevo factura" : "Facturas"}
          sideButtons={
            <>
              <QBoxButton id="nuevaFactura" title="Nueva factura" icon="add_circle" />
              <QBoxButton id="mostrarFiltro" title="Mostrar filtro" icon="filter_alt" />
            </>
          }
        >
          {idFactura === "nuevo" && (
            <Quimera.View id="FacturasCliNueva" callbackGuardado={callbackNewFacturaChanged} />
          )}
          <Quimera.SubView id="FacturasCli/FacturasFiltro" />
          {idFactura !== "nuevo" && !filtroVisible && (
            <QListModel
              data={facturas}
              modelName="facturas"
              ItemComponent={ListItemFactura}
              itemProps={{
                renderAvatar: () => (
                  <Avatar>{facturas.dict[idFactura]?.nombreCliente?.charAt(0)}</Avatar>
                ),
              }}
              scrollable={true}
              altoCabecera={160}
            />
          )}
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default FacturasMaster;
