import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router";
import { estaVacio } from "../../carrito/dominio.ts";
import {
    obtenerCarrito,
    recargarCarrito,
    useCarritoTienda,
} from "../../comun/carrito_store.ts";
import { CampoFormulario } from "../../comun/componentes/campo_formulario.tsx";
import { BotonTienda } from "../../comun/componentes/boton_tienda.tsx";
import { DistintivoTienda } from "../../comun/componentes/distintivo_tienda.tsx";
import { SinImagen } from "../../comun/componentes/sin_imagen.tsx";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import {
    CarritoTienda,
    FormaEnvioTienda,
    FormaPagoTienda,
    StoreView,
} from "../../comun/diseño.ts";
import { formatearPrecio } from "../../comun/dominio.ts";
import { datosCheckoutIniciales, elegirFormaEnvio, esRecogida } from "../dominio.ts";
import { CamposDireccion } from "./campos_direccion.tsx";
import "./CheckoutTienda.css";
import { contextoCheckoutInicial } from "./detalle.ts";
import { ContextoCheckout } from "./diseño.ts";
import { getMaquina } from "./maquina.ts";

type Forma = FormaPagoTienda | FormaEnvioTienda;

const TextoForma = ({ forma }: { forma: Forma }) => (
    <span className="checkout-forma-texto">
        <strong>{forma.nombre}</strong>
        {forma.descripcion && (
            <span className="checkout-forma-descripcion">{forma.descripcion}</span>
        )}
    </span>
);

const SelectorForma = <F extends Forma>({
    titulo,
    nombre,
    formas,
    seleccionada,
    deshabilitado,
    onElegir,
}: {
    titulo: string;
    nombre: string;
    formas: F[];
    seleccionada: number | null;
    deshabilitado: boolean;
    onElegir: (forma: F) => void;
}) => {
    if (formas.length === 0) return null;
    return (
        <fieldset>
            <legend>{titulo}</legend>
            {formas.length === 1 ? (
                <div className="checkout-forma">
                    <TextoForma forma={formas[0]} />
                </div>
            ) : (
                formas.map((f) => (
                    <label
                        key={f.id}
                        className={`checkout-forma${f.id === seleccionada ? " checkout-forma-marcada" : ""}`}
                    >
                        <input
                            type="radio"
                            name={nombre}
                            checked={f.id === seleccionada}
                            disabled={deshabilitado}
                            onChange={() => onElegir(f)}
                        />
                        <TextoForma forma={f} />
                    </label>
                ))
            )}
        </fieldset>
    );
};

const ResumenDatos = ({
    ctx,
    formaEnvio,
}: {
    ctx: ContextoCheckout;
    formaEnvio: FormaEnvioTienda | undefined;
}) => {
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
            {formaEnvio && (
                <>
                    <dt>Envío</dt>
                    <dd>{formaEnvio.nombre}</dd>
                </>
            )}
            {formaEnvio?.tipo !== "RECOGIDA" && (
                <>
                    <dt>Dirección de envío</dt>
                    <dd>
                        {datos.envioDistinto
                            ? direccion(datos.direccionEnvio)
                            : "La misma que la de facturación"}
                    </dd>
                </>
            )}
        </dl>
    );
};

const ResumenCarrito = ({ carrito, idioma }: { carrito: CarritoTienda; idioma: string }) => (
    <aside className="checkout-resumen">
        <h2>Resumen</h2>
        <ul className="checkout-resumen-lineas">
            {carrito.lineas.map((l) => (
                <li key={l.id}>
                    <div className="checkout-linea-imagen">
                        {l.imagen ? (
                            <img src={l.imagen.url} alt={l.imagen.alt || l.descripcion} />
                        ) : (
                            <SinImagen />
                        )}
                        <span className="checkout-linea-cantidad">
                            <DistintivoTienda>{l.cantidad}</DistintivoTienda>
                        </span>
                    </div>
                    <span className="checkout-linea-descripcion">{l.descripcion}</span>
                    <span>{formatearPrecio(l.importe, carrito.divisa, idioma)}</span>
                </li>
            ))}
        </ul>
        <dl className="checkout-totales">
            <dt>Base imponible</dt>
            <dd>{formatearPrecio(carrito.neto, carrito.divisa, idioma)}</dd>
            <dt>IVA</dt>
            <dd>{formatearPrecio(carrito.totalIva, carrito.divisa, idioma)}</dd>
            <dt className="checkout-total">Total</dt>
            <dd className="checkout-total">
                {formatearPrecio(carrito.total, carrito.divisa, idioma)}
            </dd>
        </dl>
    </aside>
);

