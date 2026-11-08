import { QError } from "@olula/lib/contexto.ts";
import { BotonTienda } from "../componentes/boton_tienda.tsx";
import "./dialogo_error_tienda.css";

export const DialogoErrorTienda = ({
    error,
    onCerrar,
}: {
    error: QError;
    onCerrar: () => void;
}) => (
    <div className="dialogo-error-tienda-fondo">
        <div className="dialogo-error-tienda" role="alertdialog" aria-modal="true" aria-labelledby="dialogo-error-titulo">
            <h2 id="dialogo-error-titulo">{error.nombre}</h2>
            <p>{error.descripcion}</p>
            <BotonTienda onClick={onCerrar}>Cerrar</BotonTienda>
        </div>
    </div>
);
