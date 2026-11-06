import { LineaCarritoTienda } from "../../comun/diseño.ts";

export const BorrarLineaCarrito = ({
    linea,
    deshabilitado,
    onBorrar,
}: {
    linea: LineaCarritoTienda;
    deshabilitado: boolean;
    onBorrar: () => void;
}) => (
    <button
        type="button"
        className="linea-borrar"
        aria-label={`Quitar ${linea.descripcion} del carrito`}
        disabled={deshabilitado}
        onClick={onBorrar}
    >
        Quitar
    </button>
);
