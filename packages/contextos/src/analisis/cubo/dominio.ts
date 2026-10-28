import { ColumnaMultinivel, FilaMultinivel } from "@olula/componentes/atomos/qtablamultinivel.tsx";
import {
    Arbol,
    CodigoMiembro,
    Cubo,
    FilaPivot,
    FormatoMedida,
    Medida,
    Miembro,
    Nodo,
    OrdenPivot,
    PeticionPivot,
    POR_ETIQUETA,
    ValoresMedidas,
} from "./diseño.ts";

const TOTAL = "Total";

export const claveRuta = (ruta: Miembro[]) => JSON.stringify(ruta.map((m) => m.codigo));

const ruta = (miembros: (Miembro | null)[]): Miembro[] => {
    const hasta = miembros.indexOf(null);
    return (hasta < 0 ? miembros : miembros.slice(0, hasta)) as Miembro[];
};

export const peticionNodo = (peticion: PeticionPivot, nodo: Miembro[]): PeticionPivot => {
    if (peticion.filas.length === 0) return peticion;
    const filas = peticion.filas.slice(0, nodo.length + 1);
    const filtros = Object.fromEntries(nodo.map((miembro, i) => [filas[i], [miembro.codigo]]));
    return { ...peticion, filas, filtros: { ...peticion.filtros, ...filtros } };
};

const compararCodigos = (a: CodigoMiembro, b: CodigoMiembro) => {
    if (a === b) return 0;
    if (a === null) return 1;
    if (b === null) return -1;
    if (typeof a === "number" && typeof b === "number") return a - b;
    return String(a).localeCompare(String(b), "es", { numeric: true });
};

const compararRutas = (a: Miembro[], b: Miembro[]): number => {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        const comparacion = compararCodigos(a[i].codigo, b[i].codigo);
        if (comparacion !== 0) return comparacion;
    }
    return a.length - b.length;
};

const unirColumnas = (columnas: Miembro[][], nuevas: Miembro[][]) => {
    const claves = new Set(columnas.map(claveRuta));
    return [...columnas, ...nuevas.filter((c) => !claves.has(claveRuta(c)))].sort(compararRutas);
};

const nodosDeProfundidad = (filas: FilaPivot[], profundidad: number) => {
    const nodos = new Map<string, Nodo>();
    const columnas = new Map<string, Miembro[]>();
    filas.forEach((fila) => {
        const columna = ruta(fila.columnas);
        columnas.set(claveRuta(columna), columna);
        const camino = ruta(fila.filas);
        if (camino.length !== profundidad) return;
        const clave = claveRuta(camino);
        const nodo = nodos.get(clave) ?? { ruta: camino, valores: {}, hijos: null, expandido: false };
        nodo.valores[claveRuta(columna)] = fila.medidas;
        nodos.set(clave, nodo);
    });
    return { nodos: [...nodos.values()], columnas: [...columnas.values()] };
};

export const arbolDesdePivot = (filas: FilaPivot[]): Arbol => {
    const { nodos: [total], columnas } = nodosDeProfundidad(filas, 0);
    return {
        total: total?.valores ?? {},
        nodos: nodosDeProfundidad(filas, 1).nodos,
        columnas: unirColumnas([], columnas),
    };
};

const esAncestro = (nodo: Nodo, camino: Miembro[]) =>
    camino.length > nodo.ruta.length && claveRuta(camino.slice(0, nodo.ruta.length)) === claveRuta(nodo.ruta);

const cambiarNodo = (nodos: Nodo[], camino: Miembro[], cambio: (nodo: Nodo) => Nodo): Nodo[] =>
    nodos.map((nodo) => {
        if (claveRuta(nodo.ruta) === claveRuta(camino)) return cambio(nodo);
        if (nodo.hijos && esAncestro(nodo, camino)) {
            return { ...nodo, hijos: cambiarNodo(nodo.hijos, camino, cambio) };
        }
        return nodo;
    });

