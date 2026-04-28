import { Link } from "react-router";
import "./ExtraLogoSanhigia.css";

/**
 * Logo adicional para la cabecera de Sanhigia
 * Muestra el logo de SmartSales junto al principal
 */
export const ExtraLogoSanhigia = () => {
  return (
    <Link to="/ss/dashboard" className="extra-logo-sanhigia">
      <img width="200px" src="/smartsales-logo.png" alt="SmartSales logo" />
    </Link>
  );
};
