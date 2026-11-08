import { Link } from "react-router";
import { BorrarLineaCarrito } from "../../borrar_linea/BorrarLineaCarrito.tsx";
import { CambiarCantidadLinea } from "../../cambiar_linea/CambiarCantidadLinea.tsx";
import { CarritoTienda } from "../../../comun/diseño.ts";
import { PrecioTienda } from "../../../comun/componentes/precio_tienda.tsx";
import { SinImagen } from "../../../comun/componentes/sin_imagen.tsx";
import { EstadoDetalleCarrito } from "../diseño.ts";
import "./LineasCarrito.css";

export const LineasCarrito = ({
    carrito,
    estado,
    ocupado,
    publicar,
}: {
    carrito: CarritoTienda;
    estado: EstadoDetalleCarrito;
    ocupado: boolean;
    publicar: (evento: string, payload?: unknown) => void | Promise<void>;
}) => {
    const deshabilitado = ocupado || estado === "ACTUALIZANDO";

    return (
        <ul className="carrito-lineas">
            {carrito.lineas.map((linea) => (
                <li key={linea.id} className="carrito-linea">
                    <div className="linea-imagen">
                        {linea.imagen ? (
                            <img src={linea.imagen.url} alt={linea.imagen.alt || linea.descripcion} />
                        ) : (
                            <SinImagen />
                        )}
                    </div>
                    <div className="linea-datos">
                        {linea.slug ? (
                            <Link to={`/producto/${linea.slug}`}>{linea.descripcion}</Link>
                        ) : (
                            <span>{linea.descripcion}</span>
                        )}
                        <PrecioTienda importe={linea.precio} divisa={carrito.divisa} />
                        {linea.dtoPorcentual > 0 && (
                            <small className="linea-descuento">Dto. {linea.dtoPorcentual}%</small>
                        )}
                        <div className="linea-acciones">
                            <CambiarCantidadLinea
                                linea={linea}
                                deshabilitado={deshabilitado}
                                onCambiar={(cantidad) =>
                                    publicar("cantidad_cambiada", { lineaId: linea.id, cantidad })
                                }
                            />
                            <BorrarLineaCarrito
                                linea={linea}
                                deshabilitado={deshabilitado}
                                onBorrar={() => publicar("linea_borrada", { lineaId: linea.id })}
                            />
                        </div>
                    </div>
                    <div className="linea-importe">
                        <PrecioTienda importe={linea.importe} divisa={carrito.divisa} />
                    </div>
                </li>
            ))}
        </ul>
    );
};
