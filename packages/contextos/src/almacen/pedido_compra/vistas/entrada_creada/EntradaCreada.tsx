import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useNavigate } from "react-router";

export const EntradaCreada = ({
    publicar,
    idOrden,
}: {
    publicar: EmitirEvento;
    idOrden: string;
}) => {
    const navigate = useNavigate();

    const cerrar = () => publicar("cerrar_confirmacion");

    const verOrden = () => {
        publicar("ver_orden");
        navigate(`/almacen/ordenes?id=${idOrden}`);
    };

    return (
        <QModal
            nombre="entradaCreada"
            abierto={true}
            titulo="Entrada creada"
            onCerrar={cerrar}
        >
            <div className="mensaje">
                La entrada se ha creado correctamente.
            </div>
            <div className="botones">
                <QBoton onClick={verOrden}>
                    Ver orden de entrada
                </QBoton>
                <QBoton variante="texto" onClick={cerrar}>
                    Cerrar
                </QBoton>
            </div>
        </QModal>
    );
};
