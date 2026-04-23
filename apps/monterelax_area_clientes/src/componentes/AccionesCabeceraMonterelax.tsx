import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { estaAutentificado } from "@olula/componentes/plantilla/autenticacion.ts";
import { Link } from "react-router";
import "./AccionesCabeceraMonterelax.css";

const CARRITO_URL = "/checkout";

export const AccionesCabeceraMonterelax = () => {
  const estaLogueado = estaAutentificado();

  if (!estaLogueado) return null;

  return (
    <Link
      to={CARRITO_URL}
      className="accion-cabecera-carrito"
      aria-label="Ir al carrito"
      title="Carrito"
    >
      <QIcono nombre="carrito" tamaño="sm" />
    </Link>
  );
};
