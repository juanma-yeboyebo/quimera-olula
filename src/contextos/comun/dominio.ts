import { Accion, Direccion, Entidad, EstadoInput, Modelo, TipoInput, ValidacionCampo } from "./diseño.ts";

export type Validacion = Record<string, ValidacionCampo>;

export type EstadoModelo<T extends Modelo> = {
    valor: T;
    valor_inicial: T;
}


type Campo<T extends Modelo> = {
    nombre?: string;
    tipo?: TipoInput;
    requerido?: boolean;
    bloqueado?: boolean;
    validacion?: (modelo: T) => string | boolean;
}

export type MetaModelo<T extends Modelo> = {
    campos?: Record<string, Campo<T>>;
    editable?: (modelo: T, campo?: string) => boolean;
    validacion?: (modelo: T) => string | boolean;
}

export const actualizarEntidadEnLista = <T extends Entidad>(entidades: T[], entidad: T): T[] => {
    return entidades.map(e => {
        return e.id === entidad.id ? entidad : e
    });
}

export const quitarEntidadDeLista = <T extends Entidad>(lista: T[], id: string): T[] => {
    return lista.filter((e) => e.id !== id);
}

export const refrescarSeleccionada = <T extends Entidad>(entidades: T[], id: string | undefined, setSeleccionada: (e?: string) => void) => {
    const nuevaSeleccionada = id
        ? entidades.find((e) => e.id === id)
        : null
    setSeleccionada(nuevaSeleccionada ? nuevaSeleccionada.id : undefined);
}

export const getElemento = <T extends Entidad>(lista: T[], id: string): T => {
    const elementos = lista.filter((e) => e.id === id);
    if (elementos.length === 1) {
        return elementos[0];
    }
    throw new Error(`No se encontró el elemento con id ${id}`);
};

export const direccionCompleta = (valor: Direccion) => `${valor.tipo_via ? (valor.tipo_via + ' ') : ''} ${valor.nombre_via}, ${valor.ciudad}`;

export const direccionVacia: Direccion = {
    tipo_via: '',
    nombre_via: '',
    ciudad: '',
    numero: '',
    otros: '',
    cod_postal: '',
    provincia_id: 0,
    provincia: '',
    pais_id: '',
    apartado: '',
    telefono: '',
}
export const boolAString = (valor: boolean) => valor ? "Sí" : "No";

export const stringNoVacio = (valor: string) => {
    return valor.length > 0;
}

type TipoCampo = string | boolean | number | null;


export const makeReductor = <T extends Modelo>(meta: MetaModelo<T>) => {
    return (estado: EstadoModelo<T>, accion: Accion<T>): EstadoModelo<T> => {
        switch (accion.type) {
            case "init": {
                return initEstadoModelo<T>(
                    accion.payload.entidad,
                );
            }
            case "set_campo": {
                const valor = convertirValorCampo<T>(
                    accion.payload.valor,
                    accion.payload.campo,
                    meta.campos
                );
                return cambiarEstadoModelo<T>(
                    estado,
                    accion.payload.campo,
                    valor,
                );
            }
            default: {
                return { ...estado };
            }
        }
    }
}

export const makeReductor2 = <T extends Modelo>(meta: MetaModelo<T>) => {
    return (estado: T, accion: Accion<T>): T => {
        switch (accion.type) {
            case "init": {
                return accion.payload.entidad;
            }
            case "set_campo": {
                const valor = convertirValorCampo<T>(
                    accion.payload.valor,
                    accion.payload.campo,
                    meta.campos
                );
                return {
                    ...estado,
                    [accion.payload.campo]: valor
                }
            }
            default: {
                return { ...estado };
            }
        }
    }
}

const convertirValorCampo = <T extends Modelo>(valor: string, campo: string, campos?: Record<string, Campo<T>>) => {
    if (!campos) return valor;
    if (!(campo in campos)) return valor;
    if (valor === null) {
        return null;
    }

    switch (campos[campo].tipo) {
        case 'checkbox':
            return valor === 'true'
        case 'numero': {
            const numero = parseFloat(valor);
            return isNaN(numero) ? '' : numero; // Quizá hay que convertir a null y pasar luego en el uiProps a ''
        }
        default:
            return valor;
    }
}

