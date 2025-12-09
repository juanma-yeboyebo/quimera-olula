import {
  Box,
  Button,
  Column,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Field,
  Grid,
  Icon,
  IconButton,
  LinearProgress,
  ListInfiniteScroll,
  Table,
  Typography,
} from "@quimera/comps";
import { Avatar, isWidthUp, ListItem, ListItemAvatar, ListItemText } from "@quimera/thirdparty";
import { QArticulo } from "@quimera-extension/base-almacen";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

function InformeClientesInactivos({ useStyles }) {
  const [
    {
      abrirMostrarEmails,
      cliInactivos,
      emailsSeleccionados,
      estadoVista,
      fechaDesde,
      listaEmails,
      ordenCliInactivos,
      pagina,
      refs,
      soloSeleccionados,
    },
    dispatch,
  ] = useStateValue();
  const classes = useStyles();
  const width = useWidth();
  const desktop = isWidthUp("sm", width);

  useEffect(() => {
    dispatch({ type: "init" });
  }, [dispatch]);

  useEffect(() => {
    util.getSetting("appDispatch")({
      type: "setNombrePaginaActual",
      payload: { nombre: `Clientes inactivos` },
    });

    return () =>
      util.getSetting("appDispatch")({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [dispatch]);

  const puedoLanzar = () =>
    estadoVista === "limpio" &&
    !soloSeleccionados &&
    Object.keys(refs)?.length > 0 &&
    fechaDesde != null;
  const clientesSeleccionados = () => Object.keys(emailsSeleccionados)?.length > 0;
  const tengoDatos = () =>
    cliInactivos.length > 0 || Object.keys(refs)?.length > 0 || fechaDesde != null;

  return (
    <Quimera.Template id="InformeClientesInactivos">
      <Container className={classes.container} disableGutters={width === "xs" || width === "sm"}>
        <Box my={1} mx={desktop ? "default" : 1}>
          <Grid container direction="column">
            <Grid item xs={12} md={4}>
              <QArticulo
                id="refs/ref1"
                label={`Ref. 1${refs["ref1"] ? ` (${refs["ref1"]})` : ""}`}
                boxStyle={classes.referencia}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <QArticulo
                id="refs/ref2"
                label={`Ref. 2${refs["ref2"] ? ` (${refs["ref2"]})` : ""}`}
                boxStyle={classes.referencia}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <QArticulo
                id="refs/ref3"
                label={`Ref. 3${refs["ref3"] ? ` (${refs["ref3"]})` : ""}`}
                boxStyle={classes.referencia}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container direction="column" align="center" justifyContent="space-between">
            <Grid item container xs={6} justifyContent="flex-start">
              <Field.Date
                id="fechaDesde"
                field="fechaDesde"
                label="Desde fecha"
                className={classes.field}
              />
            </Grid>
            <Grid
              item
              container
              xs={6}
              justifyContent="flex-end"
              alignContent="flex-end"
              style={{ gap: 8 }}
            >
              {cliInactivos.filter(cli => cli.seleccionada === true)?.length > 0 && (
                <Grid item>
                  <Box display="flex" alignItems="center">
                    <IconButton id="marcarSoloSeleccionados" size="small">
                      {soloSeleccionados ? (
                        <Icon>check_box</Icon>
                      ) : (
                        <Icon>check_box_outline_blank</Icon>
                      )}
                    </IconButton>
                    <Typography variant="body2">Solo seleccionados</Typography>
                  </Box>
                </Grid>
              )}
              <Grid item>
                <Button
                  id="obtenerEmails"
                  text="Obtener emails"
                  color="secondary"
                  variant="contained"
                  disabled={!clientesSeleccionados()}
                  startIcon={<Icon>email</Icon>}
                />
              </Grid>
              <Grid item>
                <Button
                  id="limpiarDatos"
                  text="Limpiar"
                  color="secondary"
                  variant="contained"
                  disabled={!tengoDatos()}
                  startIcon={<Icon>cleaning_services_outlined</Icon>}
                />
              </Grid>
              <Grid item>
                <Button
                  id="lanzarInforme"
                  text="Lanzar"
                  color="primary"
                  variant="contained"
                  disabled={!puedoLanzar()}
                  startIcon={<Icon>file_download</Icon>}
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
        {estadoVista === "lanzando" && <LinearProgress />}
        {desktop ? (
          estadoVista === "lanzadoConResultados" && (
            <Box id="scrollableTablaClientesInactivos">
              <Table
                id="tdbClientesInactivos"
                idField="codCliente"
                data={
                  !soloSeleccionados ? cliInactivos : cliInactivos.filter(cli => cli.seleccionada)
                }
                clickMode="line"
                orderColumn={ordenCliInactivos}
                next={() => !soloSeleccionados && dispatch({ type: "onMostrarSiguienteClicked" })}
                hasMore={pagina.next !== null}
                loader={soloSeleccionados ? " " : null}
                scrollableTarget="scrollableTablaClientesInactivos"
              >
                <Column.Action
                  id="marcarCliente"
                  value={linea => (
                    <IconButton
                      id="seleccionarCliente"
                      size="small"
                      tooltip={linea.seleccionada ? "Deseleccionar cliente" : "Seleccionar cliente"}
                      onClick={() =>
                        dispatch({ type: "onSeleccionarClienteClicked", payload: { data: linea } })
                      }
                    >
                      {linea.seleccionada ? (
                        <Icon>check_box</Icon>
                      ) : (
                        <Icon>check_box_outline_blank</Icon>
                      )}
                    </IconButton>
                  )}
                />
                <Column.Text
                  id="codCliente"
                  header="Código"
                  order="codcliente"
                  pl={2}
                  value={cliente => cliente.codCliente}
                  width={150}
                />
                <Column.Text
                  id="nombreCliente"
                  header="Nombre"
                  order="nombrecliente"
                  value={cliente => cliente.nombreCliente}
                  flexGrow={1}
                  width={300}
                />
                <Column.Text
                  id="direccion"
                  header="Dirección"
                  order="direccion,dirnum"
                  value={cliente => cliente.direccion}
                  flexGrow={1}
                  width={450}
                />
                <Column.Text
                  id="telefono"
                  header="Teléfono"
                  order="telefono"
                  value={cliente => cliente.telefono}
                  flexGrow={1}
                  width={120}
                />
                <Column.Text
                  id="email"
                  header="Email"
                  order="email"
                  value={cliente => cliente.email}
                  width={350}
                />
                <Column.Date
                  id="fecha"
                  header="Fecha"
                  order="fecha"
                  value={cliente => cliente.fecha}
                  width={140}
                />
              </Table>
            </Box>
          )
        ) : (
          <Box>
            <ListInfiniteScroll
              next={() => dispatch({ type: "onMostrarSiguienteClicked" })}
              hasMore={pagina.next !== null}
            >
              {cliInactivos.map(cliente => (
                <ListItem
                  key={cliente.codCliente}
                  divider={true}
                  onClick={() =>
                    dispatch({
                      type: "onTdbClientesInactivosRowClicked",
                      payload: { id: cliente.codCliente },
                    })
                  }
                >
                  <ListItemAvatar>
                    <Avatar>{cliente?.nombreCliente?.substring(0, 1).toUpperCase()}</Avatar>
                    <IconButton
                      id="seleccionarCliente"
                      size="small"
                      tooltip={
                        cliente.seleccionada ? "Deseleccionar cliente" : "Seleccionar cliente"
                      }
                      onClick={() =>
                        dispatch({
                          type: "onSeleccionarClienteClicked",
                          payload: { data: cliente },
                        })
                      }
                    >
                      {cliente.seleccionada ? (
                        <Icon>check_box</Icon>
                      ) : (
                        <Icon>check_box_outline_blank</Icon>
                      )}
                    </IconButton>
                  </ListItemAvatar>
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography component="div" variant="body1">
                        <strong>{`${cliente.codCliente}`}</strong>
                        {` ${cliente.nombreCliente}`}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography component="span" variant="body2">{`${util.formatDate(
                            cliente.fecha,
                          )}`}</Typography>
                          <Typography component="span" variant="body2">
                            {cliente.telefono}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="flex-end">
                          <Typography component="span" variant="body2">
                            {cliente.email}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  ></ListItemText>
                </ListItem>
              ))}
            </ListInfiniteScroll>
          </Box>
        )}
        {estadoVista === "lanzadoSinResultados" && (
          <Box mt={4} display="flex" justifyContent="center">
            <Typography component="span" variant="h6">
              No existen registros para este criterio de búsqueda
            </Typography>
          </Box>
        )}

        <Dialog
          open={abrirMostrarEmails}
          maxWidth="sm"
          fullWidth
          onClose={() => dispatch({ type: "onCerrarMostrarEmails", payload: {} })}
        >
          <DialogTitle>
            <Grid container direction="column" alignItems="center" justifyContent="center">
              <Box flexGrow={1}>
                <Typography variant="body1" align="center">
                  EMAILS SELECCIONADOS
                </Typography>
              </Box>
              <Box flexGrow={0}>
                <IconButton id="copiarAClipboard" size="small" alt="copiar">
                  <Icon title="Copiar emails">content_copy</Icon>
                </IconButton>
              </Box>
            </Grid>
          </DialogTitle>
          <DialogContent dividers={true}>
            <Box className={classes.multiLineEllipsisDos}>
              <Typography>{listaEmails}</Typography>
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </Quimera.Template>
  );
}

export default InformeClientesInactivos;
