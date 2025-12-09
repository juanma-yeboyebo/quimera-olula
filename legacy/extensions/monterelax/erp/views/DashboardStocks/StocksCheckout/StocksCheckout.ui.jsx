import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Field,
  Icon,
  IconButton,
  QBox,
  Typography,
} from "@quimera/comps";
import { LinearProgress, List, ListItem, ListItemText } from "@quimera/thirdparty";
import { Cliente, DirCliente } from "@quimera-extension/base-ventas";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React from "react";

function StocksCheckout({ useStyles }) {
  const [{ cliente, dialogo, direccion, stocksPedido }, dispatch] = useStateValue();
  const classes = useStyles();

  return (
    <Quimera.Template id="StocksCheckout">
      <Container maxWidth="md" style={{ marginTop: "16px" }}>
        <QBox titulo="Checkout Pedido">
          <Box className={classes.container} display="flex" justifyContent="flex-start">
            <Box flexGrow={1}>
              <Cliente id="cliente" label="Cliente" fullWidth async />
            </Box>
          </Box>
          <Box className={classes.container} display="flex" justifyContent="flex-start">
            <Box flexGrow={1}>
              <DirCliente id="direccion" label="Direccion" codCliente={cliente} fullWidth async />
            </Box>
          </Box>
          <Box className={classes.container} display="flex" justifyContent="flex-start">
            <Box flexGrow={1}>
              <Field.Text
                id="referencia"
                label="Ref. Pedido"
                inputProps={{ maxLength: 30 }}
                fullWidth
              />
            </Box>
          </Box>
          <Box className={classes.listContainer}>Resumen líneas</Box>
          <Box display="flex" justifyContent="flex-start">
            <Box flexGrow={1}>
              <List>
                {stocksPedido.map((s, index) => (
                  <ListItem key={s.id} className={classes.card} divider>
                    <IconButton
                      id="borrar"
                      size="small"
                      onClick={() => dispatch({ type: "onBorrarClicked", payload: { id: index } })}
                    >
                      <Icon fontSize="large">delete</Icon>
                    </IconButton>
                    <ListItemText
                      primary={
                        <Typography>
                          <strong>{s.modelo}</strong>
                          {` ${s.configuracion}`}
                        </Typography>
                      }
                      secondary={<Typography>{s.tela}</Typography>}
                    />
                    <Field.Int
                      id="cantidadCarrito"
                      value={s.cantidad}
                      error={s.cantidad > s.canstock}
                      helperText={`El stock máximo es ${s.canstock} ud/s`}
                      index={index}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
          <Box className={classes.listContainer} display="flex" justifyContent="flex-end">
            <Button id="volver">Volver</Button>
            <Button
              id="crearPedido"
              variant="contained"
              color="primary"
              disabled={
                stocksPedido.reduce(
                  (acum, valor) => (valor.cantidad > valor.canstock ? true : acum),
                  false,
                ) ||
                cliente === "" ||
                direccion === 0 ||
                stocksPedido.length === 0
              }
            >
              Crear Pedido
            </Button>
          </Box>
        </QBox>
        <Dialog open={dialogo.generandoPedido || dialogo.pedidoCreado} maxWidth="md">
          <DialogTitle id="form-dialog-title">{dialogo.titulo}</DialogTitle>
          <DialogContent>
            <DialogContentText id="form-dialog-description">{dialogo.cuerpo}</DialogContentText>
            {dialogo.pedidoCreado && (
              <DialogActions>
                <Button id="confirmar" text="OK" />
              </DialogActions>
            )}
            {dialogo.generandoPedido && <LinearProgress></LinearProgress>}
          </DialogContent>
        </Dialog>
      </Container>
    </Quimera.Template>
  );
}

export default StocksCheckout;
