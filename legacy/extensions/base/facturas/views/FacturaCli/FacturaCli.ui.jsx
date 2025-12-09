import { Box, QBox, QBoxButton, QListModel, QModelBox, QSection, Typography, Field } from "@quimera/comps";
import { Totales } from "@quimera-extension/base-area_clientes";
import { DocAgente, DocClienteYDir, DocDirCliente, DocFecha } from "@quimera-extension/base-ventas";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useCallback, useEffect } from "react";

import { LineaFacturaCliComp } from "../../comps";

function FacturaCli({ callbackChanged, idFactura, initFactura, useStyles }) {
  const [{ lineas, logic, factura, vistaDetalle }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    util.publishEvent(factura.event, callbackChanged);
  }, [factura.event.serial]);

  useEffect(() => {
    !!initFactura &&
      dispatch({
        type: "onInitFactura",
        payload: {
          initFactura,
        },
      });
    !initFactura &&
      !!idFactura &&
      dispatch({
        type: "onInitFacturaById",
        payload: {
          idFactura,
        },
      });
  }, [initFactura, idFactura]);

  // Necesario para que no salte el useEffect de onInit en cada render de LineaFacturaCliNueva
  const callbackNuevaLinea = useCallback(
    payload => dispatch({ type: "onLineaCreada", payload }),
    [dispatch],
  );

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().facturascli;
  const editable = logic.facturaEditable(factura.data);

  if ((!initFactura && !idFactura) || initFactura?._status === "deleted") {
    return null;
  }

  if (idFactura && !factura.data.idFactura) {
    return null;
  }

  return (
    <Quimera.Template id="FacturaDetalle">
      {factura && (
        <QBox
          width={anchoDetalle}
          titulo={`Factura ${factura.data.codigo}`}
          botonesCabecera={[
            { icon: "more_horiz", id: "mas", text: "Más" },
            { icon: "arrow_back", id: "atras", text: "Atrás" },
          ]}
          sideButtons={
            <>
              <QBoxButton
                id="deleteFactura"
                title="Borrar factura"
                icon="delete"
                disabled={!editable}
              />
              <Quimera.Block id="sideButtons" />
            </>
          }
        >
          <QModelBox id="factura.buffer" disabled={!editable} schema={schema}>
            {vistaDetalle === "principal" ? (
              <Box>
                <DocClienteYDir />
                <QSection
                  title="Observaciones"
                  actionPrefix="facturaBuffer"
                  // alwaysInactive={disabled}
                  saveDisabled={() => !schema.isValid(factura.buffer)}
                  dynamicComp={() => (
                    <Field.Schema
                      id="factura.buffer/observaciones"
                      schema={schema}
                      fullWidth
                      label=""
                    />
                  )}
                >
                  {factura.buffer.observaciones ? (
                    <Typography variant="body1">{factura.buffer.observaciones}</Typography>
                  ) : (
                    <Typography variant="body2">{"Indique aquí sus observaciones"}</Typography>
                  )}
                </QSection>
                <DocDirCliente />
                <Quimera.Block id="afterDireccion" />
                <Box display="flex" justifyContent="space-between">
                  <DocFecha />
                  <QSection actionPrefix="totales" alwaysInactive>
                    <Totales
                      totales={[
                        { name: "Neto", value: factura.buffer.neto },
                        { name: "Total IVA", value: factura.buffer.totalIva },
                        { name: "Total", value: factura.buffer.total },
                      ]}
                    />
                  </QSection>
                </Box>
                {editable && (
                  <Quimera.View
                    id="LineaFacturaCliNueva"
                    idFactura={factura.data.idFactura}
                    inline
                    callbackGuardada={callbackNuevaLinea}
                  />
                )}
                <QListModel
                  data={lineas}
                  title="Líneas"
                  modelName="lineas"
                  ItemComponent={LineaFacturaCliComp}
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

export default FacturaCli;
