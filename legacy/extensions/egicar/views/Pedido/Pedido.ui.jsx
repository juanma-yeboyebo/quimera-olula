import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Icon,
  QBox,
  QBoxButton,
  QListModel,
  QModelBox,
  QTitleBox,
  Typography,
} from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

import { ListItemLineaPedido } from "../../comps";

// import { Agente, DocAgente, DocClienteYDir, DocDirCliente, DocFecha, Cliente, DirCliente, LineaPedidoCli, LineaInventario } from '../../comps'

function Pedido({ callbackChanged, idPedido, initPedido, urlAtrasProp, useStyles }) {
  const [{ lineas, generandoAlbaran, pedido, modalFirmarAlbaran, vistaDetalle }, dispatch] =
    useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    util.publishEvent(pedido.event, callbackChanged);
  }, [pedido.event.serial]);

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: { urlAtrasProp },
    });
  }, []);

  useEffect(() => {
    !!initPedido &&
      dispatch({
        type: "onInitPedido",
        payload: {
          initPedido,
        },
      });
    !initPedido &&
      !!idPedido &&
      dispatch({
        type: "onInitPedidoById",
        payload: {
          idPedido,
        },
      });
  }, [initPedido, idPedido]);

  // useCallback necesario para que no salte el useEffect de onInit en cada render de LineaPedidoCliNueva
  // const callbackNuevaLinea = useCallback(
  //   payload => dispatch({ type: "onLineaCreada", payload }),
  //   [dispatch],
  // );

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().pedidoscli;
  // const editable = logic.parteEditable(pedido.data);
  const editable = true;

  if ((!initPedido && !idPedido) || initPedido?._status === "deleted") {
    return null;
  }

  if (idPedido && !pedido.data.idPedido) {
    return null;
  }

  const puedeCrearAlbaran = Object.values(lineas.dict).some(l => l.cantAEnviar > 0);

  return (
    <Quimera.Template id="Pedido">
      {pedido && (
        <QBox
          width={anchoDetalle}
          titulo={`Código: ${pedido.data.codPedido}`}
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
          sideButtons={
            <>
              <QBoxButton
                id="generarAlbaranParcial"
                title="Generar albarán"
                icon="local_shipping"
                disabled={!puedeCrearAlbaran}
              />
              {/* <QBoxButton
                id="reimprimirAlbaran"
                title="Reimprimir albarán"
                icon="save"
                disabled={!editable}
              /> */}
              <Quimera.Block id="sideButtons" />
            </>
          }
        >
          <QModelBox id="pedido.buffer" schema={schema}>
            {vistaDetalle === "principal" ? (
              <Box>
                {/* <QTitleBox titulo={calculaTipoCodigo(pedido.data)}>
                  <Typography variant="h5">{calculaNombre(pedido.data)}</Typography>
                </QTitleBox> */}

                <QTitleBox titulo={`Cliente(${pedido.buffer.codCliente})`}>
                  <Box display="flex" alignItems="center">
                    <Box mr={1}>
                      <Icon color="action" fontSize="default">
                        person
                      </Icon>
                    </Box>
                    <Typography variant="h5">{pedido.buffer.nombreCliente}</Typography>
                  </Box>
                </QTitleBox>

                <QTitleBox titulo="Fecha">
                  <Box display="flex" alignItems="center">
                    <Box mr={1}>
                      <Icon color="action" fontSize="default">
                        event
                      </Icon>
                    </Box>
                    <Typography variant="h5">{util.formatDate(pedido.buffer.fecha)}</Typography>
                  </Box>
                </QTitleBox>
                <QListModel
                  data={lineas}
                  title="Líneas"
                  modelName="lineas"
                  ItemComponent={ListItemLineaPedido}
                  itemProps={{
                    variant: "section",
                  }}
                // disabled={pedido.buffer.firmado}
                />
              </Box>
            ) : (
              <Box width={1}>{/* <DocAgente /> */}</Box>
            )}
          </QModelBox>

          <Dialog open={modalFirmarAlbaran}>
            <DialogTitle id="form-dialog-title">Generar albarán</DialogTitle>
            <DialogContent>
              <DialogContentText id="form-dialog-description">
                Se generará un albarán parcial con las cantidades a enviar asociadas a las líneas
                que sean mayor de 0.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {generandoAlbaran ? (
                <Grid container justifyContent="center">
                  <CircularProgress color="white" size={30} />
                </Grid>
              ) : (
                <Grid container justifyContent="flex-end">
                  <Button
                    id="cancelar"
                    text="CANCELAR"
                    variant="text"
                    color="secondary"
                    onClick={() => dispatch({ type: "cancelarFirmarAlbaran" })}
                  />
                  <Button
                    id="confirmar"
                    text="CONFIRMAR"
                    variant="text"
                    color="primary"
                    onClick={() => dispatch({ type: "procesaLineasAEnviar" })}
                  />
                </Grid>
              )}
            </DialogActions>
          </Dialog>
        </QBox>
      )}
    </Quimera.Template>
  );
}

export default Pedido;
