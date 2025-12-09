import { Box, QBox, QBoxButton, QListModel, QModelBox, QSection } from "@quimera/comps";
import { Totales } from "@quimera-extension/base-area_clientes";
import { DocAgente, DocClienteYDir, DocDirCliente, DocFecha } from "@quimera-extension/base-ventas";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth } from "quimera";
import React from "react";

import { LineaFacturaCliComp as LineaFacturaCli } from "../../../comps";

function FacturaDetalle({ useStyles }) {
  const [{ lineas, logic, facturas, vistaDetalle }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const factura = facturas.dict[facturas.current];
  const schema = getSchemas().facturas;
  const editable = logic.facturaEditable(factura);

  return (
    <Quimera.Template id="FacturaDetalle">
      {facturas.dict[facturas.current] && (
        <QBox
          width={anchoDetalle}
          titulo={`Factura ${facturas.dict[facturas.current].codigo}`}
          botonesCabecera={[
            { icon: "more_horiz", id: "mas", text: "Más" },
            { icon: "arrow_back", id: "atras", text: "Atrás" },
          ]}
          sideButtons={
            <>
              <QBoxButton
                id="deleteFacturasItem"
                title="Borrar factura"
                icon="delete"
                onClick={() =>
                  dispatch({ type: "onDeleteFacturasItemClicked", payload: { item: factura } })
                }
                disabled={!editable}
              />
              <Quimera.Block id="sideButtons" />
            </>
          }
        >
          <QModelBox id="facturasBuffer" disabled={!editable} schema={schema}>
            {vistaDetalle === "principal" ? (
              <Box>
                <DocClienteYDir />
                <DocDirCliente />
                <Quimera.Block id="afterDireccion" />
                <Box display="flex" justifyContent="space-between">
                  <DocFecha />
                  <QSection actionPrefix="totales" alwaysInactive>
                    <Totales
                      totales={[
                        { name: "Neto", value: facturas.dict[facturas.current].neto },
                        { name: "Total IVA", value: facturas.dict[facturas.current].totalIva },
                        { name: "Total", value: facturas.dict[facturas.current].total },
                      ]}
                    />
                  </QSection>
                </Box>
                {editable && (
                  <Quimera.View
                    id="LineaFacturaCliNueva"
                    idFactura={factura.idFactura}
                    inline
                    callbackGuardada={payload =>
                      dispatch({ type: "onLineaFacturaGuardada", payload })
                    }
                  />
                )}
                <QListModel
                  data={lineas}
                  title="Líneas"
                  modelName="lineas"
                  ItemComponent={LineaFacturaCli}
                  itemProps={{
                    variant: "section",
                  }}
                  disabled={!editable}
                />
                <Quimera.Block id="afterLineas" />
              </Box>
            ) : (
              <Box width={1}>
                <DocAgente />
              </Box>
            )}
          </QModelBox>
        </QBox>
      )}
    </Quimera.Template>
  );
}

export default FacturaDetalle;
