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

export type DatosCuenta = {
    nombre: string;
    idFiscal: string;
    telefono: string | null;
};

export type CambioPassword = {
    actual: string;
    nueva: string;
    repetir: string;
};

export type ErroresRegistro = Record<string, string>;

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
