export type DireccionRegistro = {
    nombreVia: string;
    numero: string | null;
    codPostal: string;
    ciudad: string;
    provincia: string | null;
    paisId: string;
};

export type DatosRegistro = {
    email: string;
    password: string;
    repetirPassword: string;
    nombre: string;
    idFiscal: string;
    telefono: string | null;
    direccion: DireccionRegistro;
};

export type ErroresRegistro = Record<string, string>;

export type DireccionRegistroApi = {
    nombre_via: string;
    numero: string | null;
    cod_postal: string;
    ciudad: string;
    provincia: string | null;
    pais_id: string;
};

export type RegistroApi = {
    email: string;
    password: string;
    nombre: string;
    id_fiscal: string;
    telefono: string | null;
    direccion: DireccionRegistroApi;
};

export type DireccionCuenta = {
    id: string;
    nombreVia: string;
    numero: string | null;
    codPostal: string;
    ciudad: string;
    provincia: string | null;
    paisId: string;
    envio: boolean;
    facturacion: boolean;
};

export type CuentaTienda = {
    email: string;
    nombre: string;
    idFiscal: string | null;
    telefono: string | null;
    clienteId: string | null;
    direcciones: DireccionCuenta[];
};

export type PedidoResumen = {
    id: string;
    codigo: string;
    fecha: string;
    total: number;
    divisa: string;
    servido: string;
};

export type LineaPedido = {
    referencia: string;
    descripcion: string;
    cantidad: number;
    precio: number;
    importe: number;
};

export type PedidoDetalle = PedidoResumen & {
    neto: number;
    totalIva: number;
    lineas: LineaPedido[];
};

export type DireccionCuentaApi = {
    id: string;
    nombre_via: string;
    numero: string | null;
    cod_postal: string;
    ciudad: string;
    provincia: string | null;
    pais_id: string;
    envio: boolean;
    facturacion: boolean;
};

export type CuentaApi = {
    email: string;
    nombre: string;
    id_fiscal: string | null;
    telefono: string | null;
    cliente_id: string | null;
    direcciones: DireccionCuentaApi[];
};

export type PedidoResumenApi = {
    id: string;
    codigo: string;
    fecha: string;
    total: number;
    divisa: string;
    servido: string;
};

export type LineaPedidoApi = {
    referencia: string;
    descripcion: string;
    cantidad: number;
    precio: number;
    importe: number;
};

export type PedidoDetalleApi = PedidoResumenApi & {
    neto: number;
    total_iva: number;
    lineas: LineaPedidoApi[];
};
