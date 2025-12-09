import { Totales } from "@quimera-extension/base-area_clientes";
import {
  DocAgente,
  DocClienteYDir,
  DocDirCliente,
  DocFecha,
  LineaPresupuestoCli,
} from "@quimera-extension/base-ventas";
import {
  Box,
  Field,
  QBox,
  QBoxButton,
  QListModel,
  QModelBox,
  QSection,
  Typography,
} from "@quimera/comps";
import { InfiniteScroll, List } from "@quimera/thirdparty";
import Quimera, { getSchemas, useStateValue, useWidth, util } from "quimera";
import { useCallback, useEffect } from "react";

import { Evento, ListItemLineaHistoricoPedido } from "../../comps";

function PresupuestoCli({ callbackChanged, idPresupuesto, initPresupuesto, useStyles }) {
  const [{ historico, lineas, logic, presupuesto, vistaDetalle }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    util.publishEvent(presupuesto.event, callbackChanged);
  }, [presupuesto.event.serial]);

  useEffect(() => {
    !!initPresupuesto &&
      dispatch({
        type: "onInitPresupuesto",
        payload: {
          initPresupuesto,
        },
      });
    !initPresupuesto &&
      !!idPresupuesto &&
      dispatch({
        type: "onInitPresupuestoById",
        payload: {
          idPresupuesto,
        },
      });
  }, [initPresupuesto, idPresupuesto]);

  const callbackNuevaLinea = useCallback(
    payload => dispatch({ type: "onLineaCreada", payload }),
    [dispatch],
  );

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().presupuestosCli;
  const editable = logic.presupuestoEditable(presupuesto.data);

  if ((!initPresupuesto && !idPresupuesto) || initPresupuesto?._status === "deleted") {
    return null;
  }

  if (idPresupuesto && !presupuesto.data.idPresupuesto) {
    return null;
  }
  console.log(presupuesto);
  console.log("PRESUPUESTO EDITABLE", editable);

  return (
    <Quimera.Template id="PresupuestoDetalle">
      {presupuesto && (
        <QBox
          width={anchoDetalle}
          titulo={`Presupuesto ${presupuesto.data.codigo}`}
          botonesCabecera={[
            { icon: "more_horiz", id: "mas", text: "Más" },
            { icon: "arrow_back", id: "atras", text: "Atrás" },
          ]}
          sideButtons={
            <>
              <QBoxButton
                id="deletePresupuesto"
                title="Borrar presupuesto"
                icon="delete"
                disabled={!editable}
              />
              <QBoxButton
                id="printPresupuesto"
                title="Imprimir presupuesto"
                icon="picture_as_pdf"
              />
            </>
          }
        >
          <QModelBox id="presupuesto.buffer" disabled={!editable} schema={schema}>
            {vistaDetalle === "principal" ? (
              <Box>
                <DocClienteYDir />
                <DocDirCliente />
                <QSection
                  title={`Evento: ${presupuesto.buffer.codEvento || ""}`}
                  actionPrefix="presupuesto.buffer/codEvento"
                  alwaysInactive
                  dynamicComp={() => (
                    <Box width={1}>
                      <Evento
                        id="presupuesto.buffer/codEvento"
                        codEvento={presupuesto.buffer.codEvento}
                        fullWidth
                      />
                    </Box>
                  )}
                >
                  <Box display="flex">
                    <Typography variant="body1">
                      {presupuesto.buffer.nombreEvento || "Venta regular"}
                    </Typography>
                  </Box>
                </QSection>
                <Quimera.Block id="afterDireccion" />
                <Box display="flex" justifyContent="space-between">
                  <DocFecha />
                  <QSection actionPrefix="totales" alwaysInactive>
                    <Totales
                      totales={[
                        { name: "Neto", value: presupuesto.buffer.neto },
                        { name: "Total IVA", value: presupuesto.buffer.totalIva },
                        { name: "Total", value: presupuesto.buffer.total },
                      ]}
                    />
                  </QSection>
                </Box>
                <QSection
                  title="Observaciones"
                  actionPrefix="presupuesto.buffer"
                  alwaysInactive={!editable}
                  dynamicComp={() => (
                    <Box width={1}>
                      <Field.TextArea id="presupuesto.buffer.observaciones" label="" fullWidth />
                    </Box>
                  )}
                >
                  <Box display="flex">
                    <Typography variant="body2">
                      {presupuesto.buffer.observaciones || "Sin observaciones"}
                    </Typography>
                  </Box>
                </QSection>
                {editable && (
                  <Quimera.View
                    id="LineaPresupuestoCliNueva"
                    idPresupuesto={presupuesto.data.idPresupuesto}
                    inline
                    callbackGuardada={callbackNuevaLinea}
                  />
                )}
                <QListModel
                  data={lineas}
                  title="Líneas"
                  modelName="lineas"
                  ItemComponent={LineaPresupuestoCli}
                  itemProps={{
                    variant: "section",
                  }}
                  disabled={!editable}
                  scrollable={true}
                // altoCabecera={160}
                />{" "}
                {presupuesto && presupuesto.buffer.editable && presupuesto.buffer.codCliente && (
                  <Box
                    id={`scrollableBoxHistoricoPresupuestos`}
                    style={{ height: "auto", maxHeight: 350, overflow: "auto" }}
                  >
                    <InfiniteScroll
                      dataLength={historico.idList?.length}
                      next={() => dispatch({ type: `onNextHistorico` })}
                      hasMore={historico?.page?.next !== null}
                      loader={<h4>Loading...</h4>}
                      scrollableTarget={`scrollableBoxHistorico`}
                    >
                      {historico.idList.length > 0 && (
                        <Typography variant="overline">Histórico</Typography>
                      )}
                      <List disablePadding>
                        {historico.idList.map(h => (
                          <ListItemLineaHistoricoPedido
                            key={h}
                            linea={historico.dict[h]}
                            disabled={!editable}
                            dispatch={dispatch}
                          />
                        ))}
                      </List>
                    </InfiniteScroll>
                  </Box>
                )}
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

export default PresupuestoCli;
