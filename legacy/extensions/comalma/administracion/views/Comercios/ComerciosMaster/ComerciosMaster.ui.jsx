import { Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

import { ListItemComercio } from "../../../comps";

function ComerciosMaster({ idComercio }) {
  const [{ arrayMultiCheck, habilitarMulticheck, comercios }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewComercioChanged = useCallback(
    payload => dispatch({ type: "onNewComercioChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="ComerciosMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo={idComercio === "nuevo" ? "Nuevo Establecimiento" : "Establecimientos"}
          sideButtons={
            <>
              {/* <QBoxButton id="mostrarFiltro" title="Mostrar filtro" icon="filter_alt" /> */}
              <QBoxButton id="nuevoComercio" title="Nuevo Comercio" icon="add_circle" />
            </>
          }
        >
          {idComercio === "nuevo" && (
            <Quimera.View id="ComercioNuevo" callbackGuardado={callbackNewComercioChanged} />
          )}
          <Quimera.SubView id="Comercios/ComerciosFiltro" />
          <QListModel
            data={comercios}
            modelName={habilitarMulticheck ? "comerciosCheck" : "comercios"}
            // modelName={"comercios"}
            ItemComponent={ListItemComercio}
            itemProps={{
              renderId: () => comercios.dict[idComercio]?.nombre,
              habilitarMulticheck,
              arrayMultiCheck,
            }}
            funSecondaryLeft={comercio => (comercio.nombre ? comercio.nombre : "Sin nombre")}
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default ComerciosMaster;
