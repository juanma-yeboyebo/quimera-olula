import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { cerrarAviso, pausarAviso, reanudarAviso, useAvisos } from "../avisos_store.ts";
import { BotonTienda } from "./boton_tienda.tsx";
import "./avisos_tienda.css";

export const AvisosTienda = () => {
    const avisos = useAvisos();

    return (
        <div className="avisos-tienda" role="status" aria-live="polite">
            {avisos.map((aviso) => (
                <div
                    key={aviso.id}
                    className={`aviso-tienda aviso-tienda-${aviso.tipo}`}
                    onMouseEnter={() => pausarAviso(aviso.id)}
                    onMouseLeave={() => reanudarAviso(aviso.id)}
                >
                    <span className="aviso-tienda-texto">{aviso.texto}</span>
                    {aviso.accion && (
                        <BotonTienda
                            variante="enlace"
                            onClick={() => {
                                aviso.accion?.onClick();
                                cerrarAviso(aviso.id);
                            }}
                        >
                            {aviso.accion.texto}
                        </BotonTienda>
                    )}
                    <button
                        type="button"
                        className="aviso-tienda-cerrar"
                        aria-label="Cerrar aviso"
                        onClick={() => cerrarAviso(aviso.id)}
                    >
                        <QIcono nombre="cerrar" tamaño="sm" />
                    </button>
                </div>
            ))}
        </div>
    );
};
