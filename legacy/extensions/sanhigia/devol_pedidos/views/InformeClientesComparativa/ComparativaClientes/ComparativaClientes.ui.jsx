import {
  Box,
  Button,
  Column,
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
import {
  Avatar,
  Checkbox,
  FormControlLabel,
  isWidthUp,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import React from "react";

import initialData from "../initial-data";

function ComparativaClientes({ useStyles }) {
  const [
    {
      abrirMostrarEmails,
      anyoUno,
      anyoDos,
      cliComparativa,
      emailsSeleccionados,
      estadoVista,
      listaEmails,
      ordenCliComparativa,
      paginaCli,
      soloSeleccionados,
      trimestre,
      years,
    },
    dispatch,
  ] = useStateValue();
  const classes = useStyles();
  const width = useWidth();
  const desktop = isWidthUp("sm", width);

  const puedoLanzar = () =>
    estadoVista === "limpio" && !soloSeleccionados && anyoUno != null && anyoDos != null;
  const clientesSeleccionados = () => Object.keys(emailsSeleccionados)?.length > 0;
  const tengoDatos = () =>
    cliComparativa.length > 0 || anyoUno != null || anyoDos != null || trimestre != null;

  const decimales = numero => {
    return Math.trunc(numero) === numero ? Math.trunc(numero) : numero.toFixed(2);
  };

  return (
    <Quimera.Template id="ComparativaClientes">
      <Box
        my={1}
        mx={desktop ? "default" : 1}
        display="flex"
        flexDirection="column"
        style={{ gap: 8 }}
      >
        <Grid container direction="column">
          <Grid item xs={12} md={4}>
            <Box mr={2}>
              <Field.Select
                id="anyoUno"
                label="Año 1"
                disableClearable={true}
                options={years}
                fullWidth
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box mr={2}>
              <Field.Select
                id="anyoDos"
                label="Año 2"
                disableClearable={true}
                options={years}
                fullWidth
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <Field.Select
                id="trimestre"
                label={`${trimestre ? "Trimestre" : "Todos los trimestres"}`}
                disableClearable={false}
                options={initialData.trimestres}
                fullWidth
              />
            </Box>
          </Grid>
        </Grid>
        <Grid container direction="column" align="center" justifyContent="space-between">
          <Grid
            item
            container
            xs={12}
            justifyContent="flex-end"
            alignContent="flex-end"
            style={{ gap: 8 }}
          >
            {cliComparativa.filter(cli => cli.seleccionada === true)?.length > 0 && (
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
          <Box id="scrollableTablaClientesComparativa">
            <Table
              id="tdbClientesComparativa"
              idField="codCliente"
              data={
                !soloSeleccionados ? cliComparativa : cliComparativa.filter(cli => cli.seleccionada)
              }
              clickMode="line"
              orderColumn={ordenCliComparativa}
              next={() => !soloSeleccionados && dispatch({ type: "onMostrarSiguienteClicked" })}
              hasMore={paginaCli.next !== null}
              loader={soloSeleccionados ? " " : null}
              scrollableTarget="scrollableTablaClientesComparativa"
              bgcolorRowFunction={cliente => (cliente.variacion > 0 ? "#ace1af" : "#fa8072")}
            >
              <Column.Action
                id="marcarCliente"
                width={35}
                value={linea => (
                  <FormControlLabel
                    style={{ margin: "0px", padding: "0px" }}
                    className={classes.checkboxBlanco}
                    labelPlacement="start"
                    control={
                      <Checkbox
                        color="default"
                        classes={{
                          colorSecondary: classes.checkboxBlanco,
                          checked: classes.checkboxBlanco,
                          root: classes.checkboxBlanco,
                        }}
                        checked={linea.seleccionada}
                        onClick={() =>
                          dispatch({
                            type: "onSeleccionarClienteClicked",
                            payload: { data: linea },
                          })
                        }
                      />
                    }
                  />
                )}
              />
              <Column.Text
                id="codCliente"
                header="Código"
                order="codcliente"
                pl={2}
                value={cliente => cliente.codCliente}
                width={80}
              />
              <Column.Text
                id="nombreCliente"
                header="Nombre"
                order="nombrecliente"
                value={cliente => cliente.nombreCliente}
                flexGrow={1}
                width={250}
              />
              <Column.Text
                id="direccion"
                header="Dirección"
                order="direccion,dirnum"
                value={cliente => cliente.direccion}
                flexGrow={1}
                width={240}
              />
              <Column.Text
                id="telefono"
                header="Teléfono"
                order="telefono"
                value={cliente => cliente.telefono}
                flexGrow={1}
                width={100}
              />
              <Column.Text
                id="email"
                header="Email"
                order="email"
                value={cliente => cliente.email}
                width={200}
              />
              <Column.Decimal
                id="totalUno"
                header="Total 1"
                order="totalUno"
                width={80}
                value={cliente => cliente.totalUno}
              />
              <Column.Decimal
                id="totalDos"
                header="Total 2"
                order="totalDos"
                width={80}
                value={cliente => cliente.totalDos}
              />
              <Column.Text
                id="variacion"
                header="Variacion %"
                order="variacion"
                align={"right"}
                width={80}
                value={cliente => decimales(cliente.variacion)}
              />
            </Table>
          </Box>
        )
      ) : (
        <Box>
          <ListInfiniteScroll
            next={() => dispatch({ type: "onMostrarSiguienteClicked" })}
            hasMore={paginaCli.next !== null}
          >
            {cliComparativa.map(cliente => (
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
                    tooltip={cliente.seleccionada ? "Deseleccionar cliente" : "Seleccionar cliente"}
                    onClick={() =>
                      dispatch({ type: "onSeleccionarClienteClicked", payload: { data: cliente } })
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
    </Quimera.Template>
  );
}

export default ComparativaClientes;