const FormularioCheckout = ({ storeView }: { storeView: StoreView }) => {
    const { idioma, formasEnvio, formasPago } = storeView;
    const carrito = useCarritoTienda();
    const { ctx, emitir } = useMaquina(
        getMaquina,
        contextoCheckoutInicial(
            datosCheckoutIniciales(obtenerCarrito(), formasEnvio, formasPago),
        ),
    );
    const { estado, datos, errores, error } = ctx;
    const enCurso = useRef(false);
    const [bloqueado, setBloqueado] = useState(false);
    const ocupado =
        bloqueado ||
        estado === "GUARDANDO" ||
        estado === "PAGANDO" ||
        estado === "REDIRIGIENDO" ||
        estado === "CONFIRMANDO" ||
        estado === "CONFIRMADO_OK";

    const lanzar = async (evento: string) => {
        if (enCurso.current) return;
        enCurso.current = true;
        setBloqueado(true);
        try {
            await emitir(evento);
        } finally {
            enCurso.current = false;
            setBloqueado(false);
        }
    };
    const editando = estado === "DATOS" || estado === "GUARDANDO";
    const recogida = esRecogida(datos.idFormaEnvio, formasEnvio);
    const formaEnvio = formasEnvio.find((f) => f.id === datos.idFormaEnvio);
    const formaPago = formasPago.find((f) => f.id === datos.idFormaPago);
    const sinPasarela = formaPago?.tipo === "SIN_PASARELA";

    const cambiar = (cambio: Partial<typeof datos>) => emitir("datos_cambiados", { ...datos, ...cambio });

    const mensajeError = error && (
        <p role="alert" className="checkout-error">
            {error}
        </p>
    );
    const sinCarrito = !carrito && <Link to="/catalogo">Ir al catálogo</Link>;

    const resumen = carrito && <ResumenCarrito carrito={carrito} idioma={idioma} />;

    if (editando)
        return (
            <div className="CheckoutTienda">
                <div className="checkout-contenedor contenedor-tienda">
                    <div className="checkout-rejilla">
                        <form
                            noValidate
                            onSubmit={(e) => {
                                e.preventDefault();
                                lanzar("continuar");
                            }}
                        >
                            <h1>Datos del pedido</h1>
                            {mensajeError}
                            {sinCarrito}
                            <fieldset>
                                <legend>Contacto</legend>
                                <div className="ancho">
                                    <CampoFormulario
                                        etiqueta="Email"
                                        tipo="email"
                                        autocompletar="email"
                                        valor={datos.email}
                                        error={errores.email}
                                        deshabilitado={ocupado}
                                        onCambiar={(email) => cambiar({ email })}
                                    />
                                </div>
                                <CampoFormulario
                                    etiqueta="Teléfono (opcional)"
                                    tipo="tel"
                                    autocompletar="tel"
                                    valor={datos.telefono}
                                    deshabilitado={ocupado}
                                    onCambiar={(telefono) => cambiar({ telefono })}
                                />
                            </fieldset>
                            <fieldset>
                                <legend>Facturación</legend>
                                <CampoFormulario
                                    etiqueta="Nombre"
                                    autocompletar="name"
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
                                <CamposDireccion
                                    prefijo="direccionFacturacion"
                                    direccion={datos.direccionFacturacion}
                                    errores={errores}
                                    deshabilitado={ocupado}
                                    onCambiar={(direccionFacturacion) =>
                                        cambiar({ direccionFacturacion })
                                    }
                                />
                            </fieldset>
                            <SelectorForma
                                titulo="Envío"
                                nombre="forma_envio"
                                formas={formasEnvio}
                                seleccionada={datos.idFormaEnvio}
                                deshabilitado={ocupado}
                                onElegir={(forma) =>
                                    emitir("datos_cambiados", elegirFormaEnvio(datos, forma))
                                }
                            />
                            {!recogida && (
                                <label className="checkout-envio-distinto">
                                    <input
                                        type="checkbox"
                                        checked={datos.envioDistinto}
                                        disabled={ocupado}
                                        onChange={(e) => cambiar({ envioDistinto: e.target.checked })}
                                    />
                                    Enviar a otra dirección
                                </label>
                            )}
                            {!recogida && datos.envioDistinto && (
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
                            <SelectorForma
                                titulo="Pago"
                                nombre="forma_pago"
                                formas={formasPago}
                                seleccionada={datos.idFormaPago}
                                deshabilitado={ocupado}
                                onElegir={(forma) => cambiar({ idFormaPago: forma.id })}
                            />
                            <BotonTienda tipo="submit" ancho deshabilitado={ocupado}>
                                Continuar
                            </BotonTienda>
                        </form>
                        {resumen}
                    </div>
                </div>
            </div>
        );

    return (
        <div className="CheckoutTienda">
            <div className="checkout-contenedor contenedor-tienda">
                <div className="checkout-rejilla">
                    <div className="checkout-revision">
                        <h1>Revisa tu pedido</h1>
                        {mensajeError}
                        {sinCarrito}
                        <ResumenDatos ctx={ctx} formaEnvio={formaEnvio} />
                        <section className="checkout-pago">
                            <h2>Pago</h2>
                            {formaPago && sinPasarela ? (
                                <TextoForma forma={formaPago} />
                            ) : (
                                <p>
                                    Al pulsar «Pagar» irás a la página segura de la pasarela para
                                    introducir la tarjeta. Después volverás aquí.
                                </p>
                            )}
                        </section>
                        {ocupado && (
                            <p role="status">
                                {estado === "REDIRIGIENDO"
                                    ? "Redirigiendo a la pasarela de pago…"
                                    : "Procesando…"}
                            </p>
                        )}
                        <div className="checkout-botones">
                            <BotonTienda
                                variante="secundario"
                                deshabilitado={ocupado}
                                onClick={() => emitir("volver")}
                            >
                                Modificar datos
                            </BotonTienda>
                            {sinPasarela ? (
                                <BotonTienda
                                    ancho
                                    deshabilitado={ocupado || !carrito}
                                    onClick={() => lanzar("confirmar")}
                                >
                                    Confirmar pedido
                                </BotonTienda>
                            ) : (
                                <BotonTienda
                                    ancho
                                    deshabilitado={ocupado || !carrito}
                                    onClick={() => lanzar("pagar")}
                                >
                                    {carrito
                                        ? `Pagar ${formatearPrecio(carrito.total, carrito.divisa, idioma)}`
                                        : "Pagar"}
                                </BotonTienda>
                            )}
                        </div>
                    </div>
                    {resumen}
                </div>
            </div>
        </div>
    );
};

const ContenidoCheckout = ({ storeView }: { storeView: StoreView }) => {
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
    return <FormularioCheckout storeView={storeView} />;
};

export const CheckoutTienda = () => (
    <ConStoreView>{(sv) => <ContenidoCheckout storeView={sv} />}</ConStoreView>
);
