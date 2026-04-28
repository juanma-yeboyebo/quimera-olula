import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import "./MenuUsuarioCabrera.css";

/**
 * Menú de usuario personalizado para Cabrera
 * Opción más rica que solo un icono
 */
export const MenuUsuarioCabrera = () => {
  return (
    <div className="menu-usuario-cabrera">
      <QIcono nombre="perfil" tamaño="sm" />
      <span className="usuario-label"></span>
    </div>
  );
};
