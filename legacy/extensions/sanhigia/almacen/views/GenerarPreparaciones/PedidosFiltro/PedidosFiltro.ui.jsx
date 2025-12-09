import { Box, Field, Filter, FilterBox } from "@quimera/comps";
// import { QArticulo } from "@quimera-extension/base-almacen";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import React from "react";

import { Proveedor, QArticuloFilter } from "../../../comps";

function PedidosFiltro() {
  const [
    {
      filtroVisible,
      pedidosPdtesFiltro,
      pedidosCompletarFiltro,
      codProveedorFiltro,
      ref1Filtro,
      ref2Filtro,
    },
    dispatch,
  ] = useStateValue();

  return (
    <Quimera.Template id="PedidosFiltro">
      <FilterBox
        id="pedidosGenerarPreparaciones.filter"
        schema={getSchemas().generarpreparaciones}
        open={filtroVisible}
        lastFilter={true}
      >
        <Filter.Schema id="codigo" />
        <Filter.Schema id="nombreCliente" />
        {/* <Filter.Schema id="codProveedor" /> */}
        <Proveedor
          id="codProveedorFiltro"
          label={`Proveedor ${codProveedorFiltro ?? ""}`}
          fullWidth
          async
          filterField={true}
          idFilter="pedidosGenerarPreparaciones.filter"
        />
        <QArticuloFilter id="ref1Filtro" idFilter="pedidosGenerarPreparaciones.filter" label={`Ref1 ${ref1Filtro ?? ""}`} seVende fullWidth filterField />
        <QArticuloFilter id="ref2Filtro" idFilter="pedidosGenerarPreparaciones.filter" label={`Ref2 ${ref2Filtro ?? ""}`} seVende fullWidth filterField />
        <Filter.Schema id="fecha" type="interval" />
        <Box display="flex" justifyContent="space-between">
          <Filter.Schema id="fecha" type="desde" />
          <Filter.Schema id="fecha" type="hasta" />
        </Box>
        <Box mt={1} display="flex" justifyContent="space-between">
          <Field.CheckBox
            id="pedidosCompletarFiltro"
            label="Pedidos a completar"
            checked={pedidosCompletarFiltro}
          />
          <Field.CheckBox
            id="pedidosPdtesFiltro"
            label="Pendientes de pago"
            checked={pedidosPdtesFiltro}
          />
        </Box>
      </FilterBox>
    </Quimera.Template>
  );
}

export default PedidosFiltro;
