import { useEffect, useState } from "react";
import { CategoriaTienda } from "../catalogo/diseño.ts";
import { getCategorias } from "../catalogo/infraestructura.ts";

let promesa: Promise<CategoriaTienda[]> | null = null;
let cargadas: CategoriaTienda[] | null = null;

export const cargarCategorias = (): Promise<CategoriaTienda[]> => {
    if (!promesa) {
        promesa = getCategorias()
            .catch(() => [] as CategoriaTienda[])
            .then((c) => {
                cargadas = c;
                return c;
            });
    }
    return promesa;
};

export const reiniciarCategorias = () => {
    promesa = null;
    cargadas = null;
};

export const useCategoriasTienda = (): CategoriaTienda[] => {
    const [categorias, setCategorias] = useState<CategoriaTienda[]>(cargadas ?? []);

    useEffect(() => {
        let vivo = true;
        cargarCategorias().then((c) => {
            if (vivo) setCategorias(c);
        });
        return () => {
            vivo = false;
        };
    }, []);

    return categorias;
};
