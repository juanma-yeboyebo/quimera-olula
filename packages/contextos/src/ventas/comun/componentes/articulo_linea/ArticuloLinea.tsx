import { Articulo } from "#/almacen/comun/componentes/Articulo.tsx";
import { TipoArticuloLinea } from "#/ventas/venta/diseño.ts";
import { QIcono, QInput } from "@olula/componentes/index.js";
import { useEffect, useRef } from "react";
import "./ArticuloLinea.css";

export type CamposArticuloLinea = {
    tipo: TipoArticuloLinea;
    idArticulo: string | null;
    articulo: string | null;
    descripcion: string;
};

interface ArticuloLineaProps extends CamposArticuloLinea {
    nombre?: string;
    onChange: (cambios: Partial<CamposArticuloLinea>) => void;
    ref?: React.RefObject<HTMLInputElement | null>;
    bloqueado?: boolean;
}

export const ArticuloLinea = ({
    tipo,
    idArticulo,
    articulo,
    descripcion,
    nombre = "idArticulo",
    onChange,
    bloqueado = false,
}: ArticuloLineaProps) => {
    const refArticulo = useRef<HTMLInputElement | null>(null);
    const refDescripcionRegistrado = useRef<HTMLInputElement | null>(null);
    const refDescripcionLibre = useRef<HTMLInputElement | null>(null);
    const montado = useRef(false);

    useEffect(() => {
        if (!montado.current) {
            montado.current = true;
            return;
        }
        if (tipo === "generico") {
            refDescripcionRegistrado.current?.focus();
            refDescripcionRegistrado.current?.select();
        } else if (tipo === "libre") {
            refDescripcionLibre.current?.focus();
            refDescripcionLibre.current?.select();
        } else if (tipo === "registrado") {
            refArticulo.current?.focus();
        }
    }, [tipo]);

    const toggleDescripcion = () => {
        const nuevoTipo = tipo === "registrado" ? "generico" : "registrado";
        onChange({
            tipo: nuevoTipo,
            descripcion: articulo!
        });
    };

    const abrir = () => {
        onChange({ tipo: "libre", idArticulo: null, articulo: null, descripcion: "" });
    };

    const cerrar = () => {
        onChange({ tipo: "registrado", idArticulo: null, articulo: null, descripcion: "" });
    };

    if (tipo !== "libre") {
        return (
            <>
                <div className="ArticuloLinea-campo">
                    <Articulo
                        valor={idArticulo ?? ""}
                        descripcion={articulo ?? ""}
                        nombre={nombre}
                        onChange={(opcion) =>
                            onChange({
                                idArticulo: opcion?.valor ?? null,
                                articulo: opcion?.descripcion ?? null,
                            })
                        }
                        ref={refArticulo}
                        soloLectura={bloqueado}
                    />
                    {idArticulo && !bloqueado && (
                        <button
                            type="button"
                            onClick={toggleDescripcion}
                            title="Editar descripción"
                            aria-label="Editar descripción"
                            className="ArticuloLinea-boton-candado"
                        >
                            <QIcono nombre="editar_2" tamaño="sm" />
                        </button>
                    )}
                    {!bloqueado &&
                        <button
                            type="button"
                            onClick={abrir}
                            title="Abrir descripción libre"
                            aria-label="Abrir descripción libre"
                            className="ArticuloLinea-boton-candado"
                        >
                            <QIcono nombre="candado_abierto" tamaño="sm" />
                        </button>
                    }
                </div>
                {tipo === "generico" && (
                    <QInput
                        nombre="descripcion"
                        label="Descripción personalizada"
                        valor={descripcion ?? ""}
                        onChange={(val) => onChange({ descripcion: val })}
                        valido={!!descripcion}
                        ref={refDescripcionRegistrado}
                    />
                )}
            </>
        );
    }

    return (
        <div className="ArticuloLinea-campo">
            <QInput
                nombre="descripcion"
                label="Descripción"
                valor={descripcion ?? ""}
                erroneo={!descripcion}
                onChange={(val) => onChange({ descripcion: val })}
                ref={refDescripcionLibre}
            />
            {!bloqueado &&
                <button
                    type="button"
                    onClick={cerrar}
                    title="Cerrar descripción libre"
                    aria-label="Cerrar descripción libre"
                    className="ArticuloLinea-boton-candado"
                >
                    <QIcono nombre="candado" tamaño="sm" />
                </button>
            }
        </div>
    );
};
