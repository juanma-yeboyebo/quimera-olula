import { Avatar, Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

import { ListItemCampana } from "../../../comps";

function CampanasComercioMaster({ idComercio }) {
  const [{ arrayMultiCheck, habilitarMulticheck, campanas, campanasComercio }, dispatch] =
    useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  // const callbackNewComercioChanged = useCallback(
  //   payload => dispatch({ type: "onNewComercioChanged", payload }),
  //   [],
  // );

  return (
    <Quimera.Template id="CampanasComercioMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo="Campañas"
          sideButtons={
            <>
              <QBoxButton id="mostrarFiltro" title="Mostrar filtro" icon="filter_alt" />
            </>
          }
        >
          <Quimera.SubView id="CampanasComercio/CampanasComercioFiltro" />
          <QListModel
            data={campanasComercio}
            modelName={habilitarMulticheck ? "campanasCheck" : "campanas"}
            // modelName={"comercios"}
            ItemComponent={ListItemCampana}
            itemProps={{
              renderId: () => campanasComercio.dict[idCampana]?.nombre,
              habilitarMulticheck,
              arrayMultiCheck,
            }}
            funSecondaryLeft={campana =>
              campana.nombre ? campana.nombre : "Sin nombre"
            }
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default CampanasComercioMaster;
