import { Avatar, Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

import { ListItemPresupuesto } from "../../../comps";

function Master({ idPresupuesto }) {
  const [{ presupuestos, logic }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewPresupuestoChanged = useCallback(
    payload => dispatch({ type: "onNewPresupuestoChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="Master">
      <Box width={anchoDetalle}>
        <QBox
          titulo={idPresupuesto === "nuevo" ? "Nuevo presupuesto" : "Presupuestos"}
          sideButtons={
            <>
              <QBoxButton id="nuevoPresupuesto" title="Nuevo presupuesto" icon="add_circle" />
              <QBoxButton id="mostrarFiltro" title="Mostrar filtro" icon="filter_alt" />
            </>
          }
        >
          {idPresupuesto === "nuevo" && (
            <Quimera.View
              id="PresupuestoCliNuevo"
              callbackGuardado={callbackNewPresupuestoChanged}
            />
          )}
          <Quimera.SubView id="PresupuestosCli/Filter" />
          <QListModel
            data={presupuestos}
            modelName="presupuestos"
            ItemComponent={ListItemPresupuesto}
            itemProps={{
              renderAvatar: () => (
                <Avatar>{presupuestos.dict[idPresupuesto]?.nombreCliente?.charAt(0)}</Avatar>
              ),
              logic,
            }}
            scrollable={true}
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default Master;
