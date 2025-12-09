// import { useMemo } from 'react';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Column,
  DataRow,
  Field,
  Table,
  Typography,
} from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";

import { Almacen, Proveedor } from "../../comps";

const TableRow = ({ index: idx, rowData = [], style, schema, isHeader = false }) => {
  // const RowMemo = useMemo(() => {
  return (
    <DataRow key={rowData["idArticuloProv"]} style={style} index={idx}>
      <Column.Selection
        id="selection"
        flexBasis={30}
        data={rowData}
        isHeader={isHeader}
        index={idx}
      />
      {/* <Column.Schema
          header="Proveedor"
          schema={schema}
          id="nombreProveedor"
          flexBasis={150}
          data={rowData}
          isHeader={isHeader}
        /> */}
      <Column.Schema
        schema={schema}
        id="referencia"
        flexBasis={80}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema
        schema={schema}
        id="descripcion"
        flexBasis={225}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Action
        id="aPedir"
        header="A Pedir"
        flexBasis={65}
        index={idx}
        value={_ => <Field.Int id="aPedir" index={idx} value={rowData.aPedir ?? 0} />}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema
        schema={schema}
        id="consumoMensualIA"
        flexBasis={50}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema
        schema={schema}
        id="diasServicioIA"
        flexBasis={50}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema
        schema={schema}
        id="factorSeguridadIA"
        flexBasis={50}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema
        schema={schema}
        id="aPedirIA"
        flexBasis={50}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema
        schema={schema}
        id="requiereEmbalajes"
        flexBasis={45}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema
        schema={schema}
        id="uniEmbalaje"
        flexBasis={40}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema schema={schema} id="tT1" flexBasis={60} data={rowData} isHeader={isHeader} />
      <Column.Schema schema={schema} id="tT2" flexBasis={60} data={rowData} isHeader={isHeader} />
      <Column.Schema schema={schema} id="tT3" flexBasis={60} data={rowData} isHeader={isHeader} />
      <Column.Schema schema={schema} id="tT4" flexBasis={60} data={rowData} isHeader={isHeader} />
      <Column.Schema
        schema={schema}
        id="tTotal"
        flexBasis={75}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema
        schema={schema}
        id="enStock"
        flexBasis={60}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema
        schema={schema}
        id="reservada"
        flexBasis={60}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema
        schema={schema}
        id="pteRecibir"
        flexBasis={60}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema
        schema={schema}
        id="diasServicio"
        flexBasis={50}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema
        schema={schema}
        id="stockMin"
        flexBasis={50}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema
        schema={schema}
        id="stockMax"
        flexBasis={50}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema
        schema={schema}
        id="stockSeg"
        flexBasis={50}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema schema={schema} id="coste" flexBasis={60} data={rowData} isHeader={isHeader} />
      <Column.Schema schema={schema} id="dto" flexBasis={50} data={rowData} isHeader={isHeader} />
      <Column.Schema
        schema={schema}
        id="personalizado"
        flexBasis={45}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema
        schema={schema}
        id="consumoMensual"
        flexBasis={60}
        data={rowData}
        isHeader={isHeader}
      />
      <Column.Schema
        schema={schema}
        id="ultCantEnt"
        flexBasis={60}
        data={rowData}
        isHeader={isHeader}
      />
    </DataRow>
  );
  // }, [rowData])
  // return RowMemo
};

function PrevisionCompras() {
  const [
    {
      smState,
      currentPage,
      pageRows,
      hasLines,
      hasPrev,
      hasNext,
      tableData,
      codProveedor,
      codAlmacen,
    },
  ] = useStateValue();
  const schema = getSchemas().previsionCompras;

  const showSearch = ["idle-search", "searching"].includes(smState);
  const showData = ["idle-data", "refreshing", "creating"].includes(smState);
  const showBackdrop = ["searching", "refreshing", "creating"].includes(smState);
  const idle = ["idle-search", "idle-data"].includes(smState);

  const rows = tableData.length;
  const currentFirst = currentPage * pageRows + 1;
  const maxLast = (currentPage + 1) * pageRows;
  const currentLast = Math.min(rows, maxLast);

  const searchBox = (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      maxWidth="1000px"
      margin="auto"
      width="100%"
    >
      <Box display="flex" justifyContent="center" style={{ gap: "1.5em" }}>
        <Field.Date id="fechaDesde" label="Desde" />
        <Field.Date id="fechaHasta" label="Hasta" />
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" flexDirection="column" minWidth="500px">
          <Proveedor
            id="codProveedor"
            label={`Proveedor ${codProveedor ?? ""}`}
            fullWidth
            async
            autoFocus
          />
          <Almacen id="codAlmacen" label={`Almacén ${codAlmacen ?? ""}`} fullWidth async />
        </Box>
        <Box display="flex" flexDirection="column">
          <Field.Int id="diasServicio" label="Días de Servicio" />
          <Field.Int id="factorSeguridad" label="Factor de Seguridad" />
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" margin="25px 0" style={{ gap: "1.5em" }}>
        <Button id="buscar" color="primary" disabled={!idle || !codAlmacen || !codProveedor}>
          Buscar
        </Button>
      </Box>
    </Box>
  );

  const paginationBox = (
    <Box display="flex" justifyContent="space-between" margin="10px 0">
      <Box display="flex" flexDirection="column">
        <Typography variant="caption" style={{ color: "grey" }}>
          Proveedor
        </Typography>
        <Typography variant="h6" style={{ marginTop: "-5px" }}>
          {tableData?.[0]?.nombreProveedor}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" style={{ gap: "0.5em" }}>
        <Button id="volverABuscar" color="secondary" disabled={!idle}>
          Modificar búsqueda
        </Button>
        <Button
          id="generarPedido"
          color="primary"
          disabled={!idle || !hasLines || !tableData.length}
        >
          Generar pedido
        </Button>
      </Box>
      <Box display="flex" alignItems="center" style={{ gap: "0.5em" }}>
        <Button id="prevPage" color="secondary" disabled={!hasPrev}>
          Anterior
        </Button>
        <Typography
          variant="caption"
          style={{
            color: "grey",
            minWidth: "180px",
            textAlign: "center",
          }}
        >
          Mostrando {currentFirst}-{currentLast} de {rows}
        </Typography>
        <Button id="nextPage" color="secondary" disabled={!hasNext}>
          Siguiente
        </Button>
      </Box>
    </Box>
  );

  const dataBox = (
    <Box>
      {paginationBox}
      <Table
        id="prevCompras"
        idField="idArticuloProv"
        data={tableData?.slice(currentPage * pageRows, (currentPage + 1) * pageRows) ?? []}
        schema={schema}
        // next={() => dispatch({ type: 'onNextPedidos' })}
        // hasMore={pedidos.page.next !== null}
        clickMode="line"
        RowRenderer={TableRow}
        page={currentPage}
        rows={pageRows}
        // onChange={onAPedirChanged}
        // orderColumn={pedidos.order}
      ></Table>
      {paginationBox}
    </Box>
  );

  const backdropBox = (
    <Backdrop open={showBackdrop} style={{ zIndex: 999 }}>
      Cargando...&nbsp;&nbsp;
      <CircularProgress color="inherit" />
    </Backdrop>
  );

  return (
    <Quimera.Template id="PrevisionCompras">
      <div style={{ margin: "0 20px" }}>
        <h2>Previsión de compras</h2>
        {backdropBox}
        {showSearch ? searchBox : null}
        {showData ? dataBox : null}
      </div>
    </Quimera.Template>
  );
}

export default PrevisionCompras;
