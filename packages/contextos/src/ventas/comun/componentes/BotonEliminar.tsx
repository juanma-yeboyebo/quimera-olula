import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import "./BotonEliminar.css";

interface BotonEliminarProps {
  titulo: string;
  onClick: () => void;
  deshabilitado?: boolean;
}

export const BotonEliminar = ({
  titulo,
  onClick,
  deshabilitado = false,
}: BotonEliminarProps) => (
  <button
    type="button"
    className="BotonEliminar"
    onClick={onClick}
    disabled={deshabilitado}
    title={titulo}
    aria-label={titulo}
  >
    <QIcono nombre="eliminar" tamaño="sm" />
  </button>
);
