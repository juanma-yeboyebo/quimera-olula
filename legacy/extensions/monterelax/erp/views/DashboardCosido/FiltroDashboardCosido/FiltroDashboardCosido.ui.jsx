import { DynamicFilter } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React from "react";

function FiltroDashboardCosido({ useStyles }) {
  const [, dispatch] = useStateValue();
  const classes = useStyles();

  return (
    <Quimera.Template id="FiltroDashboardCosido">
      <DynamicFilter
        id="filtroGraficos"
        propiedades={[
          {
            tipoCampo: "date",
            nombreCampo: "fechadatos",
            labelNombre: "Fechas",
            labelChip: "Fechas: ",
            porDefecto: false,
            textoDesde: "desde",
            textoHasta: "hasta",
            value: { desde: null, hasta: null, fecha: null },
            opcionesPredefinidas: [
              { nombre: "", fecha: null, desde: null, hasta: null },
              { nombre: "Esta semana", persistencia: "estasemana" },
              { nombre: "Últimos 15 días", persistencia: "ultimos15dias" },
              { nombre: "Este mes", persistencia: "estemes" },
              { nombre: "Este año", persistencia: "esteanyio" },
            ],
            tipo: "normal",
          },
        ]}
      />
    </Quimera.Template>
  );
}

export default FiltroDashboardCosido;
