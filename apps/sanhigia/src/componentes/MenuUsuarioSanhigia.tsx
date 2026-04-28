import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import "./MenuUsuarioSanhigia.css";

/**
 * Menú de usuario personalizado para Sanhigia
 * Opción más rica que solo un icono
 */
export const MenuUsuarioSanhigia = () => {
  return (
    <div className="menu-usuario-sanhigia">
      <QIcono nombre="perfil" tamaño="sm" />
      <span className="usuario-label"></span>
    </div>
  );
};
