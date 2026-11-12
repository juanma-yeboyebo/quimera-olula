import { Criteria, Filtro } from "@olula/lib/diseño.ts";
import { criteriaDefecto, MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import {
    CambioOrdenLinea,
    CambiosLineaListaRegalos,
    CambiosListaRegalos,
    EdicionLineaListaRegalos,
    EdicionListaRegalos,
    FiltrosListaRegalos,
    ItemListaRegalos,
    LineaListaRegalos,
    ListaRegalos,
    NuevaLineaListaRegalos,
    NuevaListaRegalos,
} from "./diseño.ts";

export const TEXTO_AYUDA_PRECIO = "Si lo dejas vacío se usa el precio de la tarifa del cliente";
export const MOTIVO_LINEA_CON_VENTAS = "Tiene unidades vendidas";
export const AVISO_NO_PUBLICADA = "La lista no está publicada: el enlace no funcionará hasta que la publiques";

export const ordenListasDefecto = ["creada", "DESC"];

export const criteriaListasDefecto: Criteria = { ...criteriaDefecto, orden: ordenListasDefecto };

export const listaRegalosVacia = (): ListaRegalos => ({
    id: "",
    websiteId: 0,
    cliente: { codigo: "", nombre: "" },
    nombre: "",
    descripcion: "",
    token: "",
    url: null,
    publicada: false,
    creada: "",
    lineas: [],
});

export const filtrosListaRegalosIniciales: FiltrosListaRegalos = {
    websiteId: null,
    texto: "",
};

export const filtroListas = (f: FiltrosListaRegalos): Filtro => {
    const filtro: Filtro[] = [];
    if (f.websiteId !== null) filtro.push(["website_id", "=", String(f.websiteId)]);
    const texto = f.texto.trim();
    if (texto !== "") {
        filtro.push({ or: [["nombre", "~", texto], ["cliente_nombre", "~", texto]] });
    }
    return { and: filtro };
};

export const criteriaListas = (f: FiltrosListaRegalos, criteria: Criteria): Criteria => ({
    filtro: filtroListas(f),
    orden: criteria.orden,
    paginacion: criteria.paginacion,
});

export const distintivoPublicacion = (publicada: boolean): string =>
    publicada ? "Publicada" : "Sin publicar";

export const textoVendidas = (item: Pick<ItemListaRegalos, "vendidas" | "unidades">): string =>
    `${item.vendidas} de ${item.unidades} vendidas`;

export const itemDeLista = (l: ListaRegalos): ItemListaRegalos => ({
    id: l.id,
    websiteId: l.websiteId,
    cliente: l.cliente,
    nombre: l.nombre,
    publicada: l.publicada,
    creada: l.creada,
    lineas: l.lineas.length,
    unidades: l.lineas.reduce((suma, linea) => suma + linea.cantidad, 0),
    vendidas: l.lineas.reduce((suma, linea) => suma + linea.cantidadVendida, 0),
});

export const comoBooleano = (valor: unknown): boolean =>
    valor === true || valor === "true" || valor === "1";

export const nuevaListaRegalosVacia = (): NuevaListaRegalos => ({
    clienteId: "",
    clienteNombre: "",
    nombre: "",
    descripcion: "",
});

export const metaNuevaListaRegalos: MetaModelo<NuevaListaRegalos> = {
    campos: {
        clienteId: { requerido: true },
        nombre: { requerido: true, validacion: (m) => stringNoVacio(m.nombre.trim()) },
        descripcion: { requerido: false },
    },
};

export const edicionDeLista = (l: ListaRegalos): EdicionListaRegalos => ({
    clienteId: l.cliente.codigo,
    clienteNombre: l.cliente.nombre,
    nombre: l.nombre,
    descripcion: l.descripcion,
    publicada: l.publicada,
});

export const metaEdicionListaRegalos: MetaModelo<EdicionListaRegalos> = {
    campos: {
        clienteId: { requerido: true },
        nombre: { requerido: true, validacion: (m) => stringNoVacio(m.nombre.trim()) },
        descripcion: { requerido: false },
        publicada: { tipo: "checkbox" },
    },
};

export const cambiosDeEdicion = (l: ListaRegalos, e: EdicionListaRegalos): CambiosListaRegalos => {
    const cambios: CambiosListaRegalos = {};
    const publicada = comoBooleano(e.publicada);
    if (e.clienteId !== l.cliente.codigo) cambios.clienteId = e.clienteId;
    if (e.nombre.trim() !== l.nombre) cambios.nombre = e.nombre.trim();
    if ((e.descripcion ?? "") !== l.descripcion) cambios.descripcion = e.descripcion ?? "";
    if (publicada !== l.publicada) cambios.publicada = publicada;
    return cambios;
};

export const hayCambios = (cambios: CambiosListaRegalos): boolean => Object.keys(cambios).length > 0;

export const nuevaLineaListaRegalosVacia = (): NuevaLineaListaRegalos => ({
    referencia: "",
    descripcion: "",
    cantidad: 1,
    precio: null,
});

export const metaNuevaLineaListaRegalos: MetaModelo<NuevaLineaListaRegalos> = {
    campos: {
        referencia: { requerido: true },
        cantidad: { requerido: true, tipo: "decimal", validacion: (m) => (m.cantidad ?? 0) > 0 || "Debe ser mayor que 0" },
        precio: { requerido: false, tipo: "decimal", positivo: true },
    },
};

export const edicionDeLinea = (l: LineaListaRegalos): EdicionLineaListaRegalos => ({
    precio: l.precio,
    cantidad: l.cantidad,
    cantidadVendida: l.cantidadVendida,
});

export const metaEdicionLineaListaRegalos: MetaModelo<EdicionLineaListaRegalos> = {
    campos: {
        precio: { requerido: true, tipo: "decimal", positivo: true },
        cantidad: { requerido: true, tipo: "decimal", validacion: (m) => (m.cantidad ?? 0) > 0 || "Debe ser mayor que 0" },
        cantidadVendida: { requerido: true, tipo: "decimal", positivo: true },
    },
};

export const cambiosDeLinea = (e: EdicionLineaListaRegalos): CambiosLineaListaRegalos => ({
    precio: e.precio ?? undefined,
    cantidad: e.cantidad ?? undefined,
    cantidadVendida: e.cantidadVendida ?? undefined,
});

export const lineaVendida = (l: LineaListaRegalos): boolean => l.pendiente <= 0;

export const motivoNoBorrableLinea = (l: LineaListaRegalos): string | null =>
    l.cantidadVendida > 0 ? MOTIVO_LINEA_CON_VENTAS : null;

export const intercambioOrden = (
    lineas: LineaListaRegalos[],
    id: string,
    delta: -1 | 1,
): [CambioOrdenLinea, CambioOrdenLinea] | null => {
    const indice = lineas.findIndex((l) => l.id === id);
    const vecino = indice + delta;
    if (indice < 0 || vecino < 0 || vecino >= lineas.length) return null;
    const linea = lineas[indice];
    const otra = lineas[vecino];
    return [
        { id: linea.id, orden: otra.orden },
        { id: otra.id, orden: linea.orden },
    ];
};

export const mensajeError400 = (error: unknown): string | null => {
    const e = error as { estado?: number; descripcion?: unknown; nombre?: string } | null;
    if (!e || e.estado !== 400) return null;
    return typeof e.descripcion === "string" && e.descripcion !== ""
        ? e.descripcion
        : e.nombre ?? "Datos no válidos";
};
