import { ClausulaFiltro, Criteria } from "@olula/lib/diseño.ts";
import {
    CategoriaTienda,
    FiltrosCatalogo,
    OrdenCatalogo,
    ProductoCatalogo,
} from "./diseño.ts";

export const PRODUCTOS_POR_PAGINA = 24;

export const opcionesOrden: { valor: OrdenCatalogo; descripcion: string }[] = [
    { valor: "relevancia", descripcion: "Relevancia" },
    { valor: "precio_asc", descripcion: "Precio: menor a mayor" },
    { valor: "precio_desc", descripcion: "Precio: mayor a menor" },
    { valor: "nombre", descripcion: "Nombre" },
];

export const filtrosPorDefecto: FiltrosCatalogo = {
    texto: "",
    categoria: null,
    soloDestacados: false,
    orden: "relevancia",
};

const ordenes: Record<OrdenCatalogo, string[]> = {
    relevancia: ["orden", "ASC"],
    precio_asc: ["precio", "ASC"],
    precio_desc: ["precio", "DESC"],
    nombre: ["descripcion", "ASC"],
};

export const criteriaCatalogo = (filtros: FiltrosCatalogo, pagina: number): Criteria => {
    const filtro: ClausulaFiltro[] = [];
    const texto = filtros.texto.trim();
    if (texto) filtro.push(["texto", "~", texto]);
    if (filtros.categoria) filtro.push(["categoria", "=", filtros.categoria]);
    if (filtros.soloDestacados) filtro.push(["destacado", "=", "true"]);
    return {
        filtro,
        orden: ordenes[filtros.orden],
        paginacion: { limite: PRODUCTOS_POR_PAGINA, pagina },
    };
};

const esOrden = (valor: string | null): valor is OrdenCatalogo =>
    valor !== null && valor in ordenes;

export const filtrosDesdeUrl = (
    params: URLSearchParams,
    categoria: string | null,
): FiltrosCatalogo => {
    const orden = params.get("orden");
    return {
        texto: params.get("texto") ?? "",
        categoria,
        soloDestacados: params.get("destacados") === "1",
        orden: esOrden(orden) ? orden : "relevancia",
    };
};

export const filtrosAUrl = (filtros: FiltrosCatalogo): URLSearchParams => {
    const params = new URLSearchParams();
    if (filtros.texto) params.set("texto", filtros.texto);
    if (filtros.orden !== "relevancia") params.set("orden", filtros.orden);
    if (filtros.soloDestacados) params.set("destacados", "1");
    return params;
};

export const añadirPagina = (
    actuales: ProductoCatalogo[],
    nuevos: ProductoCatalogo[],
): ProductoCatalogo[] => {
    const vistas = new Set(actuales.map((p) => p.referencia));
    const añadidos = nuevos.filter((p) => {
        if (vistas.has(p.referencia)) return false;
        vistas.add(p.referencia);
        return true;
    });
    return [...actuales, ...añadidos];
};

export const rutaCategoria = (arbol: CategoriaTienda[], slug: string): CategoriaTienda[] => {
    for (const nodo of arbol) {
        if (nodo.slug === slug) return [nodo];
        const sub = rutaCategoria(nodo.hijas, slug);
        if (sub.length > 0) return [nodo, ...sub];
    }
    return [];
};

export const estaDisponible = (producto: ProductoCatalogo): boolean =>
    producto.disponible || producto.sinControlStock;
