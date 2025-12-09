import {
  Box,
  Dialog,
  Field,
  Grid,
  QBox,
  QBoxButton,
  QModelBox,
  QSection,
  Typography,
  Table,
  Column,
  IconButton,
  Icon
} from "@quimera/comps";
import { List } from "@quimera/thirdparty";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

import { ListItemLineaPedidoCompra, ModaLotesLinea, ModaAsociarBarcode, Ubicacion } from "../../comps";

const Lineas = ({ lineas, dispatch, disabled, initPedido }) => {
  // console.log("mimensaje_RERENDERING LINEAS", lineas);

  useEffect(() => {
    document.getElementById("codBarras").focus();
  }, [initPedido]);

  const callbackFocus = () => {
    if (document.getElementById("codBarras")) {
      document.getElementById("codBarras").select();
    }
  };

  const callbackCambiada = () => {
    dispatch({
      type: "onLineaCambiada",
    });
  };


  console.log("_______________", initPedido);

  return (
    <Box mt={1}>
      {lineas.idList.length > 0 && <Typography variant="overline">Líneas</Typography>}

      <List disablePadding>
        {lineas.idList.map(h => (
          <>
            <ListItemLineaPedidoCompra
              key={h}
              linea={lineas.dict[h]}
              disabled={disabled}
              dispatch={dispatch}
              callbackCambiada={callbackCambiada}
              callbackFocus={callbackFocus}
            />
          </>
        ))}
      </List>
    </Box>
  );
};

