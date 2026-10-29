import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { useState } from "react";
import { ResumenVista } from "../../../vista/diseño.ts";

type GestionVistasProps = {
    vistas: ResumenVista[];
    vista: ResumenVista | null;
    emitir: (evento: string, payload?: unknown) => void;
};

const SIN_VISTA = "";
const MAX_NOMBRE = 80;

export const GestionVistas = ({ vistas, vista, emitir }: GestionVistasProps) => {
    const [pidiendoNombre, setPidiendoNombre] = useState(false);
    const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);
    const [nombre, setNombre] = useState("");
    const nombreLimpio = nombre.trim();

    return (
        <div className="analisis-vistas">
            <QSelect
                label="Vista"
                nombre="vista"
                valor={vista?.id ?? SIN_VISTA}
                opciones={[
                    { valor: SIN_VISTA, descripcion: "Sin vista" },
                    ...vistas.map((v) => ({ valor: v.id, descripcion: v.nombre })),
                ]}
                onChange={(opcion) =>
                    opcion?.valor ? emitir("vista_abierta", opcion.valor) : emitir("vista_cerrada")
                }
            />
            <QBoton variante="texto" deshabilitado={!vista} onClick={() => emitir("vista_guardada")}>
                Guardar
            </QBoton>
            <QBoton
                variante="texto"
                onClick={() => {
                    setNombre(vista ? `${vista.nombre} (copia)` : "");
                    setPidiendoNombre(true);
                }}
            >
                Guardar como
            </QBoton>
            <QBoton variante="texto" destructivo deshabilitado={!vista} onClick={() => setConfirmandoBorrado(true)}>
                Borrar
            </QBoton>

            {pidiendoNombre && (
                <QModal nombre="guardar-vista" titulo="Guardar vista" abierto onCerrar={() => setPidiendoNombre(false)}>
                    <div className="analisis-recarga">
                        <QInput label="Nombre" nombre="nombre" valor={nombre} onChange={setNombre} maxLength={MAX_NOMBRE} autoFocus />
                        <div className="analisis-filtro-botones">
                            <QBoton variante="texto" onClick={() => setPidiendoNombre(false)}>
                                Cancelar
                            </QBoton>
                            <QBoton
                                deshabilitado={nombreLimpio.length === 0}
                                onClick={() => {
                                    setPidiendoNombre(false);
                                    emitir("vista_guardada_como", nombreLimpio);
                                }}
                            >
                                Guardar
                            </QBoton>
                        </div>
                    </div>
                </QModal>
            )}

            <QModalConfirmacion
                nombre="borrar-vista"
                abierto={confirmandoBorrado}
                titulo="Borrar vista"
                mensaje={vista ? `¿Borrar la vista "${vista.nombre}"?` : ""}
                destructivo
                labelAceptar="Borrar"
                onCerrar={() => setConfirmandoBorrado(false)}
                onAceptar={() => {
                    setConfirmandoBorrado(false);
                    emitir("vista_borrada");
                }}
            />
        </div>
    );
};
