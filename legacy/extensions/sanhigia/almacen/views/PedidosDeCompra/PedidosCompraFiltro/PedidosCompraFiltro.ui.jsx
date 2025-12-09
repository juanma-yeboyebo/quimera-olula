import { Box, Field, Filter, FilterBox } from "@quimera/comps";
// import { QArticulo } from "@quimera-extension/base-almacen";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import React from "react";

import { Proveedor, QArticuloFilter } from "../../../comps";

function PedidosCompraFiltro() {
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

  const initialFilter = {
    codproveedor: {
      value: false,
      filter: ["codigo", "like", "006"],
    },
  };

  return (
    <Quimera.Template id="PedidosCompraFiltro">
      <FilterBox
        id="pedidosProv.filter"
        schema={getSchemas().pedidosCompra}
        open={filtroVisible}
        lastFilter={true}
      // initialFilter={initialFilter}
      >
        <Filter.Schema id="codigo" />
        {/* <Filter.Schema id="codProveedor" /> */}
        <Proveedor
          id="codProveedorFiltro"
          label={`Proveedor ${codProveedorFiltro ?? ""}`}
          fullWidth
          async
          filterField={true}
          idFilter="pedidosProv.filter"
        />
        <QArticuloFilter id="ref1Filtro" idFilter="pedidosProv.filter" label={`Ref1 ${ref1Filtro ?? ""}`} seVende fullWidth filterField />
      </FilterBox>
    </Quimera.Template >
  );
}

export default PedidosCompraFiltro;
