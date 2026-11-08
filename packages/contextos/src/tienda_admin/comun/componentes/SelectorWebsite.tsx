import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { useEffect, useState } from "react";
import { WebsiteAdmin } from "../diseño.ts";
import { elegirWebsite } from "../dominio.ts";
import { getWebsites } from "../infraestructura.ts";
import { fijarWebsiteActivo, fijarWebsites, obtenerWebsiteActivo, useWebsiteActivo } from "../website_store.ts";
import "./SelectorWebsite.css";

export const SelectorWebsite = () => {
    const [websites, setWebsites] = useState<WebsiteAdmin[]>([]);
    const activo = useWebsiteActivo();

    useEffect(() => {
        let vivo = true;
        getWebsites().then((lista) => {
            if (!vivo) return;
            setWebsites(lista);
            fijarWebsites(lista);
            fijarWebsiteActivo(elegirWebsite(lista, obtenerWebsiteActivo()));
        });
        return () => {
            vivo = false;
        };
    }, []);

    const activos = websites.filter((w) => w.activo);
    if (activos.length === 0) return null;

    if (activos.length === 1) {
        return <div className="SelectorWebsite">{activos[0].nombre}</div>;
    }

    return (
        <div className="SelectorWebsite">
            <QSelect
                label="Website"
                nombre="website"
                valor={activo === null ? "" : String(activo)}
                opciones={activos.map((w) => ({ valor: String(w.id), descripcion: w.nombre }))}
                onChange={(opcion) => fijarWebsiteActivo(opcion ? Number(opcion.valor) : null)}
            />
        </div>
    );
};
