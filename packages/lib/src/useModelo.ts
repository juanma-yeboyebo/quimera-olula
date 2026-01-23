import { useCallback, useReducer, useRef, useState } from "react";

import { Modelo, TipoInput, ValorCampoUI } from "./diseño.ts";
import { Accion, convertirCampoDesdeUI, convertirCampoHaciaUI, formatoValorCampoValido, makeReductor, MetaModelo, modeloEsEditable, modeloEsValido, modeloModificado, validacionCampoModelo } from "./dominio.ts";


export function useModelo<T extends Modelo>(
    meta: MetaModelo<T>,
    modeloInicialProp: T
): HookModelo<T> {

    const [modelo, dispatch] = useReducer(
        makeReductor(),
        modeloInicialProp
    );
    const [modeloInicial, setModeloInicial] = useState<T>(modeloInicialProp);
    const modeloInicialPropRef = useRef(modeloInicialProp);
    modeloInicialPropRef.current = modeloInicialProp;
    const entidad = {
        valor: modelo,
        valor_inicial: modeloInicial,
    };

    const setCampo = (campo: string, segundo?: string) => (_valor: ValorControl) => {
        let valor = _valor || null;
        let descripcion: string | undefined = undefined;


        const valorAnterior = modelo[campo];

        if (typeof _valor === "object" && _valor && 'valor' in _valor) {
            valor = _valor.valor;
            if (segundo) {
                descripcion = _valor.descripcion;
            }
        }
        if (!formatoValorCampoValido(meta)(campo, valor)) {
            return;
        }

        const valorModelo = convertirCampoDesdeUI(meta)(campo, valor as string);

        let nuevoModelo = {
            ...modelo,
            [campo]: valorModelo,
        } as T
        if (segundo && descripcion) {
            nuevoModelo = {
                ...nuevoModelo,
                [segundo]: descripcion,
            } as T
        }
        if (meta.onChange) {
            const otros = typeof _valor === "object" ? _valor as Record<string, unknown> : {};
            nuevoModelo = meta.onChange(nuevoModelo as T, campo, valorAnterior, otros);
        }
        dispatch({
            type: "set",
            payload: {
                entidad: nuevoModelo,
            },
        });

        // dispatch({
        //     type: "set_campo",
        //     payload: { campo, valor: valor as string },
        // });

        // if (segundo && descripcion) {
        //     dispatch({
        //         type: "set_campo",
        //         payload: { campo: segundo, valor: descripcion },
        //     });
        // }
    };
    const uiProps = (campo: string, secundario?: string) => {

        const validacion = validacionCampoModelo(meta)(modelo, campo);
        const valido = validacion === true;
        const valor = modelo[campo];
        const textoValidacion = valor === modeloInicial[campo]
            ? ''
            : typeof validacion === "string"
                ? validacion
                : '';
        const editable = modeloEsEditable<T>(meta)(modelo, campo);
        const cambiado = valor !== modeloInicial[campo];
        const campos = meta.campos || {};
        const tipoCampo = campo in campos && campos[campo]?.tipo
            ? campos[campo].tipo
            : "texto";

        const conversionTipo = {
            "boolean": "checkbox",
            "dolar": "moneda",
        };

        // const tipo = conversionTipo[tipoCampo] || tipoCampo;
        const tipo = (conversionTipo[tipoCampo as keyof typeof conversionTipo] || tipoCampo) as TipoInput;
        const valorUI = convertirCampoHaciaUI(meta)(campo, valor);

        return {
            nombre: campo,
            valor: valorUI,
            tipo: tipo,
            deshabilitado: !editable,
            valido: cambiado && valido,
            erroneo: !valido,
            advertido: false,
            textoValidacion: textoValidacion,
            onChange: setCampo(campo, secundario),
            descripcion: secundario ? modelo[secundario] as string : undefined,
        }
    }
    const init = useCallback((nuevoModelo?: T) => {
        const modeloAUsar = nuevoModelo || modeloInicialPropRef.current;
        dispatch({
            type: "set",
            payload: {
                entidad: modeloAUsar
            }
        });
        setModeloInicial(modeloAUsar);
    }, []); // Vacío porque usamos ref

    const set = useCallback((modelo: T) => {
        // if (modelo === modeloInicial) return;
        dispatch({
            type: "set",
            payload: {
                entidad: modelo
            }
        })
    }, [dispatch]);

    return {
        modelo,
        modeloInicial: modeloInicial || modeloInicialProp,
        uiProps,
        init,
        set,
        dispatch,
        modificado: modeloModificado(entidad),
        valido: modeloEsValido(meta)(entidad.valor),
        editable: modeloEsEditable<T>(meta)(modelo),
    } as const;
}

export type HookModelo<T extends Modelo> = {
    modelo: T,
    modeloInicial: T,
    uiProps: (campo: string, secundario?: string) => UiProps,
    init: (entidad?: T) => void,
    set: (entidad: T) => void,
    dispatch: (action: Accion<T>) => void
    modificado: boolean,
    valido: boolean,
    editable: boolean,
}

type ParamOpcion = {
    valor: string;
    descripcion?: string
};

export type ValorControl = null | string | ParamOpcion;

export type UiProps = {
    nombre: string;
    valor: ValorCampoUI;
    tipo: TipoInput;
    textoValidacion: string;
    deshabilitado: boolean;
    erroneo: boolean;
    advertido: boolean;
    valido: boolean;
    onChange: (valor: ValorControl) => void;
    descripcion?: string;
}

