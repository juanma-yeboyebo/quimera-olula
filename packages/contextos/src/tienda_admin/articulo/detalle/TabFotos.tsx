import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { ArticuloWebDetalle } from "../diseño.ts";
import "./TabFotos.css";

const TEXTO_PROXIMAMENTE = "Disponible próximamente";

export const TabFotos = ({ articulo }: { articulo: ArticuloWebDetalle }) => {
    const imagenes = [...articulo.imagenes].sort((a, b) => a.orden - b.orden);

    return (
        <div className="TabFotos">
            <div className="maestro-botones">
                <QBoton deshabilitado>Subir fotos</QBoton>
                <span className="TabFotos-aviso">{TEXTO_PROXIMAMENTE}</span>
            </div>
            <div className="TabFotos-rejilla">
                {imagenes.map((imagen) => (
                    <figure
                        key={imagen.id}
                        className="TabFotos-foto"
                        data-principal={imagen.principal}
                        draggable={false}
                    >
                        <img src={imagen.url} alt={imagen.alt} loading="lazy" />
                        {imagen.principal && <figcaption>Principal</figcaption>}
                        <div className="TabFotos-acciones">
                            <QBoton tamaño="pequeño" variante="texto" deshabilitado>
                                Marcar como principal
                            </QBoton>
                            <QBoton tamaño="pequeño" variante="texto" deshabilitado>
                                Borrar
                            </QBoton>
                        </div>
                    </figure>
                ))}
            </div>
            {imagenes.length === 0 && <p>Este artículo no tiene fotos.</p>}
        </div>
    );
};
