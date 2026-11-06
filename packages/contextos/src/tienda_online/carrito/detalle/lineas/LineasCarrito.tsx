import { Link } from "react-router";
import { BorrarLineaCarrito } from "../../borrar_linea/BorrarLineaCarrito.tsx";
import { CambiarCantidadLinea } from "../../cambiar_linea/CambiarCantidadLinea.tsx";
import { CarritoTienda } from "../../../comun/diseño.ts";
import { formatearPrecio } from "../../../comun/dominio.ts";
import { EstadoCarrito } from "../diseño.ts";

export const LineasCarrito = ({
    carrito,
    idioma,
    estado,
    publicar,
}: {
    carrito: CarritoTienda;
    idioma: string;
    estado: EstadoCarrito;
    publicar: (evento: string, payload?: unknown) => void;
}) => {
    const deshabilitado = estado === "ACTUALIZANDO";

    return (
        <ul className="carrito-lineas">
            {carrito.lineas.map((linea) => (
                <li key={`${linea.id}-${linea.cantidad}-${estado}`} className="carrito-linea">
                    <div className="linea-imagen">
                        {linea.imagen ? (
                            <img src={linea.imagen.url} alt={linea.imagen.alt || linea.descripcion} />
                        ) : (
                            <span className="linea-marcador" aria-hidden="true" />
                        )}
                    </div>
                    <div className="linea-datos">
                        {linea.slug ? (
                            <Link to={`/producto/${linea.slug}`}>{linea.descripcion}</Link>
                        ) : (
                            <span>{linea.descripcion}</span>
                        )}
                        <div className="linea-precio">
                            {formatearPrecio(linea.precio, carrito.divisa, idioma)}
                            {linea.dtoPorcentual > 0 && (
                                <small className="linea-descuento"> Dto. {linea.dtoPorcentual}%</small>
                            )}
                        </div>
                    </div>
                    <CambiarCantidadLinea
                        linea={linea}
                        deshabilitado={deshabilitado}
                        onCambiar={(cantidad) =>
                            publicar("cantidad_cambiada", { lineaId: linea.id, cantidad })
                        }
                    />
                    <div className="linea-importe">
                        {formatearPrecio(linea.importe, carrito.divisa, idioma)}
                    </div>
                    <BorrarLineaCarrito
                        linea={linea}
                        deshabilitado={deshabilitado}
                        onBorrar={() => publicar("linea_borrada", { lineaId: linea.id })}
                    />
                </li>
            ))}
        </ul>
    );
};
