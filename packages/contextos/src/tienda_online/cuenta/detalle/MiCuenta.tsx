import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { BotonTienda } from "../../comun/componentes/boton_tienda.tsx";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import { formatearPrecio, hayMas } from "../../comun/dominio.ts";
import "../CuentaTienda.css";
import { etiquetasDireccion, textoDireccion } from "../dominio.ts";
import { contextoCuentaInicial } from "./detalle.ts";
import { getMaquina } from "./maquina.ts";

const ContenidoMiCuenta = ({ idioma }: { idioma: string }) => {
    const navigate = useNavigate();
    const { ctx, emitir } = useMaquina(getMaquina, contextoCuentaInicial);
    const { estado, cuenta, pedidos, total, errorPedidos } = ctx;

    useEffect(() => {
        emitir("cargar");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cerrarSesion = (
        <BotonTienda variante="secundario" onClick={() => navigate("/logout")}>
            Cerrar sesión
        </BotonTienda>
    );

    if (estado === "CARGANDO")
        return (
            <div className="CuentaTienda">
                <div className="cuenta-contenedor">
                    <p>Cargando...</p>
                </div>
            </div>
        );

    if (estado === "SIN_CUENTA")
        return (
            <div className="CuentaTienda">
                <div className="cuenta-contenedor">
                    <div className="cuenta-tarjeta">
                        <p>Tu usuario no tiene cuenta en esta tienda</p>
                        <div className="cuenta-botones">{cerrarSesion}</div>
                    </div>
                </div>
            </div>
        );

    if (estado === "ERROR" || !cuenta)
        return (
            <div className="CuentaTienda">
                <div className="cuenta-contenedor">
                    <div className="cuenta-tarjeta">
                        <p role="alert" className="cuenta-error">
                            No se ha podido cargar tu cuenta
                        </p>
                        <div className="cuenta-botones">
                            <BotonTienda variante="secundario" onClick={() => emitir("reintentar")}>
                                Reintentar
                            </BotonTienda>
                            {cerrarSesion}
                        </div>
                    </div>
                </div>
            </div>
        );

    return (
        <div className="CuentaTienda">
            <div className="cuenta-contenedor">
                <h1>Mi cuenta</h1>
                <section className="cuenta-tarjeta">
                    <h2>Datos</h2>
                    <dl className="cuenta-datos">
                        <dt>Nombre</dt>
                        <dd>{cuenta.nombre}</dd>
                        <dt>Email</dt>
                        <dd>{cuenta.email}</dd>
                        {cuenta.idFiscal && (
                            <>
                                <dt>NIF/CIF</dt>
                                <dd>{cuenta.idFiscal}</dd>
                            </>
                        )}
                        {cuenta.telefono && (
                            <>
                                <dt>Teléfono</dt>
                                <dd>{cuenta.telefono}</dd>
                            </>
                        )}
                    </dl>
                </section>

                <section className="cuenta-tarjeta">
                    <h2>Direcciones</h2>
                    <ul className="cuenta-lista">
                        {cuenta.direcciones.map((d) => (
                            <li key={d.id}>
                                <span>{textoDireccion(d)}</span>
                                <span className="cuenta-suave">{etiquetasDireccion(d).join(" · ")}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="cuenta-tarjeta">
                    <h2>Mis pedidos</h2>
                    {errorPedidos && (
                        <p role="alert" className="cuenta-error">
                            No se han podido cargar los pedidos
                        </p>
                    )}
                    {pedidos.length === 0 && !errorPedidos && (
                        <div>
                            <p>Todavía no has hecho ningún pedido</p>
                            <Link to="/catalogo">Ir al catálogo</Link>
                        </div>
                    )}
                    {pedidos.length > 0 && (
                        <table className="cuenta-tabla">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Fecha</th>
                                    <th className="importe">Total</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map((p) => (
                                    <tr key={p.id}>
                                        <td data-etiqueta="Código">
                                            <Link to={`/mi-cuenta/pedido/${p.id}`}>{p.codigo}</Link>
                                        </td>
                                        <td data-etiqueta="Fecha">{p.fecha}</td>
                                        <td data-etiqueta="Total" className="importe">
                                            {formatearPrecio(p.total, p.divisa, idioma)}
                                        </td>
                                        <td data-etiqueta="Estado">{p.servido}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {hayMas(pedidos.length, total) && (
                        <div className="cuenta-botones">
                            <BotonTienda variante="secundario" onClick={() => emitir("ver_mas")}>
                                Ver más
                            </BotonTienda>
                        </div>
                    )}
                </section>

                <div className="cuenta-botones">{cerrarSesion}</div>
            </div>
        </div>
    );
};

export const MiCuenta = () => (
    <ConStoreView>{(sv) => <ContenidoMiCuenta idioma={sv.idioma} />}</ConStoreView>
);
