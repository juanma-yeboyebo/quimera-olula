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

export interface StoreViewApi {
    codigo: string;
    nombre: string;
    idioma: string;
    url_base: string;
    website: WebsiteTienda;
}

export interface LineaCarritoApi {
    id: number;
    referencia: string;
    slug: string;
    descripcion: string;
    imagen: ImagenLineaCarrito | null;
    cantidad: number;
    precio: number;
    dto_porcentual: number;
    tipo_iva: number;
    iva_incluido: boolean;
    importe: number;
}

export interface CarritoApi {
    token: string;
    estado: EstadoCarrito;
    divisa: string;
    neto: number;
    total_iva: number;
    total: number;
    unidades: number;
    datos_checkout: Record<string, unknown> | null;
    lineas: LineaCarritoApi[];
    documento: Record<string, unknown> | null;
}
