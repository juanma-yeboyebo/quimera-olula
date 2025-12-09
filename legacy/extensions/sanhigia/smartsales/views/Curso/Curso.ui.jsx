import {
  Box,
  Button,
  Column,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Icon,
  QBox,
  QSection,
  Table,
  Typography,
} from "@quimera/comps";
import Quimera, { getSchemas, navigate, useStateValue, useWidth, util } from "quimera";
import { useEffect } from "react";

import {
  ConfirmButton,
  Contacto,
  ListContactoCurso,
  ListLineasCurso,
  MainBox,
  TipoTrato,
} from "../../comps";

function dameRespuestaError(meta) {
  if (meta == "femail") {
    return "Email incorrecto";
  }
  if (meta == "ftelefono") {
    return "Telefono incorrecto";
  }
  if (meta == "fnoexiste") {
    return "No se encuentra ningun contacto con este email";
  }

  return meta;
}

function Curso({ callbackChanged, initCurso, useStyles }) {
  const [
    {
      curso,
      idTipoTratoNuevaCampania,
      lineaseventos,
      contactosevento,
      modalCrearCampaniaVisible,
      modalCrearContactoVisible,
      erroresCarga,
      modalAnadirContactoVisible,
      modalErroresCargaContactosExcel,
    },
    dispatch,
  ] = useStateValue();
  const schema = getSchemas().curso;
  const classes = useStyles();

  useEffect(() => {
    util.publishEvent(curso.event, callbackChanged);
  }, [curso.event.serial]);

  useEffect(() => {
    dispatch({
      type: "onInitCurso",
      payload: {
        initCurso,
      },
    });
  }, [dispatch, initCurso]);

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  // const actionEnabled = () => ACL.can("ss_campanias:visit");
  const actionEnabled =
    util.getUser()?.superuser ||
      util.getUser().group === "MKT" ||
      util.getUser().group === "Responsable de marketing"
      ? false
      : true;

  return (
    <Quimera.Template id="Curso">
      <QBox
        width={anchoDetalle}
        titulo={initCurso?.nombre}
        botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
        sideButtons={<></>}
      >
        <Grid container spacing={0}>
          {/* <Grid item xs={12} sm={12}>
            <QSection
              title={`Nombre Curso`}
              actionPrefix="curso.buffer/nombre"
              alwaysInactive
            >
              <Box display="flex">
                <Typography variant="body1">
                  {curso.buffer.nombre || ""}
                </Typography>
              </Box>
            </QSection>
          </Grid> */}

          <Grid item xs={12} sm={6}>
            <QSection title="Estado" actionPrefix="curso.estado" alwaysInactive>
              <Box display="flex">
                <Typography variant="body2">{curso.buffer.estado}</Typography>
              </Box>
            </QSection>
          </Grid>
          <Grid item xs={12} sm={6}>
            <QSection title="Fecha" actionPrefix="curso.fechaIni" alwaysInactive>
              <Box display="flex">
                <Typography variant="body2">{curso.buffer.fechaIni}</Typography>
              </Box>
            </QSection>
          </Grid>
        </Grid>
        <Box
          display="flex"
          justifyContent="space-evenly"
          style={{ margin: "0px", marginBottom: "50px", marginTop: "20px" }}
        >
          {curso.buffer?.idCampania == null ? (
            <Button
              id="crearCampania"
              color="primary"
              disabled={actionEnabled}
              onClick={() => dispatch({ type: "onCrearCampaniaClicked" })}
            >
              <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                <Icon>campaign</Icon>
                Crear campaña
              </Box>
            </Button>
          ) : (
            <Button
              id="irACampania"
              color="primary"
              disabled={actionEnabled}
              onClick={() => navigate(`/ss/campanias/${curso.buffer?.idCampania}`)}
            >
              <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
                <Icon>campaign</Icon>
                Ir a campaña asociada
              </Box>
            </Button>
          )}

          <Button
            id="cargarContactos"
            color="primary"
            disabled={actionEnabled}
            onClick={() => document.getElementById("hiddenAttachInput").click()}
          >
            <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
              <Icon>upload</Icon>
              Cargar contactos
            </Box>
          </Button>
          <Button
            id="anadirContacto"
            color="primary"
            disabled={actionEnabled}
            onClick={() => dispatch({ type: "onAnadirContactoClicked" })}
          >
            <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
              <Icon>add</Icon>
              Añadir contacto
            </Box>
          </Button>
          {/* <Button
            id="quitarContacto"
            color="primary"
            disabled={false}
            onClick={() => dispatch({ type: "onQuitarContactoClicked" })}
          >
            <Box display="flex" style={{ gap: "0.5rem" }} alignItems="center">
              <Icon>add</Icon>
              Quitar contacto
            </Box>
          </Button> */}
        </Box>
        <Box style={{ margin: "0px", marginBottom: "50px" }}>
          <ListContactoCurso lineas={contactosevento} />
        </Box>
        <ListLineasCurso lineas={lineaseventos} />
        <Dialog open={modalCrearContactoVisible} fullWidth maxWidth="xs">
          <Quimera.View
            id="NuevoContacto"
            callbackCerrado={payload => dispatch({ type: "onCerrarCrearContacto", payload })}
          />
        </Dialog>
        <Dialog open={modalAnadirContactoVisible} fullWidth maxWidth="xs">
          <Container maxWidth="xs">
            <MainBox
              title="Añadir contacto"
              before={true}
              callbackCerrado={payload => dispatch({ type: "onCerrarAnadirContacto", payload })}
            >
              <Contacto id="contactoAnadir" label="Contacto" fullWidth async />
              <Button
                id="crearNuevoContacto"
                text="Crear nuevo contacto"
                variant="text"
                color="primary"
                disabled={false}
              />
            </MainBox>
            <ConfirmButton
              id="saveContacto"
              className="confirmarAnadirContacto"
              onClick={() =>
                dispatch({
                  type: "onSaveContactoClicked",
                  payload: { tipoCreacion: "Participacion" },
                })
              }
            />
          </Container>
        </Dialog>
        <Box>
          <input
            id="hiddenAttachInput"
            type="file"
            style={{
              height: 0,
              visibility: "hidden",
            }}
            accept=".xlsx"
            onChange={e =>
              dispatch({
                type: "onExcelAdjuntado",
                payload: {
                  files: Array.from(e.target.files),
                  codCurso: curso.buffer.codCurso ? parseInt(curso.buffer.codCurso) : "",
                },
              })
            }
          />
        </Box>
        <Dialog open={modalErroresCargaContactosExcel} fullWidth maxWidth="lg">
          <DialogContent>
            <DialogContentText id="form-dialog-title">
              Los siguientes contactos contienen datos erroneos o indefinidos y no se han cargado
            </DialogContentText>

            <Box sx={{ overflow: "auto", width: "auto" }}>
              <Table id="tbtErroresCargaExcel" idField="email" data={erroresCarga} clickMode="line">
                <Column.Text id="email" header="Email" order="email" pl={2} width={260} />
                <Column.Text id="telefono" header="Telefono" order="telefono" width={260} />
                <Column.Text
                  id="meta"
                  header="Error"
                  order="meta"
                  width={540}
                  value={response => dameRespuestaError(response.meta)}
                />
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

        <Dialog open={modalCrearCampaniaVisible} fullWidth maxWidth="xs">
          <DialogContent>
            <DialogContentText id="form-dialog-title">
              Selecciona el tipo de trato para la campaña.
            </DialogContentText>

            <TipoTrato
              id="idTipoTratoNuevaCampania"
              schema={false}
              estatico={false}
              fullWidth
              async
            />
            <DialogActions>
              <Grid container justifyContent="space-between">
                <Button
                  id="cancelarCrearCampania"
                  text="Cancelar"
                  variant="text"
                  color="secondary"
                // onClick={() => dispatch({ type: "onCerrarModalErroresCarga", payload: {} })}
                />
                <Button
                  id="crearCampania"
                  text="Crear"
                  variant="text"
                  color="primary"
                  disabled={!idTipoTratoNuevaCampania}
                  onClick={() => dispatch({ type: "onCrearCampaniaClickConfirmed", payload: {} })}
                />
              </Grid>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </QBox>
    </Quimera.Template>
  );
}

export default Curso;
