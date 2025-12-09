import { Badge, Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

import { ListItemParteCarro } from "../../../comps";

function PartesCarrosMaster({ idParte }) {
  const [{ contadorFiltros, filtroVisible, partesCarros }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewParteCarroChanged = useCallback(
    payload => dispatch({ type: "onNewParteCarroChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="PartesCarrosMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo={idParte === "nuevo" ? "Nuevo parte" : "Partes de carros"}
          sideButtons={
            idParte === "nuevo" ? (
              <>
                <QBoxButton id="volverListadoPartes" title="Volver" icon="arrow_back" />
              </>
            ) : (
              <>
                <QBoxButton id="nuevoParteCarro" title="Nuevo parte" icon="add_circle" />
                <Badge color="primary" overlap="circle" badgeContent={contadorFiltros}>
                  <QBoxButton id="mostrarFiltro" title="Mostrar filtro" icon="search" />
                </Badge>
              </>
            )
          }
        >
          {idParte === "nuevo" ? (
            <Quimera.View id="ParteCarroNuevo" callbackGuardado={callbackNewParteCarroChanged} />
          ) : (
            <>
              <Quimera.SubView id="PartesCarros/PartesCarrosFiltro" />
              <QListModel
                data={partesCarros}
                modelName="partesCarros"
                ItemComponent={ListItemParteCarro}
                scrollable={true}
                altoCabecera={filtroVisible ? 500 : 160}
              />
            </>
          )}
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default PartesCarrosMaster;
