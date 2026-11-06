export type DireccionCheckout = {
    nombreVia: string;
    tipoVia: string | null;
    numero: string | null;
    otros: string | null;
    codPostal: string;
    ciudad: string;
    provincia: string | null;
    paisId: string;
    telefono: string | null;
};

export type DatosCheckout = {
    email: string;
    nombre: string;
    idFiscal: string | null;
    telefono: string | null;
    direccionFacturacion: DireccionCheckout;
    envioDistinto: boolean;
    direccionEnvio: DireccionCheckout;
};

export type DireccionCheckoutApi = {
    nombre_via: string;
    tipo_via: string | null;
    numero: string | null;
    otros: string | null;
    cod_postal: string;
    ciudad: string;
    provincia: string | null;
    pais_id: string;
    telefono: string | null;
};

export type DatosCheckoutApi = {
    email: string;
    nombre: string;
    id_fiscal: string | null;
    telefono: string | null;
    direccion_facturacion: DireccionCheckoutApi;
    direccion_envio: DireccionCheckoutApi | null;
};

export type ErroresCheckout = Record<string, string>;

export type ResultadoPago = "CONFIRMADO" | "INCIDENCIA" | "PENDIENTE";
