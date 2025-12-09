import "../TratosCampania.style.scss";

import {
  Box,
  Button,
  Column,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Filter,
  FilterBox,
  Grid,
  QBox,
  QBoxButton,
  Table,
} from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Checkbox, FormControlLabel, InfiniteScroll, List } from "@quimera/thirdparty";
import Quimera, { getSchemas, useStateValue, useWidth } from "quimera";

import {
  AgenteSmartsales,
  Cliente,
  Contacto,
  ListItemTratoCampania,
  TipoTrato,
} from "../../../comps";

const useStyles = makeStyles(theme => ({
  mainBoxTitle: {
    textTransform: "uppercase",
    fontSize: "1.6rem",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "0.7rem",
    justifyContent: "center",
    overflow: "hidden",
  },
  card: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
  chip: {
    borderRadius: 4,
    marginRight: theme.spacing(0.5),
    fontSize: "0.8rem",
    backgroundColor: `${theme.palette.warning.main}`,
    textTransform: "uppercase",
  },
  icon: {
    "color": theme.custom.menu.alternative,
    "transition": "all .2s ease-in-out",
    "&:hover": {
      color: theme.custom.menu.accent,
      transform: "scale(1.2)",
    },
  },
}));

const iconEstado = {
  "Sin Agente": {
    icon: "",
    color: "#cc024a",
  },
  "Auto": {
    icon: "",
    color: "#ff5722",
  },
  "Asignado": {
    icon: "",
    color: "#357037",
  },
  "Publicado": {
    icon: "",
    color: "#0b9adb",
  },
  "-": {
    icon: "pause",
  },
};

function MasterTratosCampania({ idCampania }) {
  const [
    {
      campania,
      estadosTratos,
      externalFilter,
      modalNuevoTratoVisible,
      modalErroresCargaContactosExcel,
      erroresCarga,
      tratosCampania,
      showFilter,
    },
    dispatch,
  ] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const classes = useStyles();

  const botonesCabecera = [{ icon: "arrow_back", id: "atras", text: "Atrás" }];
  const botones = [
    {
      icon: "filter_alt",
      id: "showFilter",
      text: "Mostrar filtro",
      badgeVisible: Object.keys(tratosCampania.filter?.and ?? {}).length - externalFilter?.length,
      badgeContent: Object.keys(tratosCampania.filter?.and ?? {}).length - externalFilter?.length,
    },
    {
      icon: "add_circle",
      id: "nuevoTrato",
      text: "Nuevo trato",
    },
  ];
  // console.log("Cargamos master");
  const title = `Tratos ${campania.nombre}`;
  const altura = `calc(100vh - ${220}px)`;

  const clienteOContacto = (trato, tipo) => {
    let dato = "";
    if (trato.contacto) {
      dato = trato[`${tipo}Contacto`] || "";
    } else if (trato.cliente) {
      dato = trato[`${tipo}Cliente`] || "";
    }

    if (tipo === "telefono" && (trato.telefonoContacto || trato.telefonoCliente)) {
      dato += " - ";
    }

    return dato;
  };

  return (
    <Quimera.Template id="MasterTratosCampania">
      <Box width={anchoDetalle} className="MasterTratosSmartsales">
        <QBox
          titulo={title}
          cabeceraButtons={
            <>
              <QBoxButton
                id="sincronizarConAC"
                title="Sincronizar con Active Campaign"
                icon="upload"
              />
              {/* <img
                alt="Project logo"
                src="/img/activecampaign.png"
                title="Sincronizar con Active Campaign"
                className="SincronizarAC"
                onClick={() => dispatch({
                  type: "onSincronizarConACClicked",
                })}
              /> */}
              <QBoxButton
                id="cargarContacto"
                onClick={() => document.getElementById("hiddenAttachInput").click()}
                title="Cargar contacto"
                icon="cloud_upload"
              />
              <QBoxButton
                id="asignarAgentesAuto"
                title="Asignar agentes automáticamente"
                icon="autorenew"
              />
              <QBoxButton id="publicarTratos" title="Publicar tratos" icon="publish" />
            </>
          }
          botones={botones}
          botonesCabecera={botonesCabecera}
        >
          <FilterBox
            id="tratosCampania.filter"
            schema={getSchemas().trato}
            open={showFilter}
            externalFilter={externalFilter}
            lastFilter={true}
          >
            <Filter.Schema id="titulo" />
            <Contacto id="codcontacto" label="Contacto" filterField={true} fullWidth async />
            <Cliente id="codcliente" label="Cliente" filterField={true} fullWidth async />
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
          <Box>
            <input
              id="hiddenAttachInput"
              type="file"
              style={{
                height: 0,
                visibility: "hidden",
              }}
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={e =>
                dispatch({
                  type: "onExcelAdjuntado",
                  payload: {
                    files: Array.from(e.target.files),
                    idCampania: idCampania ? parseInt(idCampania) : "",
                  },
                })
              }
            />
          </Box>

          <Box id="scrollableBox" style={{ height: altura, overflow: "auto" }}>
            <InfiniteScroll
              dataLength={tratosCampania.idList ? tratosCampania?.idList?.length : 0}
              next={() => dispatch({ type: `onNextTratosCampania` })}
              hasMore={tratosCampania?.page?.next !== null}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableBox"
            >
              <List>
                {Object.values(tratosCampania?.dict ?? {})
                  ?.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                  ?.sort((a, b) => a.estado.length - b.estado.length)
                  ?.filter(trato => trato.idTrato !== "nuevo")
                  .map(trato => (
                    <>
                      <ListItemTratoCampania
                        key={trato.idTrato}
                        selected={trato?.idTrato === tratosCampania?.current ? true : false}
                        trato={tratosCampania.dict[trato.idTrato]}
                        disabled={false}
                        dispatch={dispatch}
                        callbackCambiada={() => { }}
                      />
                    </>
                  ))}
              </List>
            </InfiniteScroll>
          </Box>
        </QBox>
        <Dialog
          open={modalNuevoTratoVisible}
          fullWidth
          maxWidth="xs"
        // fullScreen={width === "xs" || width === "sm"}
        >
          <Quimera.View
            id="NuevoTrato"
            idCampania={idCampania}
            idTipoTrato={campania.idTipoTrato}
            valorTrato={campania.valorTratos}
            callbackCerrado={() => dispatch({ type: "onCerrarCrearTrato" })}
          />
        </Dialog>
        <Dialog open={modalErroresCargaContactosExcel} fullWidth maxWidth="md">
          <DialogContent>
            <DialogContentText id="form-dialog-title">
              Los siguientes contactos contienen datos erroneos o indefinidos y no se han cargado
            </DialogContentText>

            <Box sx={{ overflow: "auto", width: "auto" }}>
              <Table id="tbtErroresCargaExcel" idField="email" data={erroresCarga} clickMode="line">
                <Column.Text id="email" header="Email" order="email" pl={2} width={240} />
                <Column.Text id="telefono" header="Telefono" order="telefono" width={240} />
                <Column.Text id="nombre" header="Nombre" order="nombre" width={340} />
              </Table>
            </Box>
            <DialogActions>
              <Grid container justifyContent="flex-end">
                <Button
                  id="aceptar"
                  text="Continuar"
                  variant="contained"
                  color="primary"
                  onClick={() => dispatch({ type: "onCerrarModalErroresCarga", payload: {} })}
                />
              </Grid>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Box>
    </Quimera.Template>
  );
}

export default MasterTratosCampania;
