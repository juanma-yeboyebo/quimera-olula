export type EstadoCarrito =
    | "ABIERTO"
    | "PAGO_PENDIENTE"
    | "PAGADO"
    | "CONVERTIDO"
    | "ERROR_CONVERSION";

export interface WebsiteTienda {
    id: number;
    codigo: string;
    nombre: string;
    divisa: string;
}

export interface StoreView {
    codigo: string;
    nombre: string;
    idioma: string;
    urlBase: string;
    website: WebsiteTienda;
}

export interface ImagenLineaCarrito {
    url: string;
    alt: string;
}

export interface LineaCarritoTienda {
    id: number;
    referencia: string;
    slug: string;
    descripcion: string;
    imagen: ImagenLineaCarrito | null;
    cantidad: number;
    precio: number;
    dtoPorcentual: number;
    tipoIva: number;
    ivaIncluido: boolean;
    importe: number;
}

export interface CarritoTienda {
    token: string;
    estado: EstadoCarrito;
    divisa: string;
    neto: number;
    totalIva: number;
    total: number;
    unidades: number;
    datosCheckout: Record<string, unknown> | null;
    lineas: LineaCarritoTienda[];
    documento: Record<string, unknown> | null;
}
