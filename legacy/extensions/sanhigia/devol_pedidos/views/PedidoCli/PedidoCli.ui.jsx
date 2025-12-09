import { Totales } from "@quimera-extension/base-area_clientes";
import { DocAgente, DocClienteYDir, DocDirCliente, DocFecha } from "@quimera-extension/base-ventas";
import {
  Box,
  Field,
  Icon,
  QBox,
  QBoxButton,
  QListModel,
  QModelBox,
  QSection,
  Typography,
} from "@quimera/comps";
import { InfiniteScroll, List } from "@quimera/thirdparty";
import Quimera, { getSchemas, useStateValue, useWidth, util } from "quimera";
import React, { useCallback, useEffect } from "react";

import { Evento, LineaPedidoCliComp, ListItemLineaHistoricoPedido } from "../../comps/";

const Lineas = ({ lineas, editable }) => {
  console.log("RERENDERING LINEAS", lineas);

  return (
    <QListModel
      data={lineas}
      title="Líneas"
      modelName="lineas"
      ItemComponent={LineaPedidoCliComp}
      itemProps={{
        variant: "section",
      }}
      disabled={!editable}
    />
  );
};

const Historico = ({ historico, disabled, dispatch }) => {
  console.log("RERENDERING HISOTICO");

  return (
    <Box
      id={`scrollableBoxHistoricoPedidos`}
      style={{ height: "auto", maxHeight: 300, overflow: "auto" }}
    >
      <InfiniteScroll
        dataLength={historico.idList?.length}
        next={() => dispatch({ type: `onNextHistorico` })}
        hasMore={historico?.page?.next !== null}
        loader={<h4>Loading...</h4>}
        scrollableTarget={`scrollableBoxHistorico`}
      >
        {historico.idList.length > 0 && <Typography variant="overline">Histórico</Typography>}
        <List disablePadding>
          {historico.idList.map(h => (
            <ListItemLineaHistoricoPedido
              key={h}
              linea={historico.dict[h]}
              disabled={disabled}
              dispatch={dispatch}
            />
          ))}
        </List>
      </InfiniteScroll>
    </Box>
  );
};

const historicosIguales = (prev, next) => {
  const igual = prev.historico?.idList.length == next.historico?.idList.length;
  console.log(
    "RERENDERING HOSTORICOMEMO?",
    prev.historico?.idList.length,
    next.historico?.idList.length,
    igual,
  );

  return igual;
};
// const lineasIguales = (prev, next) => {
//   const igual = (prev.lineas?.idList.length == next.lineas?.idList.length)
//   console.log('RERENDERING HOSTORICOMEMO LINEAS?', prev.lineas?.idList.length, next.lineas?.idList.length, igual)

//   return igual
// }
const LineasMemo = React.memo(Lineas);
const HistoricoMemo = React.memo(Historico, historicosIguales);

function PedidoCli({ callbackChanged, idPedido, initPedido, useStyles }) {
  const [{ historico, lineas, logic, pedido, status, vistaDetalle }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    util.publishEvent(pedido.event, callbackChanged);
  }, [pedido.event.serial]);

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

  // Necesario para que no salte el useEffect de onInit en cada render de LineaPedidoCliNueva
  const callbackNuevaLinea = useCallback(
    payload => dispatch({ type: "onLineaCreada", payload }),
    [dispatch],
  );

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().pedidos;
  const editable = logic.pedidoEditable(pedido.data);

  if ((!initPedido && !idPedido) || initPedido?._status === "deleted") {
    return null;
  }

  if (idPedido && !pedido.data.idPedido) {
    return null;
  }

  return (
    <Quimera.Template id="PedidoCli">
      {pedido && (
        <QBox
          width={anchoDetalle}
          titulo={`Pedido ${pedido.data.codigo}`}
          botonesCabecera={[
            { icon: "more_horiz", id: "mas", text: "Más" },
            { icon: "arrow_back", id: "atras", text: "Atrás" },
          ]}
          sideButtons={
            <>
              <QBoxButton
                id="deletePedido"
                title="Borrar pedido"
                icon="delete"
                disabled={!editable}
              />
              <Quimera.Block id="sideButtons" />
              <QBoxButton
                id="enviarPDA"
                title="Enviar"
                icon="send"
                disabled={!pedido.buffer?.enBorrador}
                busy={status.enviandoPda}
              />
              <QBoxButton
                id="shVerTracking"
                title="Ver tracking"
                icon="local_shipping"
                disabled={pedido.buffer.servido === "No"}
              />
              <QBoxButton
                id="shLineaPromo"
                title="Línea de promoción"
                icon="card_giftcard"
                disabled={!editable || !lineas.current}
              />
            </>
          }
        >
          {vistaDetalle === "principal" ? (
            <Box>
              <QModelBox id="pedido.buffer" disabled={!editable} schema={schema}>
                <DocClienteYDir />
                <DocDirCliente />

                <QSection
                  title={`Evento: ${pedido.buffer.codEvento || ""}`}
                  actionPrefix="pedido.buffer/codEvento"
                  alwaysInactive
                  dynamicComp={() => (
                    <Box width={1}>
                      <Evento
                        id="pedido.buffer/codEvento"
                        codEvento={pedido.buffer.codEvento}
                        fullWidth
                      />
                    </Box>
                  )}
                >
                  <Box display="flex">
                    <Typography variant="body1">
                      {pedido.buffer.nombreEvento || "Venta regular"}
                    </Typography>
                  </Box>
                </QSection>

                <QSection alwaysInactive>
                  <Box display="flex">
                    <Box mr={1}>
                      <Icon color="action" fontSize="medium">
                        email
                      </Icon>
                    </Box>
                    <Typography variant="body1">{pedido.buffer.email}</Typography>
                  </Box>
                </QSection>
                <Box display="flex" justifyContent="space-between">
                  <DocFecha />
                  <QSection actionPrefix="totales" alwaysInactive>
                    <Totales
                      totales={[
                        { name: "Neto", value: pedido.buffer.neto },
                        { name: "Total IVA", value: pedido.buffer.totalIva },
                        { name: "Total", value: pedido.buffer.total },
                      ]}
                    />
                  </QSection>
                </Box>
                <QSection
                  title="Observaciones"
                  actionPrefix="pedido.buffer"
                  alwaysInactive={!editable}
                  dynamicComp={() => (
                    <Box width={1}>
                      <Field.TextArea id="pedido.buffer.observaciones" label="" fullWidth />
                    </Box>
                  )}
                >
                  <Box display="flex">
                    <Typography variant="body2">
                      {pedido.buffer.observaciones || "Sin observaciones"}
                    </Typography>
                  </Box>
                </QSection>
              </QModelBox>
              {editable && (
                <Quimera.View
                  id="LineaPedidoCliNueva"
                  idPedido={pedido.data.idPedido}
                  inline
                  callbackGuardada={callbackNuevaLinea}
                />
              )}
              <LineasMemo lineas={lineas} editable={logic.pedidoEditable(pedido.buffer)} />
              {pedido && logic.pedidoEditable(pedido.buffer) && (
                <HistoricoMemo historico={historico} disabled={!editable} dispatch={dispatch} />
              )}
            </Box>
          ) : (
            <Box width={1}>
              <QModelBox id="pedido.buffer" disabled={!editable} schema={schema}>
                <DocAgente />
              </QModelBox>
            </Box>
          )}
        </QBox>
      )}
    </Quimera.Template>
  );
}

export default PedidoCli;
