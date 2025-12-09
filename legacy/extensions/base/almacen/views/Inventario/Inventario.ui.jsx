import { Box, Icon, QBox, QListModel, QModelBox, QTitleBox, Typography } from "@quimera/comps";
import { LineaInventario } from "@quimera-extension/base-almacen";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useCallback, useEffect } from "react";
// import { Agente, DocAgente, DocClienteYDir, DocDirCliente, DocFecha, Cliente, DirCliente, LineaPedidoCli, LineaInventario } from '../../comps'

function Inventario({ callbackChanged, codInventario, initInventario, useStyles }) {
  const [{ lineas, inventario, vistaDetalle }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    util.publishEvent(inventario.event, callbackChanged);
  }, [inventario.event.serial]);

  useEffect(() => {
    !!initInventario &&
      dispatch({
        type: "onInitInventario",
        payload: {
          initInventario,
        },
      });
    !initInventario &&
      !!codInventario &&
      dispatch({
        type: "onInitInventarioById",
        payload: {
          filterInventario: ["codinventario", "eq", codInventario],
        },
      });
  }, [initInventario, codInventario]);

  // useCallback necesario para que no salte el useEffect de onInit en cada render de LineaPedidoCliNueva
  const callbackNuevaLinea = useCallback(
    payload => dispatch({ type: "onLineaCreada", payload }),
    [dispatch],
  );

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().inventarios;
  const editable = true; //logic.pedidoEditable(pedido.data)

  if ((!initInventario && !codInventario) || initInventario?._status === "deleted") {
    return null;
  }

  if (codInventario && !inventario.data.codinventario) {
    return null;
  }

  return (
    <Quimera.Template id="Inventario">
      {inventario && (
        <QBox
          width={anchoDetalle}
          titulo={`Inventario ${inventario.data.codInventario}`}
          botonesCabecera={[
            // { icon: 'more_horiz', id: 'mas', text: 'Más' },
            { icon: "arrow_back", id: "atras", text: "Atrás" },
          ]}
          sideButtons={
            <>
              {/* <QBoxButton id='deletePedido' title='Borrar pedido' icon='delete'
                disabled={!editable}
              />
              <Quimera.Block id='sideButtons' /> */}
            </>
          }
        >
          <QModelBox id="inventario.buffer" schema={schema}>
            {vistaDetalle === "principal" ? (
              <Box>
                <QTitleBox titulo="Almacén">
                  <Typography variant="h5">{`${inventario.buffer.codAlmacen} - ${inventario.buffer.nombreAlmacen}`}</Typography>
                </QTitleBox>
                <QTitleBox titulo="Fecha">
                  <Box display="flex" alignItems="center">
                    <Box mr={1}>
                      <Icon color="action" fontSize="default">
                        event
                      </Icon>
                    </Box>
                    <Typography variant="h5">{util.formatDate(inventario.buffer.fecha)}</Typography>
                  </Box>
                </QTitleBox>

                {editable && (
                  <Quimera.View
                    id="LineaInventarioNueva"
                    codInventario={inventario.data.codInventario}
                    inline
                    callbackGuardada={callbackNuevaLinea}
                  />
                )}
                <QListModel
                  data={lineas}
                  title="Líneas"
                  modelName="lineas"
                  ItemComponent={LineaInventario}
                  itemProps={{
                    variant: "section",
                  }}
                  disabled={!editable}
                />
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

export default Inventario;
