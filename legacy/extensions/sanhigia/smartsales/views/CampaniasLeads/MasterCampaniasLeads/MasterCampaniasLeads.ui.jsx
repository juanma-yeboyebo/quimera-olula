import { Box, Chip, QBox, QListItem } from "@quimera/comps";
import { List } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";

const tipos = {
  repeticion: (
    <Chip
      size="small"
      label="repetición"
      color="secondary"
      style={{ backgroundColor: "#d32f2f" }}
    />
  ),
  captacion: (
    <Chip size="small" label="captación" color="primary" style={{ backgroundColor: "#0288d1" }} />
  ),
  medicion: <Chip size="small" label="medición" />,
  ventaCruzada: (
    <Chip
      size="small"
      label="Venta cruzada"
      color="primary"
      style={{ backgroundColor: "#0288d1" }}
    />
  ),
  marketingDigital: (
    <Chip
      size="small"
      label="Marketing digital"
      color="primary"
      style={{ backgroundColor: "#0288d1" }}
    />
  ),
};

const tiposProducto = {
  subfamilia: (
    <Chip
      size="small"
      label="subfamilia"
      color="secondary"
      style={{ backgroundColor: "#d32f2f" }}
    />
  ),
  listadearticulos: (
    <Chip size="small" label="artículos" color="primary" style={{ backgroundColor: "#0288d1" }} />
  ),
};

const avatares = {
  pendiente: {
    icon: "hourglass_empty",
    color: "#4caf50",
  },
  enseguimiento: {
    icon: "troubleshoot",
    color: "#ff9800",
  },
  archivada: {
    icon: "archive",
    color: "#ef5350",
  },
};

const getDescription = campania => {
  const tipo = tipos[campania.tipo];
  const tipoProducto = tiposProducto[campania.tipoProducto] ?? tiposProducto.listadearticulos;

  return (
    <span>
      Campaña de {tipo} por {tipoProducto}
    </span>
  );
};

function MasterCampaniasLeads() {
  const [{ campaniasLeads, mostrarArchivadas }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const botonesCabecera = [{ icon: "arrow_back", id: "atras", text: "Atrás" }];
  const botones = [
    {
      id: "nuevaCampania",
      icon: "add_circle",
      text: "Nueva Campaña",
    },
    // { icon: "filter_alt", id: "showFilter", text: "Mostrar filtro" },
    {
      icon: "filter_alt",
      id: "showFilter",
      text: "Mostrar filtro",
      badgeVisible:
        Object.keys(campaniasLeads.filter?.and ?? {}).length + (mostrarArchivadas ? 1 : 0),
      badgeContent:
        Object.keys(campaniasLeads.filter?.and ?? {}).length + (mostrarArchivadas ? 1 : 0),
    },
  ];

  console.log(campaniasLeads);

  return (
    <Quimera.Template id="MasterCampaniasLeads">
      <Box width={anchoDetalle}>
        <QBox titulo="Campañas leads pacientes" botones={botones} botonesCabecera={botonesCabecera}>
          <Quimera.SubView id="CampaniasLeads/FilterCampaniasLeads" />
          <List>
            {Object.values(campaniasLeads?.dict ?? {})
              ?.sort((a, b) => new Date(b.fechaAlta) - new Date(a.fechaAlta))
              ?.filter(campania => campania.idCampania !== "nuevo")
              ?.map(campania => {
                return (
                  <QListItem
                    key={campania?.idCampania}
                    onClick={() =>
                      dispatch({
                        type: "onCampaniasLeadsClicked",
                        payload: { item: campania },
                      })
                    }
                    selected={campania?.idCampania === campaniasLeads.current}
                    avatar={avatares[campania.estado]}
                    tl={campania?.nombre ?? ""}
                    tr={util.formatDate(campania?.fechaAlta)}
                    bl={getDescription(campania)}
                  />
                );
              })}
          </List>
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default MasterCampaniasLeads;
