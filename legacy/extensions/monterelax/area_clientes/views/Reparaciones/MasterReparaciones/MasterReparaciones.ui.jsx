import { Box, QBox, QListModel, Typography } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";

// import { ListItemReparaciones } from "../../../comps";
import { ListItemReparaciones } from "../../../comps";

function MasterReparaciones() {
  const [{ reparaciones }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const botonesCabecera = [{ icon: "arrow_back", id: "atras", text: "Atrás" }];
  const botones = [{
    icon: "filter_alt", id: "showFilter", text: "Mostrar filtro", badgeVisible: Object.keys(reparaciones.filter?.and ?? {}).length,
    badgeContent: Object.keys(reparaciones.filter?.and ?? {}).length,
  }];
  // console.log("mimensaje_reparaciones", reparaciones);

  return (
    <Quimera.Template id="MasterReparaciones">
      <Box width={anchoDetalle}>
        <QBox titulo="Reparaciones" botones={botones} botonesCabecera={botonesCabecera}>
          <Quimera.SubView id="Reparaciones/FilterReparaciones" />
          {reparaciones.idList.length > 0 ? (
            <QListModel
              data={reparaciones}
              modelName="reparaciones"
              ItemComponent={ListItemReparaciones}
              scrollable={true} altoCabecera={160}
            />
          ) : (
            <Typography variant="h5">No hay reparaciones</Typography>
          )}
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default MasterReparaciones;
