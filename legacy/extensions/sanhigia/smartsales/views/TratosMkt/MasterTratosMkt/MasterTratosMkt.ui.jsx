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

function MasterTratosMkt({ useStyles }) {
  const [{ estadosTratos, externalFilter, tratos, showFilter }, dispatch] = useStateValue();
  const classes = useStyles();
  // const resumenTratos = totalesTratos
  //   ? `${totalesTratos.total ?? 0} Tratos (${totalesTratos.ganados ?? 0} ganados/${totalesTratos.perdidos ?? 0
  //   } perdidos)`
  //   : null;

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const altura = `calc(100vh - ${200}px)`;

  const botonesCabecera = [{ icon: "arrow_back", id: "atras", text: "Atrás" }];
  const botones = [
    {
      icon: "filter_alt",
      id: "showFilter",
      text: "Mostrar filtro",
      badgeVisible: Object.keys(tratos.filter?.and ?? {}).length - externalFilter?.length,
      badgeContent: Object.keys(tratos.filter?.and ?? {}).length - externalFilter?.length,
    },
  ];

  return (
    <Quimera.Template id="MasterTratosMkt" className="MasterTratosSmartsales">
      <Box width={anchoDetalle}>
        <QBox titulo={"Tratos marketing"} botones={botones} botonesCabecera={botonesCabecera}>
          <FilterBox
            id="tratos.filter"
            schema={getSchemas().trato}
            open={showFilter}
            externalFilter={externalFilter}
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
            <Filter.Schema id="idTipotrato" label="TipoTrato" Comp={TipoTrato} />
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
              dataLength={tratos.idList ? tratos?.idList?.length : 0}
              next={() =>
                dispatch({ type: `onNextTratos`, payload: { getTratosParams: { mkt: true } } })
              }
              hasMore={tratos?.page?.next !== null}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableBox"
            >
              <List>
                {Object.values(tratos?.dict ?? {})
                  ?.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                  ?.sort((a, b) => a.estado.length - b.estado.length)
                  ?.filter(trato => trato.idTrato !== "nuevo")
                  ?.map(trato => {
                    return (
                      <QListItem
                        key={trato?.idTrato}
                        onClick={() =>
                          dispatch({
                            type: "onTratosClicked",
                            payload: { item: trato },
                          })
                        }
                        selected={trato?.idTrato === tratos?.current}
                        avatar={{
                          ...iconEstado[trato?.estado ?? "-"],
                        }}
                        // tl={`${trato?.titulo ?? ""} || ${trato?.nombreContacto ?? ""}`}
                        tl={
                          <Box display={"flex"}>
                            {trato?.idCampania && (
                              <Chip label={"MKT"} size="small" className={classes.chipMkt} />
                            )}
                            {util.getUser().tratolicenciafarma === trato.idTipotrato && (
                              <Chip label={"Farma"} size="small" className={classes.chipFarma} />
                            )}
                            {`${trato?.titulo ?? ""} || ${trato?.nombreContacto ?? ""}`}
                          </Box>
                        }
                        // tr={util.formatDate(trato?.fecha)}
                        br={trato?.nombreAgente ?? ""}
                        bl={` ${util.formatDate(trato?.fecha)} || ${trato?.tipotrato ?? "*"} || ${util.euros(trato?.valor ?? 0)}`}
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

export default MasterTratosMkt;