const buscarNodo = (nodos: Nodo[], camino: Miembro[]): Nodo | undefined => {
    const nodo = nodos.find((n) => claveRuta(n.ruta) === claveRuta(camino) || esAncestro(n, camino));
    if (!nodo || nodo.ruta.length === camino.length) return nodo;
    return nodo.hijos ? buscarNodo(nodo.hijos, camino) : undefined;
};

export const expandirNodo = (arbol: Arbol, camino: Miembro[], filas: FilaPivot[]): Arbol => {
    const { nodos, columnas } = nodosDeProfundidad(filas, camino.length + 1);
    return {
        ...arbol,
        nodos: cambiarNodo(arbol.nodos, camino, (nodo) => ({ ...nodo, hijos: nodos, expandido: true })),
        columnas: unirColumnas(arbol.columnas, columnas),
    };
};

export const alternarNodo = (arbol: Arbol, camino: Miembro[]): Arbol => ({
    ...arbol,
    nodos: cambiarNodo(arbol.nodos, camino, (nodo) => ({ ...nodo, expandido: !nodo.expandido })),
});

export const necesitaCargar = (arbol: Arbol, camino: Miembro[]) =>
    (buscarNodo(arbol.nodos, camino)?.hijos ?? null) === null;

const tipoColumna = (formato: FormatoMedida): Pick<ColumnaMultinivel, "tipo" | "decimales"> => {
    if (formato === "moneda") return { tipo: "moneda" };
    return { tipo: "numero", decimales: formato === "unidades" ? 0 : 2 };
};

export const columnasTabla = (
    columnas: Miembro[][],
    medidas: Medida[],
    nivelesColumna: number,
    medidasEnColumnas: boolean
): ColumnaMultinivel[] =>
    columnas.flatMap((columna) => {
        const etiquetas = columna.map((m) => m.etiqueta);
        const hoja = columna.length === nivelesColumna;
        if (!medidasEnColumnas) {
            return [{
                id: claveRuta(columna),
                cabecera: hoja && columna.length > 0 ? etiquetas[etiquetas.length - 1] : TOTAL,
                grupo: hoja && columna.length > 0 ? etiquetas.slice(0, -1) : etiquetas,
            }];
        }
        const grupo = hoja ? etiquetas : [...etiquetas, TOTAL];
        return medidas.map((medida) => ({
            id: `${claveRuta(columna)}|${medida.id}`,
            cabecera: medida.descripcion,
            grupo,
            ...tipoColumna(medida.formato),
        }));
    });

const valoresEnColumnas = (valores: Record<string, ValoresMedidas>, medidas: Medida[]) =>
    Object.fromEntries(
        Object.entries(valores).flatMap(([columna, medidasColumna]) =>
            medidas.map((medida) => [`${columna}|${medida.id}`, medidasColumna[medida.id] ?? null])
        )
    );

const valoresDeMedida = (valores: Record<string, ValoresMedidas>, medida: Medida) =>
    Object.fromEntries(Object.entries(valores).map(([columna, m]) => [columna, m[medida.id] ?? null]));

const filasDeValores = (
    base: Omit<FilaMultinivel, "valores">,
    valores: Record<string, ValoresMedidas>,
    medidas: Medida[],
    medidasEnColumnas: boolean
): FilaMultinivel[] =>
    medidasEnColumnas
        ? [{ ...base, valores: valoresEnColumnas(valores, medidas) }]
        : [
            { ...base, valores: {} },
            ...medidas.map((medida) => ({
                id: `${base.id}|${medida.id}`,
                etiqueta: medida.descripcion,
                nivel: base.nivel + 1,
                valores: valoresDeMedida(valores, medida),
            })),
        ];

