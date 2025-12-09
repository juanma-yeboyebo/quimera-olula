import { Box, Button, Column, DataRow, Icon, Table } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, util } from "quimera";
import React, { useEffect, useState } from "react";

const TableRow = ({ index: idx, rowData = [], style, schema, isHeader = false }) => {
  const [detalleCompras, setDetalleCompras] = useState(false);
  const consulta = rowData;
  // const compras = consulta?.compras?.sort(
  //   (a, b) => new Date(a.fechacompra).getTime() - new Date(b.fechacompra).getTime(),
  // );

  const handleDetalleCompras = () => {
    setDetalleCompras(!detalleCompras);
  };

  const anchoCaja = document
    .getElementById("cajaTdbConsultaCompras")
    ?.getBoundingClientRect().width;
  // console.log("mimensaje_consulta", consulta);

  return (
    <>
      <DataRow key={rowData["idArticuloProv"]} style={style} index={idx}>
        <Column.Text
          id="nombre"
          header="Cliente"
          order="nombre"
          value={consulta => {
            return `${consulta.nombreConsumidor} ${consulta.apellidosConsumidor}`;
          }}
          width={anchoCaja * 0.3}
          minWidth={100}
          data={consulta}
          isHeader={isHeader}
          index={idx}
        />
        <Column.Text
          id="nombreComercio"
          header="Establecimiento"
          order="idComercio"
          value={consulta => consulta.nombreComercio}
          width={anchoCaja * 0.3}
          minWidth={100}
          data={consulta}
          isHeader={isHeader}
          index={idx}
        />
        <Column.Date
          id="fechaVenta"
          header="Fecha"
          order="fechaVenta"
          value={consulta => consulta.fechaVenta}
          width={anchoCaja * 0.1}
          minWidth={70}
          data={consulta}
          isHeader={isHeader}
          index={idx}
        />
        <Column.Currency
          id="importe"
          header="Importe"
          order="importe"
          value={consulta => consulta.importe}
          width={anchoCaja * 0.1}
          minWidth={50}
          data={consulta}
          isHeader={isHeader}
          index={idx}
        />
        <Column.Text
          id="emailConsumidor"
          header="Email"
          order="emailConsumidor"
          value={consulta => consulta.emailConsumidor}
          width={anchoCaja * 0.3}
          minWidth={100}
          data={consulta}
          isHeader={isHeader}
          index={idx}
        />

        <Column.Text
          id="telefonoConsumidor"
          header="Teléfono"
          order="telefonoConsumidor"
          value={consulta => consulta.telefonoConsumidor}
          width={anchoCaja * 0.1}
          minWidth={70}
          data={consulta}
          isHeader={isHeader}
          index={idx}
        />
      </DataRow>
    </>
  );
};

function ConsultaCompras({ useStyles }) {
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
      payload: { nombre: "Consulta compras" },
    });

    return () =>
      util.getSetting("appDispatch")({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [dispatch]);

  const result = consultas.idList?.map(i => consultas.dict[i]);

  return (
    <Quimera.Template id="ConsultaCompras">
      <Box display="flex" style={{ margin: "0px 60px" }}>
        <Box style={{ width: "40%" }}>
          <Quimera.SubView id="ConsultaCompras/ConsultaComprasFiltro" />
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
              id="cajaTdbConsultaCompras"
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
                id="tdbConsultaCompras"
                idField="idConsumidor"
                // data={consultas.idList?.map(i => consultas.dict[i])}
                data={result}
                clickMode="line"
                RowRenderer={TableRow}
                orderColumn={order}
              // next={() => dispatch({ type: "onNextPPPPP" })}
              // hasMore={consultas?.page?.next !== null}
              ></Table>
            </Box>
          }
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default ConsultaCompras;
