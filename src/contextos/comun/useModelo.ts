import { useCallback, useReducer, useState } from "react";
import { Accion, Modelo, TipoInput, ValorControl } from "./diseño.ts";
import { makeReductor2, MetaModelo, modeloEsEditable, modeloEsValido, modeloModificado, validacionCampoModelo } from "./dominio.ts";

export type UiProps = {
    nombre: string;
    valor: string;
    tipo: TipoInput;
    textoValidacion: string;
    deshabilitado: boolean;
    erroneo: boolean;
    advertido: boolean;
    valido: boolean;
    onChange: (valor: ValorControl) => void;
    descripcion?: string;
}

export type HookModelo<T extends Modelo> = {
    modelo: T,
    modeloInicial: T,
    uiProps: (campo: string, secundario?: string) => UiProps,
    init: (entidad?: T) => void,
    dispatch: (action: Accion<T>) => void
    modificado: boolean,
    valido: boolean,
    editable: boolean,
}

export function useModelo<T extends Modelo>(
    meta: MetaModelo<T>,
    modeloInicialProp: T
): HookModelo<T> {

    const [modelo, dispatch] = useReducer(
        makeReductor2(meta),
        modeloInicialProp
    );
    const [modeloInicial, setModeloInicial] = useState(modeloInicialProp);
    const entidad = {
        valor: modelo,
        valor_inicial: modeloInicial,
    };

    const setCampo = (campo: string, segundo?: string) => (_valor: ValorControl) => {
        let valor = _valor || null;
        let descripcion: string | undefined = undefined;

        if (typeof _valor === "object" && _valor && 'valor' in _valor) {
            valor = _valor.valor;
            if (segundo) {
                descripcion = _valor.descripcion;
            }
        }

        dispatch({
            type: "set_campo",
            payload: { campo, valor: valor as string },
        });

        if (segundo && descripcion) {
            dispatch({
                type: "set_campo",
                payload: { campo: segundo, valor: descripcion },
            });
        }
    };

    const uiProps = (campo: string, secundario?: string) => {
        const validacion = validacionCampoModelo(meta)(modelo, campo);
        const valido = validacion === true;
        const valor = modelo[campo] as string;
        const textoValidacion = valor === modeloInicial[campo]
            ? ''
            : typeof validacion === "string"
                ? validacion
                : '';
        const editable = modeloEsEditable<T>(meta)(modelo, campo);
        const cambiado = valor !== modeloInicial[campo];
        const campos = meta.campos || {};
        const tipoMeta = campo in campos && campos[campo]?.tipo
            ? campos[campo].tipo
            : "texto";

        const conversionTipo = {
            "boolean": "checkbox",
            "dolar": "moneda",
        };

        const tipo = (conversionTipo[tipoMeta as keyof typeof conversionTipo] || tipoMeta) as TipoInput;

        return {
            nombre: campo,
            valor: valor,
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

    const init = useCallback((modelo?: T) => {
        dispatch({
            type: "init",
            payload: {
                entidad: modelo || modeloInicial
            }
        })
        setModeloInicial(modelo || modeloInicial);
    }, [modeloInicial]);

    return {
        modelo,
        modeloInicial,
        uiProps,
        init,
        dispatch,
        modificado: modeloModificado(entidad),
        valido: modeloEsValido(meta)(entidad.valor),
        editable: modeloEsEditable<T>(meta)(modelo),
    } as const;
}

