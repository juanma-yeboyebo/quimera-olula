import { Box, Icon, QBox, QListModel, QModelBox, QTitleBox, Typography } from "@quimera/comps";
import { DocAgente } from "@quimera-extension/base-ventas";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useCallback, useEffect } from "react";

import { Direccion, ListItemMiLineaAlbaran, Totales } from "../../comps";

function MiAlbaran({ callbackChanged, idAlbaran, initAlbaran, useStyles }) {
  const [{ lineas, logic, albaran, vistaDetalle }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    util.publishEvent(albaran.event, callbackChanged);
  }, [albaran.event.serial]);

  useEffect(() => {
    !!initAlbaran &&
      dispatch({
        type: "onInitAlbaran",
        payload: {
          initAlbaran,
        },
      });
    !initAlbaran &&
      !!idAlbaran &&
      dispatch({
        type: "onInitAlbaranById",
        payload: {
          idAlbaran,
        },
      });
  }, [initAlbaran, idAlbaran]);

  // Necesario para que no salte el useEffect de onInit en cada render de LineaAlbaranCliNueva
  const callbackNuevaLinea = useCallback(
    payload => dispatch({ type: "onLineaCreada", payload }),
    [dispatch],
  );

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().misAlbaranes;
  const editable = logic.albaranEditable(albaran.data);

  if ((!initAlbaran && !idAlbaran) || initAlbaran?._status === "deleted") {
    return null;
  }

  if (idAlbaran && !albaran.data.idAlbaran) {
    return null;
  }

  return (
    <Quimera.Template id="AlbaranDetalle">
      {albaran && (
        <QBox
          width={anchoDetalle}
          titulo={`Albarán ${albaran.data.codigo}`}
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
          sideButtons={
            <>{/* <QBoxButton id='printAlbaran' title='Imprimir albaran' icon='print' /> */}</>
          }
        >
          <QModelBox id="albaran.buffer" disabled={!editable} schema={schema}>
            {vistaDetalle === "principal" ? (
              <Box>
                <QTitleBox titulo={`Cliente`}>
                  <Typography variant="h5">{albaran.buffer.nombreCliente}</Typography>
                </QTitleBox>
                <QTitleBox titulo="Dirección">
                  <Direccion documento={albaran.buffer} inline />
                </QTitleBox>

                <Box display="flex" justifyContent="space-between">
                  <QTitleBox titulo="Fecha">
                    <Box display="flex" alignItems="center">
                      <Box mr={1}>
                        <Icon color="action" fontSize="default">
                          event
                        </Icon>
                      </Box>
                      <Typography variant="h5">{util.formatDate(albaran.buffer.fecha)}</Typography>
                    </Box>
                  </QTitleBox>
                  <Totales
                    totales={[
                      { name: "Neto", value: albaran.buffer.neto },
                      { name: "Total IVA", value: albaran.buffer.totalIva },
                      { name: "Total", value: albaran.buffer.total },
                    ]}
                  />
                </Box>
                <QListModel
                  data={lineas}
                  title="Líneas"
                  modelName="lineas"
                  ItemComponent={ListItemMiLineaAlbaran}
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

export default MiAlbaran;
