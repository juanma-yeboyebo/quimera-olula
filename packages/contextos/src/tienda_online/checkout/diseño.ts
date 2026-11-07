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

export type ErroresCheckout = Record<string, string>;

export type ResultadoPago = "CONFIRMADO" | "INCIDENCIA" | "PENDIENTE";
