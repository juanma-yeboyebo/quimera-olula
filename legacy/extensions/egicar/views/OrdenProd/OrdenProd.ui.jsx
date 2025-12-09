import { Box, Button, Grid, QBox, QModelBox, QSection, Typography } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

function OrdenProd({ callbackChanged, idTareaProp, codOrden, initOrden, urlAtrasProp, useStyles }) {
  const [{ orden }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: { urlAtrasProp, idTareaProp },
    });
  }, []);

  useEffect(() => {
    util.publishEvent(orden.event, callbackChanged);
  }, [orden.event.serial]);

  useEffect(() => {
    !!initOrden &&
      dispatch({
        type: "onInitOrden",
        payload: {
          initOrden,
          callbackChanged,
        },
      });
    !initOrden &&
      !!codOrden &&
      dispatch({
        type: "onInitOrdenById",
        payload: {
          action: "get_ordenes_produccion",
          filterOrden: ["codorden", "eq", codOrden],
          callbackChanged,
        },
      });
  }, [initOrden, codOrden]);

  const cuerpoEstado = {
    "PTE": {
      nombre: "Pendiente",
    },
    "EN CURSO": {
      nombre: "En curso",
    },
    "TERMINADO": {
      nombre: "Terminada",
    },
  };

  // console.log("mimensaje_orden", orden.data);

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().compras;
  const editable = false;
  const titulo = `${orden.data.codOrden} (${cuerpoEstado[orden.data.estado]?.nombre})`;

  if ((!initOrden && !codOrden) || initOrden?._status === "deleted") {
    return null;
  }

  if (codOrden && !orden.data.codOrden) {
    return null;
  }

  const estilosBoxImporte = {
    box: {
      activada: classes.neutro,
      desactivada: classes.neutro,
      inhabilitada: classes.neutro,
    },
  };

  return (
    <Quimera.Template id="OrdenProd">
      {orden && (
        <QBox
          width={anchoDetalle}
          titulo={titulo}
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
        >
          <Grid container>
            <QModelBox id="orden.buffer" disabled={!editable} schema={schema}>
              <Grid item container justifyContent="space-between">
                <Grid item xs={12} sm={9} md={9}>
                  <QSection
                    title={`Artículo(${orden.data.referencia})`}
                    actionPrefix="orden.buffer/idOrdenProd"
                    alwaysInactive={!editable}
                  >
                    <Box display="flex">
                      <Typography variant="body1">
                        {orden.data.descripcionArticulo || "Sin Nombre"}
                      </Typography>
                    </Box>
                  </QSection>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                  <QSection
                    title="Cantidad fabricada"
                    actionPrefix="orden.buffer/cantotal"
                    alwaysInactive={!editable}
                    estilos={estilosBoxImporte}
                  >
                    <Box display="flex" md={6}>
                      <Typography variant="h5">{`${orden.buffer.cantotal || 0}/${orden.buffer.canprogramada || 0
                        }`}</Typography>
                    </Box>
                  </QSection>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <QSection
                  title={`Pedido${orden.data.codPedido ? `(${orden.data.codPedido})` : ""}`}
                  actionPrefix="orden.buffer/idOrdenProd"
                  alwaysInactive={!editable}
                >
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1">
                      {`${util.formatDate(orden.buffer.fechaPedido) || "Sin fecha pedido"}. ${orden.buffer.nombreCliente || "Sin cliente"
                        }`}
                    </Typography>
                    <Button
                      id="irPedido"
                      data={{ orden }}
                      color="primary"
                      // className={classes.botonSecundario}
                      variant="contained"
                      text={"Ir a pedido"}
                      onClick={() =>
                        dispatch({
                          type: "onIrPedidoClicked",
                          payload: {
                            ...orden.data,
                          },
                        })
                      }
                      disabled={!orden.data.idPedido}
                    />
                  </Box>
                </QSection>
              </Grid>
            </QModelBox>
          </Grid>
        </QBox>
      )}
    </Quimera.Template>
  );
}

export default OrdenProd;
