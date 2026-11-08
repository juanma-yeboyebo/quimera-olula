import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { useState } from "react";
import { NodoCategoria, PosicionSoltar } from "../diseño.ts";
import { distintivosCategoria, posicionEnHermanas, zonaDeSoltado } from "../dominio.ts";
import { PayloadSoltado } from "./diseño.ts";
import "./ArbolCategorias.css";

type PropsArbol = {
    arbol: NodoCategoria[];
    activa: string | undefined;
    onSeleccion: (id: string) => void;
    onSubir: (id: string) => void;
    onBajar: (id: string) => void;
    onMover: (id: string) => void;
    onSoltar: (payload: PayloadSoltado) => void;
};

type Objetivo = { id: string; posicion: PosicionSoltar } | null;

export const ArbolCategorias = ({
    arbol,
    activa,
    onSeleccion,
    onSubir,
    onBajar,
    onMover,
    onSoltar,
}: PropsArbol) => {
    const [colapsados, setColapsados] = useState<Set<string>>(new Set());
    const [arrastrando, setArrastrando] = useState<string | null>(null);
    const [objetivo, setObjetivo] = useState<Objetivo>(null);

    const alternar = (id: string) =>
        setColapsados((prev) => {
            const siguiente = new Set(prev);
            if (!siguiente.delete(id)) siguiente.add(id);
            return siguiente;
        });

    const terminarArrastre = () => {
        setArrastrando(null);
        setObjetivo(null);
    };

    const renderNodo = (nodo: NodoCategoria) => {
        const { indice, total } = posicionEnHermanas(arbol, nodo.id);
        const plegado = colapsados.has(nodo.id);
        const tieneHijas = nodo.hijas.length > 0;
        const clases = [
            "ArbolCategorias-fila",
            nodo.id === activa ? "activa" : "",
            arrastrando === nodo.id ? "arrastrando" : "",
            objetivo?.id === nodo.id ? `objetivo-${objetivo.posicion}` : "",
        ]
            .filter(Boolean)
            .join(" ");

        return (
            <li
                key={nodo.id}
                role="treeitem"
                aria-expanded={tieneHijas ? !plegado : undefined}
                aria-selected={nodo.id === activa}
            >
                <div
                    className={clases}
                    draggable
                    onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", nodo.id);
                        e.dataTransfer.effectAllowed = "move";
                        setArrastrando(nodo.id);
                    }}
                    onDragEnd={terminarArrastre}
                    onDragOver={(e) => {
                        if (arrastrando === null || arrastrando === nodo.id) return;
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                        const caja = e.currentTarget.getBoundingClientRect();
                        const posicion = zonaDeSoltado(e.clientY - caja.top, caja.height);
                        if (objetivo?.id !== nodo.id || objetivo.posicion !== posicion) {
                            setObjetivo({ id: nodo.id, posicion });
                        }
                    }}
                    onDragLeave={() => {
                        if (objetivo?.id === nodo.id) setObjetivo(null);
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        const origenId = e.dataTransfer.getData("text/plain") || arrastrando;
                        const caja = e.currentTarget.getBoundingClientRect();
                        const posicion = zonaDeSoltado(e.clientY - caja.top, caja.height);
                        terminarArrastre();
                        if (origenId) onSoltar({ origenId, destinoId: nodo.id, posicion });
                    }}
                >
                    {tieneHijas ? (
                        <button
                            type="button"
                            className="ArbolCategorias-plegar"
                            aria-label={plegado ? `Desplegar ${nodo.nombre}` : `Plegar ${nodo.nombre}`}
                            onClick={() => alternar(nodo.id)}
                        >
                            {plegado ? "▸" : "▾"}
                        </button>
                    ) : (
                        <span className="ArbolCategorias-plegar" aria-hidden="true" />
                    )}
                    <button
                        type="button"
                        className="ArbolCategorias-nombre"
                        onClick={() => onSeleccion(nodo.id)}
                    >
                        {nodo.nombre}
                    </button>
                    <span className="ArbolCategorias-articulos">{nodo.articulos}</span>
                    {distintivosCategoria(nodo).map((d) => (
                        <span key={d} className="ArbolCategorias-distintivo">
                            {d}
                        </span>
                    ))}
                    <span className="ArbolCategorias-acciones">
                        <QBoton
                            tamaño="pequeño"
                            variante="texto"
                            texto="Subir"
                            deshabilitado={indice <= 0}
                            onClick={() => onSubir(nodo.id)}
                        />
                        <QBoton
                            tamaño="pequeño"
                            variante="texto"
                            texto="Bajar"
                            deshabilitado={indice < 0 || indice >= total - 1}
                            onClick={() => onBajar(nodo.id)}
                        />
                        <QBoton
                            tamaño="pequeño"
                            variante="texto"
                            texto="Mover a…"
                            onClick={() => onMover(nodo.id)}
                        />
                    </span>
                </div>
                {tieneHijas && !plegado && <ul role="group">{nodo.hijas.map(renderNodo)}</ul>}
            </li>
        );
    };

    return (
        <ul className="ArbolCategorias" role="tree" aria-label="Categorías">
            {arbol.map(renderNodo)}
        </ul>
    );
};
