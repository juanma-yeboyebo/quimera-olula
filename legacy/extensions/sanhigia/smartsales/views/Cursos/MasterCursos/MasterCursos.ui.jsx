import { Box, QBox, QListItem } from "@quimera/comps";
import { List } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import { ACL } from "quimera/lib";

const avatares = {
  "Cerrado": {
    icon: "",
    color: "#ef5350",
  },
  "En Preparacion": {
    icon: "",
    color: "#eb910c",
  },
  "En Curso": {
    icon: "",
    color: "#4caf50",
  },
};

function MasterCursos() {
  const [{ cursos }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const botonesCabecera = [{ icon: "arrow_back", id: "atras", text: "Atrás" }];
  const botones = [{
    icon: "filter_alt", id: "showFilter", text: "Mostrar filtro", badgeVisible: Object.keys(cursos.filter?.and ?? {}).length,
    badgeContent: Object.keys(cursos.filter?.and ?? {}).length
  }];
  // console.log("mimensaje_cursos", cursos);

  return (
    <Quimera.Template id="MasterCursos">
      <Box width={anchoDetalle}>
        <QBox titulo="Cursos" botones={botones} botonesCabecera={botonesCabecera}>
          <Quimera.SubView id="Cursos/FilterCursos" />
          <List>
            {Object.values(cursos?.dict ?? {})
              ?.sort((a, b) => new Date(b.fechaIni) - new Date(a.fechaIni))
              ?.map(curso => {
                return (
                  <QListItem
                    key={curso?.codCurso}
                    onClick={() =>
                      dispatch({
                        type: "onCursosClicked",
                        payload: { item: curso },
                      })
                    }
                    selected={curso?.codCurso === cursos.current}
                    avatar={avatares[curso.estado]}
                    chip={
                      ACL.can("contactos:revisar_contacto") &&
                      !curso.datosRevisados && {
                        icon: "new_releases",
                        soloIcono: true,
                        color: "",
                      }
                    }
                    tl={curso?.nombre ?? ""}
                    tr={curso.estado}
                    // tr={util.formatDate(curso?.fechaIni)}
                    bl={util.formatDate(curso?.fechaIni)}
                    br={curso.tipoCurso}
                  />
                );
              })}
          </List>
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default MasterCursos;
