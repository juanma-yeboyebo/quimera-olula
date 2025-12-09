import { Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

//import { ListItemParte } from '@quimera-extension/base-area_clientes'
import { ListItemParte } from "../../../comps";

function Master({ codParte, useStyles }) {
  const [{ partes }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewParteChanged = useCallback(
    payload => dispatch({ type: "onNewParteChanged", payload }),
    [],
  );
  console.log("callbackNewParteChanged", callbackNewParteChanged);

  return (
    <Quimera.Template id="Master">
      <Box width={anchoDetalle}>
        <QBox
          titulo={codParte === "nuevo" ? "Nuevo parte" : "Partes"}
          sideButtons={
            <>
              <QBoxButton id="nuevoParte" title="Nuevo parte" icon="add_circle" />
              <QBoxButton id="mostrarFiltro" title="Mostrar filtro" icon="filter_alt" />
            </>
          }
        >
          {codParte === "nuevo" && (
            <Quimera.View id="ParteNuevo" callbackGuardado={callbackNewParteChanged} />
          )}
          <Quimera.SubView id="PartesTrabajo/Filtro" />
          <QListModel
            data={partes}
            modelName="partes"
            ItemComponent={ListItemParte}
            itemProps={{
              renderAvatar: () => partes.dict[codParte]?.horas,
            }}
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default Master;
