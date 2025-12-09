import { Avatar, Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import Quimera, { useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

import { ListItemCategoria } from "../../../comps";

function CategoriasMaster({ idCategoria }) {
  const [{ categorias }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewCategoriaChanged = useCallback(
    payload => dispatch({ type: "onNewCategoriaChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="CategoriasMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo={idCategoria === "nueva" ? "Nueva categoria" : "Categorias"}
          sideButtons={
            <>
              <QBoxButton id="nuevaCategoria" title="Nueva categoria" icon="add_circle" />
              <QBoxButton id="mostrarFiltro" title="Mostrar filtro" icon="filter_alt" />
            </>
          }
        >
          {idCategoria === "nueva" && (
            <Quimera.View id="CategoriaNueva" callbackGuardado={callbackNewCategoriaChanged} />
          )}
          <Quimera.SubView id="Categorias/CategoriasFiltro" />
          <QListModel
            data={categorias}
            modelName="categorias"
            ItemComponent={ListItemCategoria}
            itemProps={{
              renderAvatar: () => (
                <Avatar>{categorias.dict[idCategoria]?.nombre?.charAt(0)}</Avatar>
              ),
            }}
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default CategoriasMaster;
