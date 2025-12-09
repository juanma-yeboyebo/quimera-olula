import { Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

import { ListItemCampana } from "../../../comps";

function CampanasMaster({ idCampana }) {
  const [{ arrayMultiCheck, habilitarMulticheck, campanas }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewCampanaChanged = useCallback(
    payload => dispatch({ type: "onNewCampanaChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="CampanasMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo={idCampana === "nueva" ? "Nueva Campaña" : "Campañas"}
          sideButtons={
            <>
              <QBoxButton id="mostrarFiltro" title="Mostrar filtro" icon="filter_alt" />
              <QBoxButton id="nuevaCampana" title="Nueva Campaña" icon="add_circle" />
            </>
          }
        >
          {idCampana === "nueva" && (
            <Quimera.View id="CampanaNueva" callbackGuardado={callbackNewCampanaChanged} />
          )}
          <Quimera.SubView id="Campanas/CampanasFiltro" />
          <QListModel
            data={campanas}
            modelName={habilitarMulticheck ? "campanasCheck" : "campanas"}
            // modelName={"campanas"}
            ItemComponent={ListItemCampana}
            itemProps={{
              renderId: () => campanas.dict[idCampana]?.nombre,
              habilitarMulticheck,
              arrayMultiCheck,
            }}
            funSecondaryLeft={campana => (campana.nombre ? campana.nombre : "Sin nombre")}
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default CampanasMaster;
