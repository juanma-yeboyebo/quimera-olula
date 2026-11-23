import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useNavigate } from "react-router";
import { FacturaGenerada } from "../diseño.ts";

export const ResultadoFacturado = ({
    publicar,
    creadas,
    fallidos,
}: {
    publicar: EmitirEvento;
    creadas: FacturaGenerada[];
    fallidos: string[];
}) => {
    const navigate = useNavigate();

    const cerrar = () => publicar("resultado_facturado_cerrado");

    return (
        <QModal
            nombre="resultadoFacturado"
            abierto={true}
            titulo="Resultado de la facturación"
            onCerrar={cerrar}
        >
            <div className="mensaje">
                {creadas.length === 0
                    ? "No se ha generado ninguna factura."
                    : creadas.length === 1
                        ? "Se ha generado 1 factura."
                        : `Se han generado ${creadas.length} facturas.`}
            </div>
            {creadas.length > 0 && (
                <ul>
                    {creadas.map((factura) => (
                        <li key={factura.id}>
                            <QBoton
                                variante="texto"
                                onClick={() => navigate(`/ventas/factura?id=${factura.id}`)}
                            >
                                {`${factura.etiqueta} — Ir a la factura ${factura.codigo}`}
                            </QBoton>
                        </li>
                    ))}
                </ul>
            )}
            {fallidos.length > 0 && (
                <>
                    <div className="mensaje">No se han podido facturar:</div>
                    <ul>
                        {fallidos.map((fallo, indice) => (
                            <li key={indice}>{fallo}</li>
                        ))}
                    </ul>
                </>
            )}
            <div className="botones">
                <QBoton onClick={cerrar}>Aceptar</QBoton>
            </div>
        </QModal>
    );
};
