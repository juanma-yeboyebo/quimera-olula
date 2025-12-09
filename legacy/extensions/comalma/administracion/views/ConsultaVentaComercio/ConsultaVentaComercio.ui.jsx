import { Box, Button, Column, DataRow, Icon, IconButton, Table, Typography } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, util } from "quimera";
import React, { useEffect, useState } from "react";

const TableRow = ({ index: idx, rowData = [], style, schema, isHeader = false }) => {
  const [{ consultas }, dispatch] = useStateValue();
  const [detalleCompras, setDetalleCompras] = useState(false);
  const consulta = rowData;
  const ventas = consulta?.ventas?.sort(
    (a, b) => new Date(a.fechacompra).getTime() - new Date(b.fechacompra).getTime(),
  );

  const totalImporte = consultas.idList
    ?.map(i => consultas.dict[i])
    .reduce((n, { importe }) => n + importe, 0);

  const totalVentas = consultas.idList
    ?.map(i => consultas.dict[i])
    .reduce((n, { ventas }) => n + ventas.length, 0);

  const handleDetalleCompras = () => {
    setDetalleCompras(!detalleCompras);
  };

  const anchoCaja = document
    .getElementById("cajaTdbConsultaVentaComercio")
    ?.getBoundingClientRect().width;

  return (
    <>
      <DataRow key={rowData["idArticuloProv"]} style={style} index={idx}>
        <Column.Text
          id="nombre"
          header="Establecimiento"
          order="nombre"
          value={consulta => consulta.nombre}
          width={anchoCaja * 0.4}
          minWidth={100}
          data={consulta}
          isHeader={isHeader}
          index={idx}
        />
        <Column.Action
          id="ventas"
          header={`Ventas(${totalVentas})`}
          width={anchoCaja * 0.15}
          minWidth={70}
          index={idx}
          value={_ => (
            <IconButton
              id="detalleCompras"
              color="primary"
              disabled={ventas?.length <= 0}
              tooltip={!detalleCompras ? "Abrir listado ventas" : "Cerrar listado ventas"}
              onClick={handleDetalleCompras}
            >
              <Box mr={1}>
                <Typography>{`${ventas?.length}`}</Typography>
              </Box>
              <Icon>{!detalleCompras ? "open_in_full" : "close_fullscreen"}</Icon>
            </IconButton>
          )}
          data={rowData}
          isHeader={isHeader}
        />
        <Column.Currency
          id="importe"
          header={`Importe(${util.euros(totalImporte)})`}
          order="importe"
          value={consulta => consulta.importe}
          width={anchoCaja * 0.4}
          minWidth={100}
          data={consulta}
          isHeader={isHeader}
          index={idx}
        />
      </DataRow>
      {detalleCompras && (
        <Box ml={4}>
          <Table id="tdbDetalleCompras" idField="idcomercio" data={ventas} clickMode="line">
            <Column.Text
              id="nombreyapellidosconsumidor"
              header="Cliente"
              order="nombreyapellidosconsumidor"
              width={anchoCaja * 0.4}
              minWidth={100}
            />
            <Column.Date
              id="fechacompra"
              header="Fecha de venta"
              order="fechacompra"
              width={anchoCaja * 0.35}
              minWidth={70}
            />
            <Column.Currency
              id="importe"
              header="Importe"
              order="importe"
              width={anchoCaja * 0.15}
              minWidth={50}
            />
          </Table>
        </Box>
      )}
    </>
  );
  // }, [rowData])
  // return RowMemo
};

function ConsultaVentaComercio({ useStyles }) {
  const [{ consultas }, dispatch] = useStateValue();
  const alturaHeader = 0;

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, []);
  // console.log(Object.values(consultas.dict));
  const order = {
    field: "fechaCompra",
    direction: "ASC",
  };

  useEffect(() => {
    util.getSetting("appDispatch")({
      type: "setNombrePaginaActual",
      payload: { nombre: "Consulta ventas por establecimiento" },
    });

    return () =>
      util.getSetting("appDispatch")({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [dispatch]);

  return (
    <Quimera.Template id="ConsultaVentaComercio">
      <Box display="flex" style={{ margin: "0px 60px" }}>
        <Box style={{ width: "40%" }}>
          <Quimera.SubView id="ConsultaVentaComercio/ConsultaVentaComercioFiltro" />
        </Box>
        <Box style={{ width: "67%", marginTop: "12px" }}>
          <Box style={{ marginLeft: "40px" }}>
            <Button
              id="exportarConsulta"
              text="Exportar a excel"
              variant="text"
              color="primary"
              startIcon={<Icon>save_alt</Icon>}
              disabled={consultas.idList.length === 0}
            // onClick={() => pass}
            />
          </Box>
          {
            <Box
              id="cajaTdbConsultaVentaComercio"
              style={{
                marginTop: "5px",
                marginLeft: "40px",
                overflowY: "auto",
                overflowX: "scroll",
                maxHeight: `calc(100vh - 130px - ${alturaHeader}px)`,
                minHeight: `calc(100vh - 130px - ${alturaHeader}px)`,
              }}
            >
              <Table
                id="tdbConsultaVentaComercio"
                idField="idConsumidor"
                data={consultas.idList?.map(i => consultas.dict[i])}
                clickMode="line"
                RowRenderer={TableRow}
                orderColumn={order}
              ></Table>
            </Box>
          }
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default ConsultaVentaComercio;
