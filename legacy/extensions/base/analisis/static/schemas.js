import { util } from "quimera";
import { Field, Schema } from "quimera/lib";

export default parent => ({
  ...parent,
  dataframe: Schema("in_dataframe", "Navegador ventas").fields({
    medidas: Field.Options("medidas", "medidas").load(false)    
    .options([
      { key: "m_venta", value: "Ventas" },
      { key: "m_coste", value: "Coste" },
      { key: "m_cantidad", value: "Cantidad" },
    ]),
    filter: Field.Options("filter", "filter").load(false),
    nivelesY: Field.Options("nivelesy", "nivelesY").load(false)
    .options([
      { key: "d_referencia", value: "Artículo" },
      { key: "d_mes", value: "Mes" },
      { key: "in_dimmes_trimestre", value: "Trimestre" },
      { key: "in_dimmes_ano", value: "Año" },
      { key: "d_codejercicio", value: "Ejercicio" },
      { key: "in_dimprovincia_provincia", value: "Provincia" },
      { key: "in_dimcliente_nombre", value: "Cliente" },
      { key: "in_dimagente_nombreap", value: "Agente" },
      { key: "in_dimpais_nombre", value: "País" },
      { key: "d_codgrupocompras", value: "G. Compras" },
      { key: "d_codpostal", value: "Cód. Postal" },
      { key: "in_dimagentecli_nombreap", value: "Agente Cliente" },
      { key: "in_dimfamilia_descripcion", value: "Familia" },
      { key: "in_dimsubfamilia_descripcion", value: "Subfamilia" },
    ]),
    nivelesX: Field.Options("nivelesx", "nivelesX").load(false)
    .default("d_referencia")
    .options([
      { key: "d_referencia", value: "Artículo" },
      { key: "d_mes", value: "Mes" },
      { key: "in_dimmes_trimestre", value: "Trimestre" },
      { key: "in_dimmes_ano", value: "Año" },
      { key: "d_codejercicio", value: "Ejercicio" },
      { key: "in_dimprovincia_provincia", value: "Provincia" },
      { key: "in_dimcliente_nombre", value: "Cliente" },
      { key: "in_dimagente_nombreap", value: "Agente" },
      { key: "in_dimpais_nombre", value: "País" },
      { key: "d_codgrupocompras", value: "G. Compras" },
      { key: "d_codpostal", value: "Cód. Postal" },
      { key: "in_dimagentecli_nombreap", value: "Agente Cliente" },
      { key: "in_dimfamilia_descripcion", value: "Familia" },
      { key: "in_dimsubfamilia_descripcion", value: "Subfamilia" },
    ]),
  }),
  filtroVentas: Schema("in_dataframe", "Filtros Navegador ventas").fields({
    articulos: Field.Options("articulos", "Articulos"),
  }),
});
