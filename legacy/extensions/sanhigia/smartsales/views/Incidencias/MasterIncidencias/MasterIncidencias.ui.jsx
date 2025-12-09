import { Box, QBox, QListItem } from "@quimera/comps";
import { InfiniteScroll, List } from "@quimera/thirdparty";
import Quimera, { useStateValue, useWidth, util } from "quimera";

const avatares = {
  "Nueva": {
    icon: "lock_open",
    color: "#cc024a",
  },
  "Pendiente de Datos": {
    icon: "more_horiz",
    color: "#eb910c",
  },
  "Pendiente": {
    icon: "pause_circle_outline",
    color: "#eb910c",
  },
  "Asignada": {
    icon: "assignment_ind",
    color: "#0b9adb",
  },
  "Rechazada": {
    icon: "thumb_down_off_alt",
    color: "#ff5722",
  },
  "Cerrada": {
    icon: "lock_outlined",
    color: "#357037",
  },
};

function MasterIncidencias() {
  const [{ incidencias }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const altura = `calc(100vh - ${170}px)`;

  const botonesCabecera = [{ icon: "arrow_back", id: "atras", text: "Atrás" }];
  const botones = [{
    icon: "filter_alt", id: "showFilter", text: "Mostrar filtro", badgeVisible: Object.keys(incidencias.filter?.and ?? {}).length,
    badgeContent: Object.keys(incidencias.filter?.and ?? {}).length
  }];
  // console.log("mimensaje_incidencias", incidencias);

  return (
    <Quimera.Template id="MasterIncidencias">
      <Box width={anchoDetalle}>
        <QBox titulo="Incidencias" botones={botones} botonesCabecera={botonesCabecera}>
          <Quimera.SubView id="Incidencias/FilterIncidencias" />
          <Box id="scrollableBox" style={{ height: altura, overflow: "auto" }}>
            <InfiniteScroll
              dataLength={incidencias.idList ? incidencias?.idList?.length : 0}
              next={() => dispatch({ type: `onNextIncidencias` })}
              hasMore={incidencias?.page?.next !== null}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableBox"
            >
              <List>
                {Object.values(incidencias?.dict ?? {})
                  // ?.sort((a, b) => new Date(b.fechaIni) - new Date(a.fechaIni))
                  ?.map(incidencia => {
                    return (
                      <QListItem
                        key={incidencia?.codIncidencia}
                        onClick={() =>
                          dispatch({
                            type: "onIncidenciasClicked",
                            payload: { item: incidencia },
                          })
                        }
                        selected={incidencia?.codIncidencia === incidencias.current}
                        avatar={avatares[incidencia?.estado]}
                        // chip={
                        //   !incidencia?.datosRevisados && {
                        //     icon: "new_releases",
                        //     soloIcono: true,
                        //     color: "",
                        //   }
                        // }
                        tl={incidencia?.descripcion ?? ""}
                        // tr={incidencia?.estado}
                        bl={incidencia?.nombreCliente}
                        br={util.formatDate(incidencia?.fecha)}
                      />
                    );
                  })}
              </List>
            </InfiniteScroll>
          </Box>
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default MasterIncidencias;
