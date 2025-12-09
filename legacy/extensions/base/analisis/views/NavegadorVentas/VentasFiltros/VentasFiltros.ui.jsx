import { Box, Filter, FilterBox, Icon, IconButton, Typography, QSection } from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue } from "quimera";
import { FilterMultiSection } from "../../../comps";

function VentasFiltros() {
  const [_, dispatch] = useStateValue();

  return (
    <Quimera.Template id="VentasFiltros">
      <FilterBox id="filter" schema={getSchemas().filtroVentas} open={true}>

        <FilterMultiSection id="Articulos" label="Artículo" ApiName={"in_dimarticulo"} ApiSelect={"referencia,descripcion"} ApiKey={"referencia"} ApiKeyValue={"descripcion"} ApiFilterKey={"d_referencia"} fullWidth />

        <FilterMultiSection id="Clientes" label="Cliente" ApiName={"in_dimcliente"} ApiSelect={"codcliente,nombre"} ApiKey={"codcliente"} ApiKeyValue={"nombre"} ApiFilterKey={"d_codcliente"} fullWidth />

        <FilterMultiSection id="Familias" label="Familia" ApiName={"in_dimfamilia"} ApiSelect={"codfamilia,descripcion"} ApiKey={"codfamilia"} ApiKeyValue={"descripcion"} ApiFilterKey={"in_dimfamilia_codfamilia"} fullWidth />

      </FilterBox>
    </Quimera.Template>
  );
}

export default VentasFiltros;
