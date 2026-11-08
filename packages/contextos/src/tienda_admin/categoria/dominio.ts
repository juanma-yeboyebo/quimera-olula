import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import {
    EdicionCategoria,
    NodoCategoria,
    NodoPlano,
    NuevaCategoria,
    OperacionArbol,
    PadreCandidato,
    PosicionSoltar,
} from "./diseño.ts";
import { errorSlug } from "../comun/dominio.ts";

export const nuevaCategoriaVacia: NuevaCategoria = {
    codigo: "",
    nombre: "",
    slug: "",
    visible: true,
    enMenu: true,
};

export const metaNuevaCategoria: MetaModelo<NuevaCategoria> = {
    campos: {
        codigo: { requerido: true, validacion: (m) => stringNoVacio(m.codigo.trim()) },
        nombre: { requerido: true, validacion: (m) => stringNoVacio(m.nombre.trim()) },
        slug: { validacion: (m) => errorSlug(m.slug) ?? true },
        visible: { tipo: "checkbox" },
        enMenu: { tipo: "checkbox" },
    },
    editable: (m, campo) => campo !== "enMenu" || m.visible,
};

export const metaEdicionCategoria: MetaModelo<EdicionCategoria> = {
    campos: {
        nombre: { requerido: true, validacion: (m) => stringNoVacio(m.nombre.trim()) },
        slug: { validacion: (m) => errorSlug(m.slug) ?? true },
        visible: { tipo: "checkbox" },
        enMenu: { tipo: "checkbox" },
    },
};

export const edicionDeCategoria = (n: NodoCategoria): EdicionCategoria => ({
    id: n.id,
    nombre: n.nombre,
    slug: n.slug,
    visible: n.visible,
    enMenu: n.enMenu,
});

export const aplanarArbol = (arbol: NodoCategoria[], profundidad = 0): NodoPlano[] =>
    arbol.flatMap((nodo) => [
        { nodo, profundidad },
        ...aplanarArbol(nodo.hijas, profundidad + 1),
    ]);

export const buscarNodo = (arbol: NodoCategoria[], id: string): NodoCategoria | null =>
    aplanarArbol(arbol).find((p) => p.nodo.id === id)?.nodo ?? null;

export const padreDe = (arbol: NodoCategoria[], id: string): NodoCategoria | null => {
    const nodo = buscarNodo(arbol, id);
    return nodo && nodo.padreId !== null ? buscarNodo(arbol, nodo.padreId) : null;
};

export const hermanasDe = (arbol: NodoCategoria[], id: string): NodoCategoria[] => {
    const nodo = buscarNodo(arbol, id);
    if (!nodo) return [];
    if (nodo.padreId === null) return arbol;
    return buscarNodo(arbol, nodo.padreId)?.hijas ?? [];
};

export const idsDescendientes = (nodo: NodoCategoria): string[] =>
    aplanarArbol(nodo.hijas).map((p) => p.nodo.id);

export const esDescendiente = (arbol: NodoCategoria[], id: string, posibleAncestroId: string): boolean => {
    const ancestro = buscarNodo(arbol, posibleAncestroId);
    return ancestro ? idsDescendientes(ancestro).includes(id) : false;
};

export const posicionEnHermanas = (arbol: NodoCategoria[], id: string): { indice: number; total: number } => {
    const hermanas = hermanasDe(arbol, id);
    return { indice: hermanas.findIndex((h) => h.id === id), total: hermanas.length };
};

const reordenar = (ids: string[], id: string, haciaIndice: number): string[] => {
    const sin = ids.filter((i) => i !== id);
    sin.splice(haciaIndice, 0, id);
    return sin;
};

export const moverEntreHermanas = (
    arbol: NodoCategoria[],
    id: string,
    delta: -1 | 1,
): OperacionArbol | null => {
    const nodo = buscarNodo(arbol, id);
    if (!nodo) return null;
    const ids = hermanasDe(arbol, id).map((h) => h.id);
    const indice = ids.indexOf(id);
    const destino = indice + delta;
    if (destino < 0 || destino >= ids.length) return null;
    return { tipo: "ordenar", padreId: nodo.padreId, ids: reordenar(ids, id, destino) };
};

export const resolverSoltado = (
    arbol: NodoCategoria[],
    origenId: string,
    destinoId: string,
    posicion: PosicionSoltar,
): OperacionArbol | null => {
    if (origenId === destinoId) return null;
    const origen = buscarNodo(arbol, origenId);
    const destino = buscarNodo(arbol, destinoId);
    if (!origen || !destino) return null;

    if (posicion === "dentro") {
        if (origen.padreId === destino.id) return null;
        if (esDescendiente(arbol, destino.id, origen.id)) return null;
        return { tipo: "mover", id: origen.id, padreId: destino.id };
    }

    if (origen.padreId !== destino.padreId) return null;
    const ids = hermanasDe(arbol, origenId).map((h) => h.id);
    const sinOrigen = ids.filter((i) => i !== origenId);
    const indiceDestino = sinOrigen.indexOf(destinoId);
    const nuevo = reordenar(ids, origenId, posicion === "antes" ? indiceDestino : indiceDestino + 1);
    if (nuevo.every((i, k) => i === ids[k])) return null;
    return { tipo: "ordenar", padreId: origen.padreId, ids: nuevo };
};

export const zonaDeSoltado = (desplazamientoY: number, altura: number): PosicionSoltar => {
    if (altura <= 0) return "dentro";
    const fraccion = desplazamientoY / altura;
    if (fraccion < 0.25) return "antes";
    if (fraccion > 0.75) return "despues";
    return "dentro";
};

export const padresPosibles = (arbol: NodoCategoria[], id: string): PadreCandidato[] => {
    const nodo = buscarNodo(arbol, id);
    if (!nodo) return [];
    const excluidos = new Set([id, ...idsDescendientes(nodo)]);
    const candidatos = aplanarArbol(arbol)
        .filter((p) => !excluidos.has(p.nodo.id) && p.nodo.id !== nodo.padreId)
        .map((p) => ({
            valor: p.nodo.id,
            descripcion: `${"  ".repeat(p.profundidad)}${p.nodo.nombre}`,
        }));
    return nodo.padreId === null ? candidatos : [{ valor: "", descripcion: "(Primer nivel)" }, ...candidatos];
};

export const distintivosCategoria = (n: NodoCategoria): string[] => [
    ...(n.visible ? [] : ["Oculta"]),
    ...(n.enMenu ? [] : ["Fuera del menú"]),
];

export const motivoNoBorrable = (n: NodoCategoria): string | null => {
    if (n.hijas.length > 0) return "Tiene subcategorías";
    if (n.articulos > 0) return `Tiene ${n.articulos} ${n.articulos === 1 ? "artículo" : "artículos"}`;
    return null;
};

export const hayCambiosCategoria = (inicial: NodoCategoria, edicion: EdicionCategoria): boolean =>
    inicial.nombre !== edicion.nombre ||
    inicial.slug !== edicion.slug ||
    inicial.visible !== edicion.visible ||
    inicial.enMenu !== edicion.enMenu;