const LineasMemo = React.memo(Lineas);
function dameColorLinea(linea) {
  let colorLinea = "white";
  const total = linea.totalEnAlbaran;
  const shcant = linea.shCantAlbaran;
  const cantidad = linea.cantidad;
  if (linea.cerradaPDA) {
    colorLinea = "#2D95C1";
  } else if (total + shcant == cantidad) {
    colorLinea = "#449D44";
  } else if ((total + shcant) > 0 && (total + shcant) < cantidad) {
    colorLinea = "#EC971F";
  } else if (total + shcant > cantidad) {
    colorLinea = "yellow";
  }

  return colorLinea;
}
function PedidoCompraAgrupado({ idsPedido, useStyles }) {
  const [{
    lineas,
    modalLotesAlmacenVisible,
    modalAsociarBarcodeVisible
  }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: { idsPedido: idsPedido.split(",") },
    });
  }, []);

  const onKeyPressed = (event, idsPedido) => {
    event.key === "Enter" &&
      dispatch({
        type: "onLecturaCodBarras",
        payload: { codBarras: event.target.value, idsPedido: idsPedido },
      });
  };

  useEffect(() => {
    dispatch({
      type: "onIdsPedidoProp",
      payload: { id: idsPedido },
    });
  }, [idsPedido]);

  const mobile = ["xs", "sm", "md", "l"].includes(width);
  const anchoDetalle = 1;
  // const schema = getSchemas().pedidosCompra;
  // const editable = logic.pedidoEditable(pedido.data);
  return (
    <Quimera.Template id="PedidoCompraAgrupacion">
      <QBox
        width={anchoDetalle}
        titulo={`Pedidos ${idsPedido}`}
        botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
        sideButtons={
          <>
            <QBoxButton
              id="enviarPDA"
              title="Enviar"
              icon="send"
            />
          </>
        }
      >
        <Box display="flex" justifyContent="flex-start">
          <Box flexGrow={1}>
            <Field.Text
              id="codBarras"
              label="Cod. Barras"
              inputProps={{ maxLength: 30 }}
              fullWidth
              onClick={event => event.target.select()}
              onKeyPress={event => onKeyPressed(event, idsPedido)}
            />
          </Box>
        </Box>
        <Box>
          {mobile && (
            <Box sx={{ overflow: 'auto', width: '190%' }}>
              <Table
                id="tdbLineasPedidoCli"
                idField="id"
                className={classes.TablaLineasPedidoCli}
                data={Object.values(lineas.dict)}
                clickMode="line"
                orderColumn="idLinea"
                bgcolorRowFunction={linea =>
                  dameColorLinea(linea)
                }
              >
                <Column.Action
                  id="actioncerrarLinea"
                  value={linea => (
                    <IconButton
                      id="cerrarLinea"
                      onClick={() =>
                        dispatch({
                          type: "onCerrarLineaClicked",
                          payload: { idLineaCerrar: linea.idLinea },
                        })
                      }>
                      <Icon className={classes.iconoCabecera}>{linea.cerradaPDA ? "lock_open" : "lock"}</Icon>
                    </IconButton>
                  )}
                />
                <Column.Action
                  id="actionverpedido"
                  value={linea => (
                    <IconButton
                      id="verPedido"
                      onClick={() =>
                        dispatch({
                          type: "onVerPedidoClicked",
                          payload: { urlPedido: `/pedidosdecompra/${linea.idPedido}` },
                        })
                      }>
                      <Icon className={classes.iconoCabecera}>edit</Icon>
                    </IconButton>
                  )}
                />
                <Column.Decimal
                  id="cantidad"
                  header="Cant.."
                  order="cantidad"
                  pl={1}
                  value={linea => parseFloat(linea.cantidad)}
                  width={50}
                />
                <Column.Action
                  id="recibir"
                  className={classes.numberColumnEditable}
                  header="Recibir"
                  align="right"
                  width={80}
                  value={(linea, idx) => (
                    <>
                      {!linea.porLotes && (
                        <Field.Float
                          id={`cantidad/${idx}`}
                          field="cantidad"
                          value={Math.abs(linea.shCantAlbaran) ?? 0.0}
                          index={idx}
                          onClick={event => event.target.select()}
                          onKeyPress={event => onKeyCantidadPressed(event, linea)}
                        />
                      )}
                      {linea.porLotes && (
                        Math.abs(linea.shCantAlbaran).toFixed(2) ?? 0.0
                      )}
                    </>
                  )}
                />
                <Column.Text
                  id="descripcion"
                  header="descripcion"
                  order="descripcion"
                  pl={2}
                  value={linea => linea.descripcion}
                  width={550}
                />
                <Column.Action
                  id="actioncodubicacion"
                  width={200}
                  value={(linea, idx) => (

                    <Grid container direction="column" spacing={1}>
                      <Grid item xs={12}>
                        {/* {console.log('mimensaje_________ubicacion', linea.codUbicacionArticulo)} */}
                        <Ubicacion
                          id="linea/codUbicacionArticulo"
                          value={linea.codUbicacionArticulo}
                          index={linea.idLinea}
                          // codUbicacion={linea.codUbicacionArticulo}
                          fullWidth
                          async />
                      </Grid>
                    </Grid>

                  )}
                />
                <Column.Text
                  id="refprov"
                  header="Ref. Prov"
                  order="ubicacion"
                  pl={2}
                  value={linea => linea.referenciaProv}
                  width={150}
                />
                <Column.Decimal
                  id="totalenalbaran"
                  header="Serv."
                  order="ubicacion"
                  pl={2}
                  value={linea => linea.totalEnAlbaran}
                  width={50}
                />
                <Column.Decimal
                  id="cantidad"
                  header="Cant."
                  order="cantidad"
                  pl={2}
                  value={linea => linea.cantidad}
                  width={110}
                />
              </Table>
            </Box>
          )}
          <List disablePadding>
            {!mobile && (
              <LineasMemo
                lineas={lineas}
                dispatch={dispatch}
                disabled={false}
                initPedido={idsPedido}


              />
            )}
          </List>
          <Dialog
            open={modalLotesAlmacenVisible}
            fullWidth
            maxWidth="md"
            fullScreen={width === "xs" || width === "sm"}
            onClose={() => dispatch({ type: "onCerrarModalLotesAlmacen" })}
          >
            <ModaLotesLinea key="ModaLotesLinea" disabled={false} dispatch={dispatch} />
          </Dialog>
          <Dialog
            open={modalAsociarBarcodeVisible}
            fullWidth
            classes={{ paper: classes.paper38auto }}
            fullScreen={width === "xs" || width === "sm"}
            onClose={() => dispatch({ type: "onCerrarModaAsociarBarcode" })}
          >
            <ModaAsociarBarcode
              key="ModaAsociarBarcode"
              lineas={lineas}
              disabled={false}
              dispatch={dispatch}
            />
          </Dialog>
        </Box>


      </QBox>
    </Quimera.Template>
  );
}

export default PedidoCompraAgrupado;
