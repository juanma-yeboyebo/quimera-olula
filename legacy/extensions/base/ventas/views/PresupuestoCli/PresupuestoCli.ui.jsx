import { Box, QBox, QBoxButton, QListModel, QModelBox, QSection } from "@quimera/comps";
import { Totales } from "@quimera-extension/base-area_clientes";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useCallback, useEffect } from "react";

import {
  DocAgente,
  DocClienteYDir,
  DocDirCliente,
  DocFecha,
  LineaPresupuestoCli,
} from "../../comps";

function PresupuestoCli({ callbackChanged, idPresupuesto, initPresupuesto, useStyles }) {
  const [{ lineas, logic, presupuesto, vistaDetalle }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    util.publishEvent(presupuesto.event, callbackChanged);
  }, [presupuesto.event.serial]);

  useEffect(() => {
    !!initPresupuesto &&
      dispatch({
        type: "onInitPresupuesto",
        payload: {
          initPresupuesto,
        },
      });
    !initPresupuesto &&
      !!idPresupuesto &&
      dispatch({
        type: "onInitPresupuestoById",
        payload: {
          idPresupuesto,
        },
      });
  }, [initPresupuesto, idPresupuesto]);

  const callbackNuevaLinea = useCallback(
    payload => dispatch({ type: "onLineaCreada", payload }),
    [dispatch],
  );

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().presupuestosCli;
  const editable = logic.presupuestoEditable(presupuesto.data);

  if ((!initPresupuesto && !idPresupuesto) || initPresupuesto?._status === "deleted") {
    return null;
  }

  if (idPresupuesto && !presupuesto.data.idPresupuesto) {
    return null;
  }

  return (
    <Quimera.Template id="PresupuestoDetalle">
      {presupuesto && (
        <QBox
          width={anchoDetalle}
          titulo={`Presupuesto ${presupuesto.data.codigo}`}
          botonesCabecera={[
            { icon: "more_horiz", id: "mas", text: "Más" },
            { icon: "arrow_back", id: "atras", text: "Atrás" },
          ]}
          sideButtons={
            <>
              <QBoxButton
                id="deletePresupuesto"
                title="Borrar presupuesto"
                icon="delete"
                disabled={!editable}
              />
            </>
          }
        >
          <QModelBox id="presupuesto.buffer" disabled={!editable} schema={schema}>
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
                        { name: "Neto", value: presupuesto.buffer.neto },
                        { name: "Total IVA", value: presupuesto.buffer.totalIva },
                        { name: "Total", value: presupuesto.buffer.total },
                      ]}
                    />
                  </QSection>
                </Box>
                {editable && (
                  <Quimera.View
                    id="LineaPresupuestoCliNueva"
                    idPresupuesto={presupuesto.data.idPresupuesto}
                    inline
                    callbackGuardada={callbackNuevaLinea}
                  />
                )}
                <QListModel
                  data={lineas}
                  title="Líneas"
                  modelName="lineas"
                  ItemComponent={LineaPresupuestoCli}
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

export default PresupuestoCli;
