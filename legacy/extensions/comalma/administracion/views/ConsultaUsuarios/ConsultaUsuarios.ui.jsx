import { Box, Button, Column, DataRow, Icon, Table } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, util } from "quimera";
import React, { useEffect } from "react";

const TableRow = ({ index: idx, rowData = [], style, schema, isHeader = false }) => {
  const consulta = rowData;
  const compras = consulta?.compras?.sort(
    (a, b) => new Date(a.fechacompra).getTime() - new Date(b.fechacompra).getTime(),
  );

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
          width={anchoCaja * 0.4}
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
          width={anchoCaja * 0.4}
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
      </DataRow>
    </>
  );
  // }, [rowData])
  // return RowMemo
};

function ConsultaUsuarios({ useStyles }) {
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
      payload: { nombre: "Consulta usuarios" },
    });

    return () =>
      util.getSetting("appDispatch")({ type: "setNombrePaginaActual", payload: { nombre: "" } });
  }, [dispatch]);

  return (
    <Quimera.Template id="ConsultaUsuarios">
      <Box display="flex" style={{ margin: "0px 60px" }}>
        <Box style={{ width: "40%" }}>
          <Quimera.SubView id="ConsultaUsuarios/ConsultaUsuariosFiltro" />
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
                id="tdbConsultaUsuarios"
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

export default ConsultaUsuarios;
