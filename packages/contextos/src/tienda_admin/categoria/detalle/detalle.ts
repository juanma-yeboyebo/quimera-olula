import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { EdicionCategoria, NodoCategoria } from "../diseño.ts";
import { hayCambiosCategoria } from "../dominio.ts";
import { patchCategoria } from "../infraestructura.ts";
import { ContextoDetalleCategoria, EstadoDetalleCategoria } from "./diseño.ts";

type ProcesarDetalle = ProcesarContexto<EstadoDetalleCategoria, ContextoDetalleCategoria>;

export const categoriaVacia: NodoCategoria = {
    id: "",
    padreId: null,
    codigo: "",
    nombre: "",
    slug: "",
    orden: 0,
    visible: true,
    enMenu: true,
    articulos: 0,
    hijas: [],
};

export const contextoDetalleCategoriaInicial: ContextoDetalleCategoria = {
    estado: "INICIAL",
    categoria: categoriaVacia,
};

export const cargarCategoria: ProcesarDetalle = async (contexto, payload) => {
    const categoria = payload as NodoCategoria | null | undefined;
    if (!categoria) return { ...contexto, estado: "INICIAL", categoria: categoriaVacia };
    return { ...contexto, estado: "ABIERTO", categoria };
};

export const vaciarCategoria: ProcesarDetalle = async (contexto) => ({
    ...contexto,
    estado: "INICIAL",
    categoria: categoriaVacia,
});

export const guardarCategoria = async (
    contexto: ContextoDetalleCategoria,
    edicion: EdicionCategoria,
): Promise<boolean> => {
    if (!hayCambiosCategoria(contexto.categoria, edicion)) return false;
    await patchCategoria(contexto.categoria.id, {
        nombre: edicion.nombre,
        slug: edicion.slug,
        visible: edicion.visible,
        enMenu: edicion.enMenu,
    });
    return true;
};
