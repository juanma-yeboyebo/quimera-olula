import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router";
import { estaVacio } from "../../carrito/dominio.ts";
import {
    obtenerCarrito,
    recargarCarrito,
    useCarritoTienda,
} from "../../comun/carrito_store.ts";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import { CarritoTienda } from "../../comun/diseño.ts";
import { formatearPrecio } from "../../comun/dominio.ts";
import { datosCheckoutIniciales } from "../dominio.ts";
import { CampoFormulario } from "./campo_formulario.tsx";
import { CamposDireccion } from "./campos_direccion.tsx";
import "./CheckoutTienda.css";
import { contextoCheckoutInicial } from "./detalle.ts";
import { ContextoCheckout } from "./diseño.ts";
import { getMaquina } from "./maquina.ts";

const ResumenDatos = ({ ctx }: { ctx: ContextoCheckout }) => {
    const { datos } = ctx;
    const direccion = (d: typeof datos.direccionFacturacion) =>
        [d.tipoVia, d.nombreVia, d.numero, d.otros, d.codPostal, d.ciudad, d.provincia, d.paisId]
            .filter((parte) => parte && parte.trim() !== "")
            .join(", ");

    return (
        <dl className="checkout-resumen-datos">
            <dt>Email</dt>
            <dd>{datos.email}</dd>
            <dt>Nombre</dt>
            <dd>{datos.nombre}</dd>
            {datos.idFiscal && (
                <>
                    <dt>NIF</dt>
                    <dd>{datos.idFiscal}</dd>
                </>
            )}
            {datos.telefono && (
                <>
                    <dt>Teléfono</dt>
                    <dd>{datos.telefono}</dd>
                </>
            )}
            <dt>Dirección de facturación</dt>
            <dd>{direccion(datos.direccionFacturacion)}</dd>
            <dt>Dirección de envío</dt>
            <dd>
                {datos.envioDistinto
                    ? direccion(datos.direccionEnvio)
                    : "La misma que la de facturación"}
            </dd>
        </dl>
    );
};

const ResumenCarrito = ({ carrito, idioma }: { carrito: CarritoTienda; idioma: string }) => (
    <>
        <ul className="checkout-resumen-lineas">
            {carrito.lineas.map((l) => (
                <li key={l.id}>
                    <span>
                        {l.cantidad} × {l.descripcion}
                    </span>
                    <span>{formatearPrecio(l.importe, carrito.divisa, idioma)}</span>
                </li>
            ))}
        </ul>
        <dl className="checkout-totales">
            <dt>Base imponible</dt>
            <dd>{formatearPrecio(carrito.neto, carrito.divisa, idioma)}</dd>
            <dt>IVA</dt>
            <dd>{formatearPrecio(carrito.totalIva, carrito.divisa, idioma)}</dd>
            <dt>Total</dt>
            <dd className="checkout-total">
                {formatearPrecio(carrito.total, carrito.divisa, idioma)}
            </dd>
        </dl>
    </>
);

const FormularioCheckout = ({ idioma }: { idioma: string }) => {
    const carrito = useCarritoTienda();
    const { ctx, emitir } = useMaquina(
        getMaquina,
        contextoCheckoutInicial(datosCheckoutIniciales(obtenerCarrito())),
    );
    const { estado, datos, errores, error } = ctx;
    const ocupado = estado === "GUARDANDO" || estado === "PAGANDO" || estado === "REDIRIGIENDO";
    const editando = estado === "DATOS" || estado === "GUARDANDO";

    const cambiar = (cambio: Partial<typeof datos>) => emitir("datos_cambiados", { ...datos, ...cambio });

    const mensajeError = error && (
        <p role="alert" className="checkout-error">
            {error}
        </p>
    );
    const sinCarrito = !carrito && <Link to="/catalogo">Ir al catálogo</Link>;

    if (editando)
        return (
            <form
                className="CheckoutTienda"
                noValidate
                onSubmit={(e) => {
                    e.preventDefault();
                    emitir("continuar");
                }}
            >
                <h1>Datos del pedido</h1>
                {mensajeError}
                {sinCarrito}
                <CampoFormulario
                    etiqueta="Email"
                    tipo="email"
                    valor={datos.email}
                    error={errores.email}
                    deshabilitado={ocupado}
                    onCambiar={(email) => cambiar({ email })}
                />
                <CampoFormulario
                    etiqueta="Nombre"
                    valor={datos.nombre}
                    error={errores.nombre}
                    deshabilitado={ocupado}
                    onCambiar={(nombre) => cambiar({ nombre })}
                />
                <CampoFormulario
                    etiqueta="NIF (opcional)"
                    valor={datos.idFiscal}
                    deshabilitado={ocupado}
                    onCambiar={(idFiscal) => cambiar({ idFiscal })}
                />
                <CampoFormulario
                    etiqueta="Teléfono (opcional)"
                    tipo="tel"
                    valor={datos.telefono}
                    deshabilitado={ocupado}
                    onCambiar={(telefono) => cambiar({ telefono })}
                />
                <fieldset>
                    <legend>Dirección de facturación</legend>
                    <CamposDireccion
                        prefijo="direccionFacturacion"
                        direccion={datos.direccionFacturacion}
                        errores={errores}
                        deshabilitado={ocupado}
                        onCambiar={(direccionFacturacion) => cambiar({ direccionFacturacion })}
                    />
                </fieldset>
                <label className="checkout-envio-distinto">
                    <input
                        type="checkbox"
                        checked={datos.envioDistinto}
                        disabled={ocupado}
                        onChange={(e) => cambiar({ envioDistinto: e.target.checked })}
                    />
                    Enviar a otra dirección
                </label>
                {datos.envioDistinto && (
                    <fieldset>
                        <legend>Dirección de envío</legend>
                        <CamposDireccion
                            prefijo="direccionEnvio"
                            direccion={datos.direccionEnvio}
                            errores={errores}
                            deshabilitado={ocupado}
                            onCambiar={(direccionEnvio) => cambiar({ direccionEnvio })}
                        />
                    </fieldset>
                )}
                <button type="submit" disabled={ocupado}>
                    Continuar
                </button>
            </form>
        );

    return (
        <div className="CheckoutTienda">
            <h1>Revisa tu pedido</h1>
            {mensajeError}
            {sinCarrito}
            {carrito && <ResumenCarrito carrito={carrito} idioma={idioma} />}
            <ResumenDatos ctx={ctx} />
            {ocupado && (
                <p role="status">
                    {estado === "REDIRIGIENDO" ? "Redirigiendo a la pasarela de pago…" : "Procesando…"}
                </p>
            )}
            <div className="checkout-botones">
                <button type="button" disabled={ocupado} onClick={() => emitir("volver")}>
                    Modificar datos
                </button>
                <button type="button" disabled={ocupado || !carrito} onClick={() => emitir("pagar")}>
                    Pagar
                </button>
            </div>
        </div>
    );
};

const ContenidoCheckout = ({ idioma }: { idioma: string }) => {
    const [vacio, setVacio] = useState<boolean | null>(null);

    useEffect(() => {
        let activo = true;
        recargarCarrito()
            .catch(() => undefined)
            .then(() => activo && setVacio(estaVacio(obtenerCarrito())));
        return () => {
            activo = false;
        };
    }, []);

    if (vacio === null) return <p>Cargando...</p>;
    if (vacio) return <Navigate to="/carrito" replace />;
    return <FormularioCheckout idioma={idioma} />;
};

export const CheckoutTienda = () => (
    <ConStoreView>{(sv) => <ContenidoCheckout idioma={sv.idioma} />}</ConStoreView>
);
