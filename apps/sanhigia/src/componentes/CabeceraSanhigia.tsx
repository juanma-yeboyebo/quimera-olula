import {
  CabeceraBase,
  CabeceraProps,
} from "@olula/componentes/plantilla/Cabecera.tsx";
import "./CabeceraSanhigia.css";

/**
 * Cabecera personalizada para Sanhigia
 * - Logo diferente (Sanhigia)
 * - Acción navegación a Dashboard SmartSales
 * - Estructuración específica de la app
 */
export const CabeceraSanhigia = (props: CabeceraProps) => {
  return (
    <CabeceraBase
      //   logoSrc="/smartsales-logo.png"
      logoSrc="/logo.png"
      logoAlt="Sanhigia"
      {...props}
    />
  );
};
