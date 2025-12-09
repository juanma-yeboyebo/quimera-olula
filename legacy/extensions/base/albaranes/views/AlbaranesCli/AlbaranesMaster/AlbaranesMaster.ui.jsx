import { Avatar, Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

import { ListItemAlbaran } from "../../../comps";

function AlbaranesMaster({ idAlbaran }) {
  const [{ albaranes, filtroVisible }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewAlbaranChanged = useCallback(
    payload => dispatch({ type: "onNewAlbaranChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="AlbaranesMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo={idAlbaran === "nuevo" ? "Nuevo albaran" : "Albaranes"}
          sideButtons={
            <>
              <QBoxButton id="nuevoAlbaran" title="Nuevo albaran" icon="add_circle" />
              <QBoxButton id="mostrarFiltro" title="Mostrar filtro" icon="filter_alt" />
            </>
          }
        >
          {idAlbaran === "nuevo" && (
            <Quimera.View id="AlbaranesCliNuevo" callbackGuardado={callbackNewAlbaranChanged} />
          )}
          <Quimera.SubView id="AlbaranesCli/AlbaranesFiltro" />
          {idAlbaran !== "nuevo" && !filtroVisible && (
            <QListModel
              data={albaranes}
              modelName="albaranes"
              ItemComponent={ListItemAlbaran}
              itemProps={{
                renderAvatar: () => (
                  <Avatar>{albaranes.dict[idAlbaran]?.nombreCliente?.charAt(0)}</Avatar>
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

export default AlbaranesMaster;
