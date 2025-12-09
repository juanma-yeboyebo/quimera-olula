import {
  Box,
  Button,
  Field,
  Icon,
  QBox,
  QBoxButton,
  QListModel,
  QModelBox,
  QSection,
  QTitleBox,
  Typography,
} from "@quimera/comps";
import { Totales } from "@quimera-extension/base-area_clientes";
import { DocAgente } from "@quimera-extension/base-ventas";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

import { MiLineaCarrito } from "../../comps";

function ToCarrito({ callbackChanged, idCarrito, initCarrito, useStyles }) {
  const [{ lineas, logic, carrito, vistaDetalle }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    util.publishEvent(carrito.event, callbackChanged);
  }, [carrito.event.serial]);

  useEffect(() => {
    !!initCarrito &&
      dispatch({
        type: "onInitCarrito",
        payload: {
          initCarrito,
          callbackChanged
        },
      });
    !initCarrito &&
      !!idCarrito &&
      dispatch({
        type: "onInitCarritoById",
        payload: {
          idCarrito,
          callbackChanged
        },
      });
  }, [initCarrito, idCarrito]);

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().carrito;
  const editable = true;
  const activoText = carrito.buffer.activo ? "(ACTIVO)" : "";

  if ((!initCarrito && !idCarrito) || initCarrito?._status === "deleted") {
    return null;
  }

  if (idCarrito && !carrito.data.idCarrito) {
    return null;
  }
  console.log("--------------");
  console.log(lineas);
  return (
    <Quimera.Template id="CarritoDetalle">
      {carrito && (
        <QBox
          width={anchoDetalle}
          titulo={`Carrito ${carrito.buffer.codigo}${activoText}`}
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
          sideButtons={
            <>
              <QBoxButton
                id="deleteCarrito"
                title="Borrar carrito"
                icon="delete"
                color="primary"
                // onClick={() =>
                //   dispatch({ type: "onDeleteCarritosItemClicked", payload: { item: carrito } })
                // }
                disabled={!editable}
              />
              {/* <QBoxButton id='activarCarrito' color="primary" title='Activar carrito' icon='check_box' />
              <QBoxButton id='generarPresupuesto' color="primary" title='Generar presupuesto' icon='download' /> */}
            </>
          }
        >
          <QModelBox id="carrito.buffer" disabled={!editable} schema={schema}>
            {vistaDetalle === "principal" ? (
              <Box>
                <QTitleBox titulo={`Cliente ${carrito.buffer.codCliente ?? ""}`}>
                  <Typography variant="h5">{carrito.buffer.nombreCliente}</Typography>
                </QTitleBox>

                <Box display="flex" justifyContent="space-between">
                  <QSection
                    title="Nota de cliente"
                    actionPrefix="editarReferenciaCarrito"
                    collapsible={true}
                    dynamicComp={() => (
                      <Box display="flex" alignItems="center">
                        <Field.Schema id="carrito.buffer/referencia" schema={schema} fullWidth />
                      </Box>
                    )}
                    saveDisabled={() => !schema.isValid(carrito.buffer)}
                  >
                    <Typography variant="h7" style={{ width: "200px" }}>
                      {carrito.buffer.referencia}
                    </Typography>
                  </QSection>
                  <Totales
                    totales={[
                      { name: "Neto", value: carrito.buffer.neto },
                      { name: "Total IVA", value: carrito.buffer.totalIva },
                      { name: "Total", value: carrito.buffer.total },
                    ]}
                  />
                </Box>
                <Box display="flex" justifyContent="center" flexDirection="column" m={1}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    m={0}
                    style={{ gap: "25px", margin: "20px 0px" }}
                  >
                    {carrito.buffer.activo && (
                      <Box
                        display="flex"
                        justifyContent="center"
                        m={0}
                        style={{ gap: "25px", margin: "20px 0px" }}
                      >
                        <Button
                          id="continuarComprando"
                          color="primary"
                          title="Activar carrito"
                          variant="contained"
                        >
                          Continuar Comprando
                        </Button>
                        <Button
                          id="confirmarCompra"
                          color="primary"
                          title="Activar carrito"
                          variant="contained"
                        >
                          Confirmar Compra
                        </Button>
                      </Box>
                    )}
                    {!carrito.buffer.activo && (
                      <Box
                        display="flex"
                        justifyContent="center"
                        m={0}
                        style={{ gap: "25px", margin: "20px 0px" }}
                      >
                        <Typography variant="h6" style={{ color: "grey" }}>Carrito inactivo</Typography>
                        <Button
                          id="activarCarrito"
                          color="secondary"
                          title="Activar carrito"
                          variant="outlined"
                        >
                          Activar
                        </Button>
                      </Box>
                    )}
                  </Box>
                  <Box display="flex" justifyContent="center" style={{ gap: "25px" }}>
                    <Button
                      id="generarPresupuesto"
                      color="secondary"
                      title="Generar presupuesto"
                      variant="contained"
                      startIcon={<Icon>file_download</Icon>}
                    >
                      Exportar a excel
                    </Button>
                  </Box>
                </Box>
                {/* <Quimera.SubView id="Checkout/Lineas" aux={"carrito"} /> */}
                {/* <QListModel
                  data={lineas}
                  title="Líneas"
                  modelName="lineas"
                  ItemComponent={MiLineaCarrito}
                  itemProps={{
                    variant: "section",
                  }}
                  disabled={true}
                /> */}
                {Object.values(lineas.dict).map(linea => (
                  // <ItemLineaCarritoCheckout key={linea.idLinea} model={linea} modelName='lineaCarrito' />
                  <Quimera.SubView
                    id="ItemLineaCarritoCheckout"
                    key={linea.idLinea}
                    model={linea}
                    modelName="lineaCarrito"
                  />
                ))}
              </Box>
            ) : (
              <Box width={1}>
                <DocAgente />
              </Box>
            )}
          </QModelBox>
        </QBox>
      )}
    </Quimera.Template>
  );
}

export default ToCarrito;
