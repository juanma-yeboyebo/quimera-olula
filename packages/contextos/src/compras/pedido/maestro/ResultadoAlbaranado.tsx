import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useNavigate } from "react-router";
import { ResultadoAlbaranar } from "./diseño.ts";

export const ResultadoAlbaranado = ({
    resultado,
    publicar,
}: {
    resultado: ResultadoAlbaranar;
    publicar: EmitirEvento;
}) => {
    const navigate = useNavigate();

    const cerrar = () => publicar("resultado_albaranado_cerrado");

    const { creados, fallidos } = resultado;

    return (
        <QModal
            nombre="resultadoAlbaranadoCompra"
            abierto={true}
            titulo="Resultado del albaranado"
            onCerrar={cerrar}
        >
            <div className="mensaje">
                {creados.length === 0
                    ? "No se ha generado ningún albarán."
                    : creados.length === 1
                        ? "Se ha generado 1 albarán."
                        : `Se han generado ${creados.length} albaranes.`}
            </div>
            {creados.length > 0 && (
                <ul>
                    {creados.map((albaran) => (
                        <li key={albaran.id}>
                            <QBoton
                                variante="texto"
                                onClick={() => navigate(`/compras/albaran?id=${albaran.id}`)}
                            >
                                {`${albaran.etiqueta} — Ir al albarán ${albaran.codigo}`}
                            </QBoton>
                        </li>
                    ))}
                </ul>
            )}
            {fallidos.length > 0 && (
                <>
                    <div className="mensaje">No se han podido albaranar:</div>
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
