import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { ChangeEvent, DragEvent, useContext, useRef, useState } from "react";
import { ArticuloWebDetalle, LadoSoltarFoto } from "../diseño.ts";
import {
    errorFotosNoSubidas,
    fotosEnOrden,
    idsTrasMoverFoto,
    idsTrasSoltarFoto,
    ladoDeSoltado,
    textoProgresoSubida,
    TIPOS_FOTO,
} from "../dominio.ts";
import { subirFotos } from "./detalle.ts";
import "./TabFotos.css";

type Objetivo = { id: number; lado: LadoSoltarFoto } | null;

const ladoDelEvento = (e: DragEvent<HTMLElement>): LadoSoltarFoto => {
    const caja = e.currentTarget.getBoundingClientRect();
    return ladoDeSoltado(e.clientX - caja.left, caja.width);
};

export const TabFotos = ({ articulo, publicar }: { articulo: ArticuloWebDetalle; publicar: EmitirEvento }) => {
    const { setError } = useContext(ContextoError);
    const selector = useRef<HTMLInputElement>(null);
    const [progreso, setProgreso] = useState<{ actual: number; total: number } | null>(null);
    const [arrastrando, setArrastrando] = useState<number | null>(null);
    const [objetivo, setObjetivo] = useState<Objetivo>(null);
    const imagenes = fotosEnOrden(articulo.imagenes);

    const alElegir = async (evento: ChangeEvent<HTMLInputElement>) => {
        const ficheros = Array.from(evento.target.files ?? []);
        evento.target.value = "";
        if (ficheros.length === 0) return;

        const total = ficheros.length;
        const fallidas = await subirFotos(articulo.referencia, ficheros, (actual) =>
            setProgreso({ actual, total }),
        );
        setProgreso(null);
        await publicar("fotos_subidas");
        if (fallidas.length > 0) setError(errorFotosNoSubidas(fallidas));
    };

    const ordenar = (ids: number[] | null) => {
        if (ids) publicar("fotos_ordenadas", ids);
    };

    const terminarArrastre = () => {
        setArrastrando(null);
        setObjetivo(null);
    };

    return (
        <div className="TabFotos">
            <div className="maestro-botones">
                <QBoton onClick={() => selector.current?.click()} deshabilitado={progreso !== null}>
                    Subir fotos
                </QBoton>
                {progreso && (
                    <span className="TabFotos-aviso" role="status">
                        {textoProgresoSubida(progreso.actual, progreso.total)}
                    </span>
                )}
                <input
                    ref={selector}
                    type="file"
                    accept={TIPOS_FOTO}
                    multiple
                    hidden
                    onChange={alElegir}
                />
            </div>
            <div className="TabFotos-rejilla">
                {imagenes.map((imagen, indice) => (
                    <figure
                        key={imagen.id}
                        className={[
                            "TabFotos-foto",
                            arrastrando === imagen.id ? "arrastrando" : "",
                            objetivo?.id === imagen.id ? `objetivo-${objetivo.lado}` : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                        data-principal={imagen.principal}
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", String(imagen.id));
                            e.dataTransfer.effectAllowed = "move";
                            setArrastrando(imagen.id);
                        }}
                        onDragEnd={terminarArrastre}
                        onDragOver={(e) => {
                            if (arrastrando === null || arrastrando === imagen.id) return;
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                            const lado = ladoDelEvento(e);
                            if (objetivo?.id !== imagen.id || objetivo.lado !== lado) {
                                setObjetivo({ id: imagen.id, lado });
                            }
                        }}
                        onDragLeave={() => {
                            if (objetivo?.id === imagen.id) setObjetivo(null);
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            const origen = Number(e.dataTransfer.getData("text/plain")) || arrastrando;
                            const lado = ladoDelEvento(e);
                            terminarArrastre();
                            if (origen) ordenar(idsTrasSoltarFoto(articulo.imagenes, origen, imagen.id, lado));
                        }}
                    >
                        <img src={imagen.url} alt={imagen.alt} loading="lazy" draggable={false} />
                        {imagen.principal && <figcaption>Principal</figcaption>}
                        <div className="TabFotos-acciones">
                            <QBoton
                                tamaño="pequeño"
                                variante="texto"
                                deshabilitado={indice === 0}
                                onClick={() => ordenar(idsTrasMoverFoto(articulo.imagenes, imagen.id, -1))}
                            >
                                ←
                            </QBoton>
                            <QBoton
                                tamaño="pequeño"
                                variante="texto"
                                deshabilitado={indice === imagenes.length - 1}
                                onClick={() => ordenar(idsTrasMoverFoto(articulo.imagenes, imagen.id, 1))}
                            >
                                →
                            </QBoton>
                            {!imagen.principal && (
                                <QBoton
                                    tamaño="pequeño"
                                    variante="texto"
                                    onClick={() => publicar("foto_principal_solicitada", imagen)}
                                >
                                    Marcar como principal
                                </QBoton>
                            )}
                            <QBoton
                                tamaño="pequeño"
                                variante="texto"
                                onClick={() => publicar("borrar_foto_solicitado", imagen)}
                            >
                                Borrar
                            </QBoton>
                        </div>
                    </figure>
                ))}
            </div>
            {imagenes.length === 0 && <p>Este artículo no tiene fotos.</p>}
        </div>
    );
};
