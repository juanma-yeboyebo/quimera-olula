import { DynamicFilter } from "@quimera/comps";
import Quimera, { PropValidation, util } from "quimera";
import React from "react";

function CabeceraFiltro({ useStyles }) {
  // const [, dispatch] = useStateValue()
  // const classes = useStyles()
  const filtroProps = [
    {
      tipoCampo: "string",
      nombreCampo: "codigo",
      labelNombre: "Codigo",
      labelChip: "Código contiene ",
      porDefecto: false,
      value: "",
      tipo: "normal",
    },
    {
      tipoCampo: "string",
      nombreCampo: "nombreCliente",
      labelNombre: "Cliente",
      labelChip: "Cliente contiene ",
      porDefecto: true,
      value: "",
      tipo: "normal",
    },
    {
      tipoCampo: "boolean",
      nombreCampo: "firmado",
      labelNombre: "Firmado",
      labelChip: "Firmado: ",
      porDefecto: false,
      value: "",
      textoTrue: "Si",
      textoFalse: "No",
      tipo: "normal",
    },
    {
      tipoCampo: "date",
      nombreCampo: "fecha",
      labelNombre: "Fecha",
      labelChip: "Fecha: ",
      porDefecto: false,
      textoDesde: "desde",
      textoHasta: "hasta",
      value: { desde: null, hasta: null, fecha: null },
      opcionesPredefinidas: [
        { nombre: "", fecha: null, desde: null, hasta: null },
        { nombre: "Hoy", fecha: util.today(), desde: null, hasta: null },
        { nombre: "Esta semana", fecha: null, desde: util.firstOfWeek(), hasta: util.lastOfWeek() },
        { nombre: "Hasta ayer", fecha: null, desde: null, hasta: util.yesterday() },
        { nombre: "Este mes", fecha: null, desde: util.firstOfMonth(), hasta: util.lastOfMonth() },
        { nombre: "Este año", fecha: null, desde: util.firstOfYear(), hasta: util.lastOfYear() },
      ],
      tipo: "normal",
    },
  ];

  return (
    <Quimera.Template id="CabeceraFiltro">
      <DynamicFilter
        id="albaranes.filter"
        propiedades={filtroProps}
        iconFilterProp={"search"}
        textFieldProps={{ label: "", placeholder: "Selecciona un filtro" }}
      />
    </Quimera.Template>
  );
}

export default CabeceraFiltro;
