export type EstadoCarrito =
    | "ABIERTO"
    | "PAGO_PENDIENTE"
    | "PAGADO"
    | "CONFIRMADO"
    | "CONVERTIDO"
    | "ERROR_CONVERSION";

export interface WebsiteTienda {
    id: number;
    codigo: string;
    nombre: string;
    divisa: string;
}

export type TipoFormaPago = "PASARELA" | "SIN_PASARELA";

export type TipoFormaEnvio = "DOMICILIO" | "RECOGIDA";

export interface FormaTienda<Tipo extends string> {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    tipo: Tipo;
}

export type FormaPagoTienda = FormaTienda<TipoFormaPago>;

export type FormaEnvioTienda = FormaTienda<TipoFormaEnvio>;

export interface StoreView {
    codigo: string;
    nombre: string;
    idioma: string;
    urlBase: string;
    website: WebsiteTienda;
    formasPago: FormaPagoTienda[];
    formasEnvio: FormaEnvioTienda[];
}

export interface FormaCarritoTienda<Tipo extends string> {
    id: number;
    nombre: string;
    tipo: Tipo;
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
    formaPago?: FormaCarritoTienda<TipoFormaPago> | null;
    formaEnvio?: FormaCarritoTienda<TipoFormaEnvio> | null;
    formasPagoDisponibles?: FormaPagoTienda[];
    formasEnvioDisponibles?: FormaEnvioTienda[];
}