export const filasTabla = (
    arbol: Arbol,
    medidas: Medida[],
    nivelesFila: number,
    medidasEnColumnas: boolean
): FilaMultinivel[] => {
    const filasNodo = (nodo: Nodo): FilaMultinivel[] => {
        const expandida = nodo.expandido && nodo.hijos !== null;
        const base = {
            id: claveRuta(nodo.ruta),
            etiqueta: nodo.ruta[nodo.ruta.length - 1].etiqueta,
            nivel: nodo.ruta.length - 1,
            expandible: nodo.ruta.length < nivelesFila,
            expandida,
            destacada: expandida,
        };
        return [
            ...filasDeValores(base, nodo.valores, medidas, medidasEnColumnas),
            ...(expandida ? (nodo.hijos ?? []).flatMap(filasNodo) : []),
        ];
    };

    const total = { id: "total", etiqueta: TOTAL, nivel: 0, expandible: false, expandida: false, destacada: true };
    return [...arbol.nodos.flatMap(filasNodo), ...filasDeValores(total, arbol.total, medidas, medidasEnColumnas)];
};

export const ordenTrasPulsar = (orden: OrdenPivot | null, por: string): OrdenPivot =>
    orden?.por === por
        ? { por, sentido: orden.sentido === "desc" ? "asc" : "desc" }
        : { por, sentido: "desc" };

export type Eje = "filas" | "columnas";

export const peticionInicial = (cubo: Cubo): PeticionPivot => ({
    filas: [],
    columnas: [],
    medidas: cubo.medidas.slice(0, 1).map((m) => m.id),
    filtros: {},
    orden: null,
    top: null,
    excluirCeros: false,
});

export const moverNivel = (peticion: PeticionPivot, ref: string, destino: Eje | null, antesDe?: string): PeticionPivot => {
    const quitar = (refs: string[]) => refs.filter((r) => r !== ref);
    const insertar = (refs: string[]) => {
        const i = antesDe ? refs.indexOf(antesDe) : -1;
        return i < 0 ? [...refs, ref] : [...refs.slice(0, i), ref, ...refs.slice(i)];
    };
    const filas = quitar(peticion.filas);
    const columnas = quitar(peticion.columnas);
    return {
        ...peticion,
        filas: destino === "filas" ? insertar(filas) : filas,
        columnas: destino === "columnas" ? insertar(columnas) : columnas,
    };
};

export const alternarMedida = (peticion: PeticionPivot, id: string, medidas: Medida[]): PeticionPivot => {
    const elegidas = peticion.medidas.includes(id)
        ? peticion.medidas.filter((m) => m !== id)
        : [...peticion.medidas, id];
    if (elegidas.length === 0) return peticion;
    return {
        ...peticion,
        medidas: medidas.map((m) => m.id).filter((m) => elegidas.includes(m)),
        orden: peticion.orden && !elegidas.includes(peticion.orden.por) && peticion.orden.por !== POR_ETIQUETA
            ? null
            : peticion.orden,
    };
};

export const cambiarFiltro = (peticion: PeticionPivot, nivel: string, codigos: CodigoMiembro[]): PeticionPivot => {
    const resto = Object.fromEntries(Object.entries(peticion.filtros).filter(([n]) => n !== nivel));
    return { ...peticion, filtros: codigos.length > 0 ? { ...resto, [nivel]: codigos } : resto };
};

export const medidaDeColumna = (columnaId: string): string | null => {
    const i = columnaId.lastIndexOf("|");
    return i < 0 || !columnaId.endsWith("]", i) ? null : columnaId.slice(i + 1);
};

export const nivelesCubo = (cubo: Cubo) => cubo.dimensiones.flatMap((d) => d.niveles);

export const nombreExportacion = (cuboId: string, fecha: Date) => {
    const dos = (n: number) => String(n).padStart(2, "0");
    return `${cuboId}-${fecha.getFullYear()}${dos(fecha.getMonth() + 1)}${dos(fecha.getDate())}.xlsx`;
};
