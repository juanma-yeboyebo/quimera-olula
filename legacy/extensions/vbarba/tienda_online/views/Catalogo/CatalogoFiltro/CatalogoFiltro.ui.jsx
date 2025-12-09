import { Box, Dialog, Filter, FilterBox, Icon, IconButton } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import Quimera, { getSchemas, useStateValue, useWidth, util } from "quimera";

import { FiltroColoresFlor, FiltroDisponibles, ArticuloFilter } from "../../../comps";
import { altoCabeceraFiltro, colores } from "../../../static/local";

const alturaMarks = [
  { value: 0, label: "0cm" },
  { value: 25, label: "25cm" },
  { value: 50, label: "50cm" },
  { value: 75, label: "75cm" },
  { value: 100, label: "1m" },
];
const anchuraMarks = [
  { value: 0, label: "0cm" },
  { value: 20, label: "20cm" },
  { value: 40, label: "40cm" },
  { value: 60, label: "60cm" },
];
const temperaturaMarks = [
  { value: 0, label: "0°C" },
  { value: 10, label: "10°C" },
  { value: 20, label: "20°C" },
  { value: 30, label: "30°C" },
  { value: 40, label: "40°C" },
  { value: 50, label: "50°C" },
];

function CampoConIcono({ Campo, Icono }) {
  return (
    <Box width={1} display="flex" alignItems="flex-end" justifyContent="flex-start">
      <Box width={1} display="flex">
        <Campo />
      </Box>
      <Box pl={1} />
      <Icono />
    </Box>
  );
}

const useStyles = makeStyles(theme => ({
  cajaSlider: {
    width: "100%",
    paddingLeft: theme.spacing(2),
    boxSizing: "border-box",
  },
}));

function CatalogoFiltro() {
  const [{ filtroVisible, catalogo, lectura }, dispatch] = useStateValue();
  const classes = useStyles();
  const mobile = ["xs", "sm"].includes(useWidth());
  const desktop = !mobile;
  let altoCabecera = altoCabeceraFiltro;
  const client = util.getEnvironment()?.client;
  if (client === "tienda-nativa-bnp") {
    altoCabecera += 155;
  }
  if (client === "tienda-nativa-vbarba") {
    altoCabecera += 75;
  }
  const anchura = 240;
  const altura = `calc(100vh - ${altoCabecera}px)`;

  const handleTextoFiltro = event => {
    // event.stopPropagation();
    const value = event.target.value;
    // const filtro = {
    //   or: [
    //     ["nombre", "like", value],
    //     ["referencia", "like", value],
    //     ["codbarras", "like", value],
    //   ],
    // };
    dispatch({ type: "onLecturaChanged", payload: { value } });
    // if (event.keyCode === 13) {
    //   console.log("onfiltrochanged____________", filtro);
    //   dispatch({ type: "onFiltroChanged", payload: { value, filtro } });
    // }
  };

  const filterBox = (
    <FilterBox
      id="catalogo.filter"
      // initialFilter={{
      //   disponible: {
      //     value: true,
      //     filter: ["1", "1"],
      //   },
      // }}
      schema={getSchemas().catalogo}
      open={filtroVisible}
      maxWidth={desktop && anchura}
    >
      <Box
        width={1}
        maxHeight={desktop && altura}
        pr={desktop && 1}
        style={{ overflowY: desktop && "scroll" }}
      // style={{ overflow: "scroll" }}
      >
        <Box display="flex" justifyContent="space-between">
          <FiltroDisponibles id="disponible" label="catalogoFiltro.soloDisponibles" />
          {mobile && (
            <IconButton id="mostrarFiltro">
              <Icon>close</Icon>
            </IconButton>
          )}
        </Box>
        <Filter.Schema id="nombre" />
        {/* <Filter.Schema id="referencia" /> */}
        <ArticuloFilter
          id="referencia"
          label={`Lectura${lectura ? ` (${lectura})` : ""}`}
          boxStyle={classes.referencia}
          onKeyDown={handleTextoFiltro}
          fullWidth

        />
        <CampoConIcono
          Campo={() => (
            <>
              <Filter.Schema id="alturaMin" operator="gte" />
              <Box pr={1} />
              <Filter.Schema id="alturaMax" operator="lte" />
            </>
          )}
          Icono={() => <Icon style={{ fontSize: 30 }}>height</Icon>}
        />
        <Box className={classes.cajaSlider}>
          <Filter.Slider
            idMin="alturaMin"
            idMax="alturaMax"
            min={0}
            max={100}
            marks={alturaMarks}
            step={5}
          />
        </Box>

        <CampoConIcono
          Campo={() => (
            <>
              <Filter.Schema id="anchuraMin" operator="gte" />
              <Box pr={1} />
              <Filter.Schema id="anchuraMax" operator="lte" />
            </>
          )}
          Icono={() => <Icon style={{ fontSize: 30, transform: "rotate(90deg)" }}>height</Icon>}
        />
        <Box className={classes.cajaSlider}>
          <Filter.Slider
            idMin="anchuraMin"
            idMax="anchuraMax"
            min={0}
            max={60}
            marks={anchuraMarks}
            step={5}
          />
        </Box>

        <CampoConIcono
          Campo={() => (
            <>
              <Filter.Schema id="tempMin" operator="gte" />
              <Box pr={1} />
              <Filter.Schema id="tempMax" operator="lte" />
            </>
          )}
          Icono={() => <Icon style={{ fontSize: 30 }}>thermostat</Icon>}
        />
        <Box className={classes.cajaSlider}>
          <Filter.Slider
            idMin="tempMin"
            idMax="tempMax"
            min={0}
            max={50}
            marks={temperaturaMarks}
            step={5}
          />
        </Box>
        <CampoConIcono
          Campo={() => (
            <Box width={1}>
              <Filter.Schema id="exposicionSolar" />
            </Box>
          )}
          Icono={() => <Icon style={{ fontSize: 30 }}>sunny</Icon>}
        />
        <CampoConIcono
          Campo={() => (
            <Box width={1}>
              <Filter.Schema id="resHumedad" />
            </Box>
          )}
          Icono={() => <Icon style={{ fontSize: 30 }}>water_drop</Icon>}
        />
        <CampoConIcono
          Campo={() => <Filter.Schema id="resSalinidad" />}
          Icono={() => <Icon style={{ fontSize: 30 }}>grass</Icon>}
        />
        <FiltroColoresFlor
          id="color"
          label="catalogoFiltro.coloresFloracion"
          operator="like"
          options={colores}
        />
      </Box>
    </FilterBox>
  );

  return (
    <Quimera.Template id="CatalogoFiltro">
      {mobile ? (
        <Dialog fullScreen open={filtroVisible}>
          {filterBox}
        </Dialog>
      ) : (
        filterBox
      )}
    </Quimera.Template>
  );
}

export default CatalogoFiltro;
