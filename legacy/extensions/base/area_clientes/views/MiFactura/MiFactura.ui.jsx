import { Box, Icon, QBox, QListModel, QModelBox, QTitleBox, Typography } from "@quimera/comps";
import { DocAgente } from "@quimera-extension/base-ventas";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useCallback, useEffect } from "react";

import { Direccion, ListItemMiLineaFactura, Totales } from "../../comps";

function MiFactura({ callbackChanged, idFactura, initFactura, useStyles }) {
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
  const schema = getSchemas().misFacturas;
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
            { icon: "arrow_back", id: "atras", text: "Atrás" },
          ]}
          sideButtons={
            <>{/* <QBoxButton id='printFactura' title='Imprimir factura' icon='print' /> */}</>
          }
        >
          <QModelBox id="factura.buffer" disabled={!editable} schema={schema}>
            {vistaDetalle === "principal" ? (
              <Box>
                <QTitleBox titulo={`Cliente`}>
                  <Typography variant="h5">{factura.buffer.nombreCliente}</Typography>
                </QTitleBox>
                <QTitleBox titulo="Dirección">
                  <Direccion documento={factura.buffer} inline />
                </QTitleBox>

                <Box display="flex" justifyContent="space-between">
                  <QTitleBox titulo="Fecha">
                    <Box display="flex" alignItems="center">
                      <Box mr={1}>
                        <Icon color="action" fontSize="default">
                          event
                        </Icon>
                      </Box>
                      <Typography variant="h5">{util.formatDate(factura.buffer.fecha)}</Typography>
                    </Box>
                  </QTitleBox>
                  <Totales
                    totales={[
                      { name: "Neto", value: factura.buffer.neto },
                      { name: "Total IVA", value: factura.buffer.totalIva },
                      { name: "Total", value: factura.buffer.total },
                    ]}
                  />
                </Box>
                <QListModel
                  data={lineas}
                  title="Líneas"
                  modelName="lineas"
                  ItemComponent={ListItemMiLineaFactura}
                  itemProps={{
                    variant: "section",
                  }}
                  disabled={!editable}
                />
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

export default MiFactura;
