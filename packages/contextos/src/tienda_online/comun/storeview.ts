let codigoActivo: string | null = null;

export const fijarStoreViewActivo = (codigo: string | null) => {
    codigoActivo = codigo;
};

export const codigoStoreViewActivo = (): string | null => codigoActivo;
