import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import { cancelarPago } from "./cancelado.ts";
import "./PagoCancelado.css";

const ContenidoCancelado = ({ codigo }: { codigo: string }) => {
    const [resultado, setResultado] = useState<boolean | null>(null);
    const lanzado = useRef(false);

    useEffect(() => {
        if (lanzado.current) return;
        lanzado.current = true;
        cancelarPago(codigo).then(setResultado);
    }, [codigo]);

    if (resultado === null)
        return (
            <div className="PagoCancelado">
                <p role="status">Cancelando el pago…</p>
            </div>
        );

    return (
        <div className="PagoCancelado">
            <p>Has cancelado el pago. Tu carrito sigue disponible.</p>
            {resultado ? (
                <Link to="/carrito">Volver al carrito</Link>
            ) : (
                <Link to="/catalogo">Ir al catálogo</Link>
            )}
        </div>
    );
};

export const PagoCancelado = () => (
    <ConStoreView>{(sv) => <ContenidoCancelado codigo={sv.codigo} />}</ConStoreView>
);
