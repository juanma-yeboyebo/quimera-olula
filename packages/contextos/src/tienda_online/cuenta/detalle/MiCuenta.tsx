import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
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
        <button type="button" onClick={() => navigate("/logout")}>
            Cerrar sesión
        </button>
    );

    if (estado === "CARGANDO") return <p>Cargando...</p>;

    if (estado === "SIN_CUENTA")
        return (
            <div className="CuentaTienda">
                <p>Tu usuario no tiene cuenta en esta tienda</p>
                <div className="cuenta-botones">{cerrarSesion}</div>
            </div>
        );

    if (estado === "ERROR" || !cuenta)
        return (
            <div className="CuentaTienda">
                <p role="alert" className="cuenta-error">
                    No se ha podido cargar tu cuenta
                </p>
                <div className="cuenta-botones">
                    <button type="button" onClick={() => emitir("reintentar")}>
                        Reintentar
                    </button>
                    {cerrarSesion}
                </div>
            </div>
        );

    return (
        <div className="CuentaTienda">
            <h1>Mi cuenta</h1>
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

            <section>
                <h2>Direcciones</h2>
                <ul className="cuenta-lista">
                    {cuenta.direcciones.map((d) => (
                        <li key={d.id}>
                            <span>{textoDireccion(d)}</span>
                            <span>{etiquetasDireccion(d).join(" · ")}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
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
                                <th>Total</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <Link to={`/mi-cuenta/pedido/${p.id}`}>{p.codigo}</Link>
                                    </td>
                                    <td>{p.fecha}</td>
                                    <td>{formatearPrecio(p.total, p.divisa, idioma)}</td>
                                    <td>{p.servido}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {hayMas(pedidos.length, total) && (
                    <button type="button" onClick={() => emitir("ver_mas")}>
                        Ver más
                    </button>
                )}
            </section>

            <div className="cuenta-botones">{cerrarSesion}</div>
        </div>
    );
};

export const MiCuenta = () => (
    <ConStoreView>{(sv) => <ContenidoMiCuenta idioma={sv.idioma} />}</ConStoreView>
);
