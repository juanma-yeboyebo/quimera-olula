import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { rutaBusqueda } from "../dominio.ts";
import "./buscador_tienda.css";

export const BuscadorTienda = () => {
    const navegar = useNavigate();
    const { pathname } = useLocation();
    const [params] = useSearchParams();
    const enCatalogo = pathname.startsWith("/catalogo") || pathname.startsWith("/categoria");
    const textoUrl = enCatalogo ? (params.get("texto") ?? "") : "";
    const [texto, setTexto] = useState(textoUrl);

    useEffect(() => {
        setTexto(textoUrl);
    }, [textoUrl]);

    const enviar = (e: FormEvent) => {
        e.preventDefault();
        navegar(rutaBusqueda(texto));
    };

    return (
        <form className="buscador-tienda" role="search" onSubmit={enviar}>
            <QIcono nombre="buscar" tamaño="sm" />
            <input
                type="search"
                value={texto}
                placeholder="Buscar productos"
                aria-label="Buscar productos"
                onChange={(e) => setTexto(e.target.value)}
            />
        </form>
    );
};
