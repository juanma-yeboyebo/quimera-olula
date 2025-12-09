import { Box, Button, Column, DataRow, Icon, IconButton, Table, Typography } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, util } from "quimera";
import React, { useEffect, useState } from "react";

const TableRow = ({ index: idx, rowData = [], style, schema, isHeader = false }) => {
  const [detalleCompras, setDetalleCompras] = useState(false);
  const consulta = rowData;
  const compras = consulta?.compras?.sort(
    (a, b) => new Date(a.fechacompra).getTime() - new Date(b.fechacompra).getTime(),
  );

  const handleDetalleCompras = () => {
    setDetalleCompras(!detalleCompras);
  };

  const anchoCaja = document
    .getElementById("cajaTdbConsultaUsuarios")
    ?.getBoundingClientRect().width;

  return (
    <>
      <DataRow key={rowData["idArticuloProv"]} style={style} index={idx}>
        <Column.Text
          id="nombre"
          header="Cliente"
          order="nombre"
          value={consulta => {
            return `${consulta.nombre} ${consulta.apellidos}`;
          }}
          width={anchoCaja * 0.35}
          minWidth={100}
          data={consulta}
          isHeader={isHeader}
          index={idx}
        />
        <Column.Text
          id="email"
          header="Email"
          order="email"
          value={consulta => consulta.email}
          width={anchoCaja * 0.35}
          minWidth={100}
          data={consulta}
          isHeader={isHeader}
          index={idx}
        />

        <Column.Text
          id="telefono"
          header="Teléfono"
          order="telefono"
          value={consulta => consulta.telefono}
          width={anchoCaja * 0.15}
          minWidth={70}
          data={consulta}
          isHeader={isHeader}
          index={idx}
        />
        <Column.Action
          id="compras"
          header="Compras"
          width={anchoCaja * 0.1}
          minWidth={70}
          index={idx}
          value={_ => (
            <IconButton
              id="detalleCompras"
              color="primary"
              disabled={compras?.length <= 0}
              tooltip={!detalleCompras ? "Abrir listado compras" : "Cerrar listado compras"}
              onClick={handleDetalleCompras}
            >
              <Box mr={1}>
                <Typography>{`${compras?.length}`}</Typography>
              </Box>
              <Icon>{!detalleCompras ? "open_in_full" : "close_fullscreen"}</Icon>
            </IconButton>
          )}
          data={rowData}
          isHeader={isHeader}
        />
      </DataRow>
      {detalleCompras && (
        <Box ml={4}>
          <Table id="tdbDetalleCompras" idField="idcomercio" data={compras} clickMode="line">
            <Column.Text
              id="nombre"
              header="Comercio"
              order="nombre"
              width={anchoCaja * 0.35}
              minWidth={100}
            />
            <Column.Date
              id="fechacompra"
              header="Fecha de compra"
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

function ConsultaCompraUser({ useStyles }) {
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
      payload: { nombre: "Consulta compras por usuarios" },
    });

    return () =>
      util.getSetting("appDispatch")({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [dispatch]);

  return (
    <Quimera.Template id="ConsultaCompraUser">
      <Box display="flex" style={{ margin: "0px 60px" }}>
        <Box style={{ width: "40%" }}>
          <Quimera.SubView id="ConsultaCompraUser/ConsultaCompraUserFiltro" />
        </Box>
        <Box style={{ width: "67%", marginTop: "12px" }}>
          <Box display={"flex"} justifyContent={"space-between"} style={{ marginLeft: "40px" }}>
            <Button
              id="exportarConsultaClientes"
              text="Exportar clientes a excel"
              variant="text"
              color="primary"
              startIcon={<Icon>save_alt</Icon>}
              disabled={consultas.idList.length === 0}
            // onClick={() => pass}
            />
            <Button
              id="exportarConsultaCompras"
              text="Exportar compras de clientes a excel"
              variant="text"
              color="primary"
              startIcon={<Icon>save_alt</Icon>}
              disabled={consultas.idList.length === 0}
            // onClick={() => pass}
            />
          </Box>
          {
            <Box
              id="cajaTdbConsultaUsuarios"
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
                id="tdbConsultaCompraUser"
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

export default ConsultaCompraUser;
