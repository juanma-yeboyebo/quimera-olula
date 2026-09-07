import { ArticuloLinea } from "#/compras/comun/componentes/articulo_linea/ArticuloLinea.tsx";
import { GrupoIvaProducto } from "#/ventas/comun/componentes/grupo_iva_producto.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo, useState } from "react";
import { LineaPedido, Pedido } from "../diseño.ts";
import {
    articuloLineaBloqueado,
    metaLineaPedido,
    modeloLineaPedido,
} from "../dominio.ts";
import { patchLineaPedido } from "../infraestructura.ts";
import "./CambiarLineaPedido.css";

export const CambiarLineaPedido = ({
    pedido,
    linea,
    publicar,
}: {
    pedido: Pedido;
    linea: LineaPedido;
    publicar: EmitirEvento;
}) => {
    const inicial = useMemo(() => modeloLineaPedido(linea), [linea]);
    const { modelo, uiProps, valido, set } = useModelo(metaLineaPedido, inicial);

    const cambiar_ = useCallback(async () => {
        await patchLineaPedido(pedido.id, linea.id, modelo);
        publicar("linea_cambiada", linea.id);
    }, [modelo, pedido.id, linea.id, publicar]);

    const cancelar_ = useCallback(
        () => publicar("cambio_de_linea_cancelado"),
        [publicar]
    );

    const [mostrarMas, setMostrarMas] = useState(false);

    const [cambiar, cancelar] = useForm(cambiar_, cancelar_);

    return (
        <QModal
            abierto={true}
            nombre="cambiarLineaPedidoCompra"
            titulo="Cambiar línea"
            onCerrar={cancelar}
        >
            <div className="CambiarLineaPedido">
                <quimera-formulario>
                    <ArticuloLinea
                        tipoArticulo={modelo.tipoArticulo}
                        referencia={modelo.referencia}
                        descripcionArticulo={modelo.descripcionArticulo}
                        descripcion={modelo.descripcion}
                        nombre="referenciaLineaPedidoCompra"
                        onChange={(cambios) => set({ ...modelo, ...cambios })}
                        bloqueado={articuloLineaBloqueado(linea)}
                    />
                    <QInput label="Cantidad" {...uiProps("cantidad")} />
                    <QInput label="Coste unitario" {...uiProps("pvpUnitario")} />

                    <div className="mostrar-mas-fila">
                        <button
                            type="button"
                            className="mostrar-mas-btn"
                            onClick={() => setMostrarMas((v) => !v)}
                        >
                            {mostrarMas ? "▲ Menos opciones" : "▼ Más opciones"}
                        </button>
                    </div>

                    {mostrarMas && (
                        <>
                            <QInput label="% Descuento" {...uiProps("dtoPorcentual")} />
                            <QInput label="Descuento lineal" {...uiProps("dtoLineal")} />
                            <GrupoIvaProducto {...uiProps("grupoIvaProductoId")} />
                            <QInput label="% IVA" {...uiProps("tipoIva")} soloLectura />
                            <QInput label="% I.R.P.F." {...uiProps("tipoIrpf")} />
                        </>
                    )}
                </quimera-formulario>
                <div className="botones maestro-botones">
                    <QBoton onClick={cambiar} deshabilitado={!valido}>
                        Cambiar
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
