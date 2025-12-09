import { Box, Chip, Filter, FilterBox, QBox, QListItem } from "@quimera/comps";
import { Checkbox, FormControlLabel, InfiniteScroll, List } from "@quimera/thirdparty";
import Quimera, { getSchemas, useStateValue, useWidth, util } from "quimera";

import { AgenteSmartsales, Contacto, TipoTrato } from "../../../comps";

const iconEstado = {
  "Ganado": {
    icon: "check",
    color: "#99E2CE",
  },
  "Perdido": {
    icon: "do_disturb",
    color: "#FF9191",
  },
  "-": {
    icon: "pause",
  },
};

function MasterTratos({ useStyles }) {
  const [
    {
      conTareasAtrasadas,
      estadosTratos,
      externalFilter,
      modo,
      tratos,
      tratosTareasAtrasadas,
      totalesTratos,
      showFilter,
    },
    dispatch,
  ] = useStateValue();
  const classes = useStyles();
  const resumenTratos = totalesTratos
    ? `${totalesTratos.total ?? 0} Tratos${conTareasAtrasadas ? " con tareas atrasadas" : ""} (${totalesTratos.ganados ?? 0
    } ganados/${totalesTratos.perdidos ?? 0} perdidos)`
    : null;

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const altura = `calc(100vh - ${200}px)`;
  const listaTratos = conTareasAtrasadas ? tratosTareasAtrasadas : tratos;
  const filtroTratos = conTareasAtrasadas ? "tratosTareasAtrasadas.filter" : "tratos.filter";
  const titulo = resumenTratos ?? "Tratos";
  const initialTipoTrato = modo === "observadorfarma" ? util.getUser().tratolicenciafarma : null;

  const botonesCabecera = [{ icon: "arrow_back", id: "atras", text: "Atrás" }];
  const botones = [
    {
      icon: "filter_alt",
      id: "showFilter",
      text: "Mostrar filtro",
      badgeVisible: Object.keys(listaTratos.filter?.and ?? {}).length - externalFilter?.length,
      badgeContent: Object.keys(listaTratos.filter?.and ?? {}).length - externalFilter?.length,
    },
  ];

  const clienteOContacto = trato => {
    let nombre = "";
    if (trato.contacto) {
      nombre = trato.nombreContacto;
    } else if (trato.cliente) {
      nombre = trato.nombreCliente;
    }

    return nombre;
  };

  return (
    <Quimera.Template id="MasterTratos">
      <Box width={anchoDetalle} className="MasterTratosSmartsales">
        <QBox titulo={titulo} botones={botones} botonesCabecera={botonesCabecera}>
          <FilterBox
            id={filtroTratos}
            schema={getSchemas().trato}
            open={showFilter}
            externalFilter={externalFilter}
            lastFilter={true}
          >
            <Filter.Schema id="titulo" />
            <Contacto id="codcontacto" label="Contacto" filterField={true} fullWidth async />
            <Filter.Schema id="cliente" label="Código cliente" />
            <Filter.Schema id="cifNifCliente" label="CIF/NIF cliente" />
            <AgenteSmartsales id="codagente" label="Agente" filterField={true} fullWidth async />
            <Filter.Schema id="fecha" type="interval" />
            <Box display="flex" justifyContent="space-between">
              <Filter.Schema id="fecha" type="desde" />
              <Filter.Schema id="fecha" type="hasta" />
            </Box>
            {/* <Filter.Schema id="estado" /> */}
            <Filter.Schema
              id="idTipotrato"
              label="TipoTrato"
              Comp={TipoTrato}
              initial={initialTipoTrato}
            />
          </FilterBox>
          <Box display="flex" justifyContent="space-around">
            {Object.values(estadosTratos).map(estado => (
              <FormControlLabel
                style={{ margin: "0px", padding: "0px" }}
                // labelPlacement="start"
                label={estado.nombre}
                control={
                  <Checkbox
                    color="secondary"
                    checked={estado.checked}
                    onClick={() =>
                      dispatch({
                        type: "onFiltroRapidoClicked",
                        payload: { key: estado.key, value: !estado.checked },
                      })
                    }
                  />
                }
              />
            ))}
          </Box>
          <Box id="scrollableBox" style={{ height: altura, overflow: "auto" }}>
            <InfiniteScroll
              dataLength={listaTratos.idList ? listaTratos?.idList?.length : 0}
              next={() => dispatch({ type: `onNextTratos` })}
              hasMore={listaTratos?.page?.next !== null}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableBox"
            >
              <List>
                {Object.values(listaTratos?.dict ?? {})
                  ?.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                  ?.sort((a, b) => a.estado.length - b.estado.length)
                  ?.filter(trato => trato.idTrato !== "nuevo")
                  ?.map(trato => {
                    return (
                      <QListItem
                        key={trato?.idTrato}
                        onClick={() =>
                          dispatch({
                            type: conTareasAtrasadas
                              ? "onTratosTareasAtrasadasClicked"
                              : "onTratosClicked",
                            // type: { onTratosClickedAction },
                            payload: { item: trato },
                          })
                        }
                        selected={trato?.idTrato === listaTratos?.current}
                        avatar={{
                          ...iconEstado[trato?.estado ?? "-"],
                        }}
                        tl={
                          <Box display={"flex"}>
                            {/* {console.log(trato)} */}
                            {`${trato?.titulo ?? ""} || ${clienteOContacto(trato)}`}
                          </Box>
                        }
                        // tr={util.formatDate(trato?.fecha)}
                        ml={
                          <Box display={"flex"}>
                            {trato?.idCampania && (
                              <Chip label={"MKT"} size="small" className={classes.chipMkt} />
                            )}
                            {util.getUser().tratolicenciafarma === trato.idTipotrato && (
                              <Chip label={"Farma"} size="small" className={classes.chipFarma} />
                            )}
                          </Box>
                        }
                        mr={util.formatDate(trato?.fecha)}
                        br={trato?.nombreAgente ?? ""}
                        bl={` ${trato?.tipotrato ?? "*"} || ${util.euros(trato?.valor ?? 0)}`}
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

export default MasterTratos;
