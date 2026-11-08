import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useEffect, useMemo, useState } from "react";
import { NodoCategoria } from "../../categoria/diseño.ts";
import { aplanarArbol } from "../../categoria/dominio.ts";
import { ArticuloWebDetalle } from "../diseño.ts";
import { idsCategoriasDeArticulo, idsCategoriasEnOrden, mismasCategorias } from "../dominio.ts";
import { patchCategoriasArticulo } from "../infraestructura.ts";
import "./TabCategorias.css";

export const TabCategorias = ({
    articulo,
    arbol,
    publicar,
}: {
    articulo: ArticuloWebDetalle;
    arbol: NodoCategoria[];
    publicar: EmitirEvento;
}) => {
    const actuales = useMemo(() => idsCategoriasDeArticulo(articulo), [articulo]);
    const [marcadas, setMarcadas] = useState<Set<string>>(new Set(actuales));
    const plano = useMemo(() => aplanarArbol(arbol), [arbol]);

    useEffect(() => {
        setMarcadas(new Set(actuales));
    }, [actuales]);

    const alternar = (id: string, marcada: boolean) =>
        setMarcadas((prev) => {
            const siguiente = new Set(prev);
            if (marcada) siguiente.add(id);
            else siguiente.delete(id);
            return siguiente;
        });

    const ids = idsCategoriasEnOrden(arbol, marcadas);

    const guardar = async () => {
        await patchCategoriasArticulo(articulo.referencia, ids);
        await publicar("categorias_guardadas");
    };

    return (
        <div className="TabCategorias">
            {plano.map(({ nodo, profundidad }) => (
                <div
                    key={nodo.id}
                    className="TabCategorias-fila"
                    style={{ paddingLeft: `${profundidad * 20}px` }}
                >
                    <QCheckbox
                        label={nodo.nombre}
                        nombre={`categoria-${nodo.id}`}
                        valor={marcadas.has(nodo.id)}
                        onChange={(valor) => alternar(nodo.id, valor === "true")}
                    />
                </div>
            ))}
            <div className="botones maestro-botones">
                <QBoton onClick={guardar} deshabilitado={mismasCategorias(ids, actuales)}>
                    Guardar
                </QBoton>
            </div>
        </div>
    );
};
