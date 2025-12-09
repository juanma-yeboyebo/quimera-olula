import { Box, QBox, QBoxButton, QListModel, QModelBox, QSection, Typography, Field } from "@quimera/comps";
import { Totales } from "@quimera-extension/base-area_clientes";
import { DocAgente, DocClienteYDir, DocDirCliente, DocFecha } from "@quimera-extension/base-ventas";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useCallback, useEffect } from "react";

import { LineaAlbaranCliComp } from "../../comps";

function AlbaranCli({ callbackChanged, idAlbaran, initAlbaran, useStyles }) {
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
  const schema = getSchemas().albaranescli;
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
          titulo={`Albaran ${albaran.data.codigo}`}
          botonesCabecera={[
            { icon: "more_horiz", id: "mas", text: "Más" },
            { icon: "arrow_back", id: "atras", text: "Atrás" },
          ]}
          sideButtons={
            <>
              <QBoxButton
                id="deleteAlbaran"
                title="Borrar albaran"
                icon="delete"
                disabled={!editable}
              />
              <Quimera.Block id="sideButtons" />
            </>
          }
        >
          <QModelBox id="albaran.buffer" disabled={!editable} schema={schema}>
            {vistaDetalle === "principal" ? (
              <Box>
                <DocClienteYDir />
                <QSection
                  title="Observaciones"
                  actionPrefix="albaranBuffer"
                  // alwaysInactive={disabled}
                  saveDisabled={() => !schema.isValid(albaran.buffer)}
                  dynamicComp={() => (
                    <Field.Schema
                      id="albaran.buffer/observaciones"
                      schema={schema}
                      fullWidth
                      label=""
                    />
                  )}
                >
                  {albaran.buffer.observaciones ? (
                    <Typography variant="body1">{albaran.buffer.observaciones}</Typography>
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
                        { name: "Neto", value: albaran.buffer.neto },
                        { name: "Total IVA", value: albaran.buffer.totalIva },
                        { name: "Total", value: albaran.buffer.total },
                      ]}
                    />
                  </QSection>
                </Box>
                {editable && (
                  <Quimera.View
                    id="LineaAlbaranCliNueva"
                    idAlbaran={albaran.data.idAlbaran}
                    inline
                    callbackGuardada={callbackNuevaLinea}
                  />
                )}
                <QListModel
                  data={lineas}
                  title="Líneas"
                  modelName="lineas"
                  ItemComponent={LineaAlbaranCliComp}
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

export default AlbaranCli;
