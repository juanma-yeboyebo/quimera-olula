// import { Grid, Button, Column, Field, Table, Dialog, DialogContent, IconButton, Icon, Typography } from '@quimera/comps'
import { Box, Button, Column, Grid, Paper, Table } from "@quimera/comps";
import {
  Avatar,
  Hidden,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useEffect } from "react";
// import Articulo from '../../comps/Articulo/index.js'
// import ReactHTMLTableToExcel from 'react-html-table-to-excel'
function InformeRepeticiones({ useStyles }) {
  const [
    {
      clientes,
      clientesTotal,
      clientesNoRepetidos,
      referencia,
      fechaDesde,
      fechaHasta,
      articulo,
      intervaloDias,
    },
    dispatch,
  ] = useStateValue();
  // const _c = useStyles()
  const classes = useStyles();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        dispatch,
      },
    });
  }, [dispatch]);

  const puedoBuscar = () =>
    (referencia != null) & (fechaDesde != null) &&
    fechaHasta != null &&
    articulo != null &&
    intervaloDias != null;

  return (
    <Quimera.Template id="InformeRepeticiones">
      <Box my={1} p={1}>
        <Quimera.SubView id="InformeRepeticiones/InformeRepeticionesFiltro" />
      </Box>
      <Grid container direction="column" xs={12} item justify="center" alignItems="center">
        <Grid item>
          <Box px={3} align="right">
            <Button
              id="cargarDatos"
              text="Buscar"
              color="secondary"
              variant="contained"
              disabled={!puedoBuscar()}
            />
          </Box>
        </Grid>
        <Grid item>
          <Button
            id="dameReport"
            text="Descargar informe"
            color="secondary"
            variant="contained"
            disabled={!puedoBuscar()}
          />
        </Grid>
      </Grid>
      <Box my={1}>
        <Paper>
          <Box p={1}>
            <Grid item>Total de clientes que han repetido: {clientesTotal}</Grid>
          </Box>
        </Paper>
      </Box>
      <Box my={1}>
        <Paper>
          <Box p={1}>
            <Grid item>
              Total de clientes que no han repetido: {clientesNoRepetidos.noRepetidos}
            </Grid>
          </Box>
        </Paper>
      </Box>
      <Hidden smDown>
        <Table id="tdbClientes" idField="codcliente" data={clientes}>
          <Column.Text
            id="codigo"
            header="Código"
            value={cliente => cliente.codcliente}
            width={100}
          />
          <Column.Text
            id="nombre"
            header="Nombre cliente"
            value={cliente => cliente.nombre}
            flexGrow={1}
            width={200}
          />
          <Column.Text
            id="direccion"
            header="Dirección"
            value={cliente => cliente.direccion_completa}
            flexGrow={1}
            width={400}
          />
          <Column.Text
            id="fecha"
            header="Fecha último pedido"
            value={cliente => cliente.fecha}
            flexGrow={1}
            width={100}
          />
          <Column.Int
            id="num_repeticiones"
            header="Número repeticiones"
            value={cliente => cliente.num_repeticiones}
            flexGrow={1}
            width={50}
          />
        </Table>
      </Hidden>
      <Hidden mdUp>
        <List>
          {clientes.map(cliente => (
            <ListItem key={cliente.codcliente} divider={true} className={classes.element}>
              <ListItemAvatar>
                <Avatar className={classes.red}>{cliente.num_repeticiones}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography>
                    <strong>{cliente.nombre}</strong>
                  </Typography>
                }
                secondary={
                  <Typography>
                    {cliente.fecha}
                    <br></br>
                    {cliente.direccion_parte1}
                    <br></br>
                    {cliente.direccion_parte2}
                  </Typography>
                }
              ></ListItemText>
            </ListItem>
          ))}
        </List>
      </Hidden>
    </Quimera.Template>
  );
}

export default InformeRepeticiones;
