import { ArticuloLinea } from "#/compras/comun/componentes/articulo_linea/ArticuloLinea.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo } from "react";
import { Albaran } from "../diseño.ts";
import { metaNuevaLineaAlbaran, nuevaLineaAlbaranVacia } from "../dominio.ts";
import { postLineaAlbaran } from "../infraestructura.ts";
import "./CrearLineaAlbaran.css";

export const CrearLineaAlbaran = ({
    albaran,
    publicar,
}: {
    albaran: Albaran;
    publicar: EmitirEvento;
}) => {
    const inicial = useMemo(nuevaLineaAlbaranVacia, []);
    const { modelo, uiProps, valido, set } = useModelo(metaNuevaLineaAlbaran, inicial);

    const crear_ = useCallback(async () => {
        const idLinea = await postLineaAlbaran(albaran.id, modelo);
        publicar("linea_creada", idLinea);
    }, [modelo, albaran.id, publicar]);

    const cancelar_ = useCallback(
        () => publicar("alta_de_linea_cancelada"),
        [publicar]
    );

    const cambiarArticulo = (cambios: Partial<typeof modelo>) => {
        const libre = (cambios.tipoArticulo ?? modelo.tipoArticulo) === "libre";
        set({ ...modelo, ...cambios, ...(libre ? {} : { pvpUnitario: null }) });
    };

    const [crear, cancelar] = useForm(crear_, cancelar_);

    return (
        <QModal
            abierto={true}
            nombre="crearLineaAlbaranCompra"
            titulo="Crear línea"
            onCerrar={cancelar}
        >
            <div className="CrearLineaAlbaran">
                <quimera-formulario>
                    <ArticuloLinea
                        tipoArticulo={modelo.tipoArticulo}
                        referencia={modelo.referencia}
                        descripcionArticulo={modelo.descripcionArticulo}
                        descripcion={modelo.descripcion}
                        nombre="referenciaNuevaLineaAlbaranCompra"
                        onChange={cambiarArticulo}
                        autoFocus
                    />
                    <QInput label="Cantidad" {...uiProps("cantidad")} />
                    {modelo.tipoArticulo === "libre" && (
                        <QInput label="Coste unitario" {...uiProps("pvpUnitario")} />
                    )}
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
