import { Box, QBox, QBoxButton, QListModel, QModelBox, QSection } from "@quimera/comps";
import { Totales } from "@quimera-extension/base-area_clientes";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth } from "quimera";
import React from "react";

import {
  DocAgente,
  DocClienteYDir,
  DocDirCliente,
  DocFecha,
} from "@quimera-extension/base-ventas";
import {
  LineaAlbaranCliComp as LineaAlbaranCli,
} from "../../../comps";

function AlbaranDetalle({ useStyles }) {
  const [{ lineas, logic, albaranes, vistaDetalle }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const albaran = albaranes.dict[albaranes.current];
  const schema = getSchemas().albaranes;
  const editable = logic.albaranEditable(albaran);

  return (
    <Quimera.Template id="AlbaranDetalle">
      {albaranes.dict[albaranes.current] && (
        <QBox
          width={anchoDetalle}
          titulo={`Albaran ${albaranes.dict[albaranes.current].codigo}`}
          botonesCabecera={[
            { icon: "more_horiz", id: "mas", text: "Más" },
            { icon: "arrow_back", id: "atras", text: "Atrás" },
          ]}
          sideButtons={
            <>
              <QBoxButton
                id="deleteAlbaranesItem"
                title="Borrar albaran"
                icon="delete"
                onClick={() =>
                  dispatch({ type: "onDeleteAlbaranesItemClicked", payload: { item: albaran } })
                }
                disabled={!editable}
              />
              <Quimera.Block id="sideButtons" />
            </>
          }
        >
          <QModelBox id="albaranesBuffer" disabled={!editable} schema={schema}>
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
                        { name: "Neto", value: albaranes.dict[albaranes.current].neto },
                        { name: "Total IVA", value: albaranes.dict[albaranes.current].totalIva },
                        { name: "Total", value: albaranes.dict[albaranes.current].total },
                      ]}
                    />
                  </QSection>
                </Box>
                {editable && (
                  <Quimera.View
                    id="LineaAlbaranCliNueva"
                    idAlbaran={albaran.idAlbaran}
                    inline
                    callbackGuardada={payload =>
                      dispatch({ type: "onLineaAlbaranGuardada", payload })
                    }
                  />
                )}
                <QListModel
                  data={lineas}
                  title="Líneas"
                  modelName="lineas"
                  ItemComponent={LineaAlbaranCli}
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

export default AlbaranDetalle;