export const initEstadoModelo = <T extends Modelo>(modelo: T) => {
    const estado = {
        valor: { ...modelo },
        valor_inicial: modelo,
    }
    return estado;
}

export const cambiarEstadoModelo = <T extends Modelo>(
    estado: EstadoModelo<T>,
    campo: string,
    valor: TipoCampo,
): EstadoModelo<T> => {
    return {
        ...estado,
        valor: {
            ...estado.valor,
            [campo]: valor
        }
    }
}

export const campoModeloAInput = <T extends Modelo>(
    estado: EstadoModelo<T>,
    campo: string
): EstadoInput => {
    const validacion = {
        valido: true,
        textoValidacion: "",
        bloqueado: false,
        requerido: false,
    }
    const valor = estado.valor[campo] as string;
    const cambiado = valor !== estado.valor_inicial[campo];
    return {
        nombre: campo,
        valor: valor,
        deshabilitado: validacion.bloqueado,
        valido: cambiado && validacion.valido,
        erroneo: !validacion.valido,
        advertido: false,
        textoValidacion: validacion.textoValidacion,
    }
}

export const validacionDefecto = (validacion: ValidacionCampo, valor: string): ValidacionCampo => {
    const valido = !validacion.requerido || stringNoVacio(valor);
    return {
        ...validacion,
        valido,
        textoValidacion: valido ? "" : "Campo requerido",
    }
}

export const modeloEsEditable = <T extends Modelo>(meta: MetaModelo<T>) => (modelo: T, campo?: string) => {
    const campos = meta.campos || {};
    const bloqueado = campo
        ? campo in campos && campos[campo]?.bloqueado
        : false
    return (campo)
        ? meta.editable
            ? meta.editable(modelo, campo) && !bloqueado
            : !bloqueado
        : meta.editable
            ? meta.editable(modelo)
            : true;
}


export const validacionCampoModelo = <T extends Modelo>(meta: MetaModelo<T>) => (modelo: T, campo: string) => {
    const campos = meta.campos || {};
    const requerido = campo in campos && campos[campo]?.requerido
    const valor = modelo[campo];
    if (requerido && valor === null) {
        return "Campo requerido";
    }
    if (campos[campo]?.tipo === "email" && typeof valor === "string" && valor.length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valor)) {
            return "Formato Email incorrecto";
        }
    }
    const validacion = campos[campo]?.validacion
    return validacion
        ? validacion(modelo)
        : true;

}
export const campoModeloEsValido = <T extends Modelo>(meta: MetaModelo<T>) => (modelo: T, campo: string) =>
    validacionCampoModelo(meta)(modelo, campo) === true;

export const modeloEsValido = <T extends Modelo>(meta: MetaModelo<T>) => (modelo: T) => {
    const camposValidos = Object.keys(modelo).every((k) =>
        campoModeloEsValido(meta)(modelo, k) === true
    )
    const validacionGeneral = meta.validacion
        ? meta.validacion(modelo) === true
        : true;

    return camposValidos && validacionGeneral;
}

export const modeloModificadoYValido = <T extends Modelo>(meta: MetaModelo<T>) => (estado: EstadoModelo<T>) => {
    return modeloModificado(estado) && modeloEsValido(meta)(estado.valor);
}

export const modeloModificado = <T extends Modelo>(estado: EstadoModelo<T>) => {
    const valor_inicial = estado.valor_inicial;
    const valor = estado.valor;

    return (
        Object.keys(valor).some((k) => valor[k] !== valor_inicial[k])
    )
}

export const formatearMoneda = (cantidad: number, divisa: string): string => {
    const locale = divisa === "EUR" ? "es-ES" : "en-US";
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: divisa,
    }).format(cantidad);
};
