import { ArticuloLinea } from "#/compras/comun/componentes/articulo_linea/ArticuloLinea.tsx";
import { GrupoIvaProducto } from "#/ventas/comun/componentes/grupo_iva_producto.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo, useState } from "react";
import { Factura, LineaFactura } from "../diseño.ts";
import { lineaDeAlbaran, metaLineaFactura, modeloLineaFactura } from "../dominio.ts";
import { patchLineaFactura } from "../infraestructura.ts";
import "./CambiarLineaFactura.css";

export const CambiarLineaFactura = ({
    factura,
    linea,
    publicar,
}: {
    factura: Factura;
    linea: LineaFactura;
    publicar: EmitirEvento;
}) => {
    const inicial = useMemo(() => modeloLineaFactura(linea), [linea]);
    const { modelo, uiProps, valido, set } = useModelo(metaLineaFactura, inicial);

    const cambiar_ = useCallback(async () => {
        await patchLineaFactura(factura.id, linea.id, modelo);
        publicar("linea_cambiada", linea.id);
    }, [modelo, factura.id, linea.id, publicar]);

    const cancelar_ = useCallback(
        () => publicar("cambio_de_linea_cancelado"),
        [publicar]
    );

    const [mostrarMas, setMostrarMas] = useState(false);

    const [cambiar, cancelar] = useForm(cambiar_, cancelar_);

    return (
        <QModal
            abierto={true}
            nombre="cambiarLineaFacturaCompra"
            titulo="Cambiar línea"
            onCerrar={cancelar}
        >
            <div className="CambiarLineaFactura">
                {lineaDeAlbaran(linea) && (
                    <p className="aviso-linea-albaran">
                        {`Esta línea viene del albarán ${linea.codigoAlbaran ?? ""}.`}
                    </p>
                )}
                <quimera-formulario>
                    <ArticuloLinea
                        tipoArticulo={modelo.tipoArticulo}
                        referencia={modelo.referencia}
                        descripcionArticulo={modelo.descripcionArticulo}
                        descripcion={modelo.descripcion}
                        nombre="referenciaLineaFacturaCompra"
                        onChange={(cambios) => set({ ...modelo, ...cambios })}
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
