import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { AlbaranGenerado } from "../diseño.ts";

type UrlPorId = (id: string) => string;

export const ResultadoAlbaranado = ({
    publicar,
    creados,
    fallidos,
}: {
    publicar: EmitirEvento;
    creados: AlbaranGenerado[];
    fallidos: string[];
}) => {
    const navigate = useNavigate();
    const { app } = useContext(FactoryCtx);
    const urlAlbaran =
        (app.Ventas?.albaranar_url_albaran as UrlPorId | undefined) ??
        ((id: string) => `/ventas/albaran?id=${id}`);

    const cerrar = () => publicar("resultado_albaranado_cerrado");

    return (
        <QModal
            nombre="resultadoAlbaranado"
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
                                onClick={() => navigate(urlAlbaran(albaran.id))}
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
