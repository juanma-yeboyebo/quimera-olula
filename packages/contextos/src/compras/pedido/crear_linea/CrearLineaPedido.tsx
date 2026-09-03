import { ArticuloLinea, CamposArticuloLinea } from "#/compras/comun/componentes/articulo_linea/ArticuloLinea.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo } from "react";
import { NuevaLineaPedido, Pedido } from "../diseño.ts";
import {
    camposConCambiosServidor,
    metaNuevaLineaPedido,
    nuevaLineaPedidoVacia,
} from "../dominio.ts";
import { postLineaPedido, queryNuevaLineaPedido } from "../infraestructura.ts";

export const CrearLineaPedido = ({
    pedido,
    publicar,
}: {
    pedido: Pedido;
    publicar: EmitirEvento;
}) => {
    const inicial = useMemo(nuevaLineaPedidoVacia, []);

    const onModeloListo = useCallback(
        async (linea: NuevaLineaPedido, campo?: string) => {
            if (campo && !(camposConCambiosServidor as readonly string[]).includes(campo)) {
                return;
            }
            return await queryNuevaLineaPedido(pedido.id, linea);
        },
        [pedido.id]
    );

    const { modelo, uiProps, valido, set } = useModelo(
        metaNuevaLineaPedido,
        inicial,
        onModeloListo
    );

    const onArticuloCambiado = useCallback(
        (cambios: Partial<CamposArticuloLinea>) => {
            set({
                ...modelo,
                ...cambios,
                ...(cambios.referencia !== undefined ? { pvpUnitario: null } : {}),
            });
        },
        [modelo, set]
    );

    const crear_ = useCallback(async () => {
        const idLinea = await postLineaPedido(pedido.id, modelo);
        publicar("linea_creada", idLinea);
    }, [modelo, pedido.id, publicar]);

    const cancelar_ = useCallback(
        () => publicar("alta_de_linea_cancelada"),
        [publicar]
    );

    const [crear, cancelar] = useForm(crear_, cancelar_);

    return (
        <QModal
            abierto={true}
            nombre="crearLineaPedidoCompra"
            titulo="Crear línea"
            onCerrar={cancelar}
        >
            <div className="CrearLineaPedido">
                <quimera-formulario>
                    <ArticuloLinea
                        tipoArticulo={modelo.tipoArticulo}
                        referencia={modelo.referencia}
                        descripcionArticulo={modelo.descripcionArticulo}
                        descripcion={modelo.descripcion}
                        nombre="referenciaNuevaLineaPedidoCompra"
                        onChange={onArticuloCambiado}
                        autoFocus
                    />
                    <QInput label="Cantidad" {...uiProps("cantidad")} />
                    <QInput label="Coste unitario" {...uiProps("pvpUnitario")} />
                    <QInput label="Total" {...uiProps("pvpTotal")} soloLectura />
                    <QInput label="% IVA" {...uiProps("tipoIva")} soloLectura />
                    <QInput label="% R.Equivalencia" {...uiProps("tipoRecargo")} soloLectura />
                </quimera-formulario>
                <div className="botones maestro-botones">
                    <QBoton onClick={crear} deshabilitado={!valido}>
                        Crear
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
