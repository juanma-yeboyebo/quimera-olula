import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { ReactNode, useContext, useEffect, useId, useRef, useState } from "react";
import { Link, Navigate } from "react-router";
import { BorrarLineaCarrito } from "../../carrito/borrar_linea/BorrarLineaCarrito.tsx";
import { CambiarCantidadLinea } from "../../carrito/cambiar_linea/CambiarCantidadLinea.tsx";
import { useEdicionCarrito } from "../../carrito/detalle/usar_edicion_carrito.ts";
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
import { useSeguirComprando } from "../../comun/seguir_comprando.ts";
import {
    CarritoTienda,
    FormaEnvioTienda,
    FormaPagoTienda,
    StoreView,
} from "../../comun/diseño.ts";
import { formatearPrecio } from "../../comun/dominio.ts";
import { CuentaTienda, PaisTienda } from "../../cuenta/diseño.ts";
import { DatosCheckout, ErroresCheckout } from "../diseño.ts";
import {
    ajustarFormas,
    datosCheckoutIniciales,
    direccionInicialCuenta,
    elegirFormaEnvio,
    esRecogida,
    lineasDireccionCuenta,
    TipoDireccionCheckout,
} from "../dominio.ts";
import { CamposDireccion } from "./campos_direccion.tsx";
import "./CheckoutTienda.css";
import { contextoCheckoutInicial } from "./detalle.ts";
import { ContextoCheckout, EstadoCheckout } from "./diseño.ts";
import { getMaquina } from "./maquina.ts";

const ID_FORMULARIO = "checkout-formulario";

type Forma = FormaPagoTienda | FormaEnvioTienda;

const Leyenda = ({ icono, texto }: { icono: string; texto: string }) => (
    <legend>
        <span className="checkout-leyenda-icono">
            <QIcono nombre={icono} tamaño="sm" />
        </span>
        <span className="checkout-leyenda-texto">{texto}</span>
    </legend>
);

const PASOS = ["Datos", "Revisión", "Pago"];

const pasoDe = (estado: EstadoCheckout): number =>
    estado === "DATOS" || estado === "GUARDANDO" ? 1 : estado === "REVISION" ? 2 : 3;

const PasosCheckout = ({ estado }: { estado: EstadoCheckout }) => {
    const actual = pasoDe(estado);
    return (
        <ol className="checkout-pasos">
            {PASOS.map((texto, i) => {
                const paso = i + 1;
                const clase = paso === actual ? "checkout-paso-activo" : paso < actual ? "checkout-paso-hecho" : "";
                return (
                    <li key={texto} className={clase} aria-current={paso === actual ? "step" : undefined}>
                        <span className="checkout-paso-numero">
                            {paso < actual ? <QIcono nombre="check" tamaño="sm" /> : paso}
                        </span>
                        {texto}
                    </li>
                );
            })}
        </ol>
    );
};

const TextoForma = ({ forma }: { forma: Forma }) => (
    <span className="checkout-forma-texto">
        <span className="checkout-forma-nombre">
            <strong>{forma.nombre}</strong>
            {forma.tipo === "RECOGIDA" && <span className="checkout-forma-coste">Sin coste</span>}
        </span>
        {forma.descripcion && (
            <span className="checkout-forma-descripcion">{forma.descripcion}</span>
        )}
    </span>
);

const SelectorForma = <F extends Forma>({
    titulo,
    icono,
    nombre,
    formas,
    seleccionada,
    deshabilitado,
    onElegir,
    children,
}: {
    titulo: string;
    icono: string;
    nombre: string;
    formas: F[];
    seleccionada: number | null;
    deshabilitado: boolean;
    onElegir: (forma: F) => void;
    children?: ReactNode;
}) => {
    if (formas.length === 0) return null;
    return (
        <fieldset>
            <Leyenda icono={icono} texto={titulo} />
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
            {children}
        </fieldset>
    );
};

const SelectorDireccion = ({
    tipo,
    cuenta,
    idElegida,
    direccion,
    paises,
    errores,
    deshabilitado,
    emitir,
    onCambiar,
}: {
    tipo: TipoDireccionCheckout;
    cuenta: CuentaTienda | null;
    idElegida: string | null;
    direccion: DatosCheckout["direccionFacturacion"];
    paises: PaisTienda[];
    errores: ErroresCheckout;
    deshabilitado: boolean;
    emitir: (evento: string, payload?: unknown) => void;
    onCambiar: (direccion: DatosCheckout["direccionFacturacion"]) => void;
}) => {
    const prefijo = tipo === "envio" ? "direccionEnvio" : "direccionFacturacion";
    const campos = (
        <CamposDireccion
            prefijo={prefijo}
            direccion={direccion}
            paises={paises}
            errores={errores}
            deshabilitado={deshabilitado}
            onCambiar={onCambiar}
        />
    );
    if (!cuenta || cuenta.direcciones.length === 0) return campos;

    const usandoOtra = idElegida === null;
    const elegir = (id: string | null) => emitir("direccion_elegida", { tipo, id });

    return (
        <>
            {!usandoOtra && (
                <div className="ancho checkout-direcciones">
                    {cuenta.direcciones.map((d) => (
                        <label
                            key={d.id}
                            className={`checkout-forma${d.id === idElegida ? " checkout-forma-marcada" : ""}`}
                        >
                            <input
                                type="radio"
                                name={`direccion_${tipo}`}
                                checked={d.id === idElegida}
                                disabled={deshabilitado}
                                onChange={() => elegir(d.id)}
                            />
                            <span className="checkout-forma-texto checkout-direccion-texto">
                                {lineasDireccionCuenta(d, paises).map((linea, i) =>
                                    i === 0 ? <strong key={i}>{linea}</strong> : <span key={i}>{linea}</span>,
                                )}
                            </span>
                        </label>
                    ))}
                </div>
            )}
            <div className="ancho">
                <BotonTienda
                    variante="enlace"
                    deshabilitado={deshabilitado}
                    onClick={() => elegir(usandoOtra ? (direccionInicialCuenta(cuenta, tipo)?.id ?? null) : null)}
                >
                    {usandoOtra ? "Elegir una de mis direcciones" : "Usar otra dirección"}
                </BotonTienda>
            </div>
            {usandoOtra && campos}
        </>
    );
};

const CampoDedicatoria = ({
    valor,
    deshabilitado,
    onCambiar,
}: {
    valor: string;
    deshabilitado: boolean;
    onCambiar: (valor: string) => void;
}) => {
    const id = useId();
    return (
        <fieldset>
            <Leyenda icono="editar" texto="Dedicatoria" />
            <div className="campo-formulario">
                <label htmlFor={id}>Dedicatoria (opcional)</label>
                <span className="campo-formulario-control">
                    <textarea
                        id={id}
                        rows={3}
                        value={valor}
                        disabled={deshabilitado}
                        onChange={(e) => onCambiar(e.target.value)}
                    />
                </span>
            </div>
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
            {datos.dedicatoria && (
                <>
                    <dt>Dedicatoria</dt>
                    <dd>{datos.dedicatoria}</dd>
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

interface EdicionResumen {
    publicar: (evento: string, payload?: unknown) => void | Promise<void>;
    deshabilitado: boolean;
    error: string | null;
    seguir: { ruta: string; texto: string };
}

const ResumenCarrito = ({
    carrito,
    idioma,
    acciones,
    edicion,
}: {
    carrito: CarritoTienda;
    idioma: string;
    acciones?: ReactNode;
    edicion?: EdicionResumen;
}) => (
    <aside className="checkout-resumen">
        <h2>Resumen</h2>
        {edicion?.error && (
            <p role="alert" className="checkout-error">
                {edicion.error}
            </p>
        )}
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
                    <div className="checkout-linea-datos">
                        <span className="checkout-linea-descripcion">{l.descripcion}</span>
                        {edicion && (
                            <div className="checkout-linea-acciones">
                                <CambiarCantidadLinea
                                    linea={l}
                                    deshabilitado={edicion.deshabilitado}
                                    onCambiar={(cantidad) =>
                                        edicion.publicar("cantidad_cambiada", { lineaId: l.id, cantidad })
                                    }
                                />
                                <BorrarLineaCarrito
                                    linea={l}
                                    deshabilitado={edicion.deshabilitado}
                                    onBorrar={() => edicion.publicar("linea_borrada", { lineaId: l.id })}
                                />
                            </div>
                        )}
                    </div>
                    <span>{formatearPrecio(l.importe, carrito.divisa, idioma)}</span>
                </li>
            ))}
        </ul>
        {edicion && (
            <Link className="checkout-seguir" to={edicion.seguir.ruta}>
                {edicion.seguir.texto}
            </Link>
        )}
        <dl className="checkout-totales">
            <dt className="checkout-total">Total</dt>
            <dd className="checkout-total">
                {formatearPrecio(carrito.total, carrito.divisa, idioma)}
            </dd>
            <dd className="checkout-iva-incluido">
                IVA incluido ({formatearPrecio(carrito.totalIva, carrito.divisa, idioma)})
            </dd>
        </dl>
        {acciones && <div className="checkout-acciones checkout-acciones-resumen">{acciones}</div>}
    </aside>
);

const FormularioCheckout = ({ storeView }: { storeView: StoreView }) => {
    const { idioma } = storeView;
    const carrito = useCarritoTienda();
    const seguir = useSeguirComprando();
    const { app } = useContext(FactoryCtx);
    const conDedicatoria = app.TiendaOnline?.checkout_dedicatoria === true;
    const formasEnvio = carrito?.formasEnvioDisponibles ?? [];
    const formasPago = carrito?.formasPagoDisponibles ?? [];
    const { ctx, emitir } = useMaquina(
        getMaquina,
        contextoCheckoutInicial(
            datosCheckoutIniciales(
                obtenerCarrito(),
                obtenerCarrito()?.formasEnvioDisponibles,
                obtenerCarrito()?.formasPagoDisponibles,
                conDedicatoria,
            ),
        ),
    );
    const { estado, datos, errores, error, cuenta, paises, cuentaCargada } = ctx;
    const edicionCarrito = useEdicionCarrito();

    useEffect(() => {
        emitir("cargar_cuenta");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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

    useEffect(() => {
        if (!carrito || estado !== "DATOS") return;
        const ajustados = ajustarFormas(datos, formasEnvio, formasPago);
        if (ajustados !== datos) emitir("datos_cambiados", ajustados);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [carrito]);
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
    const sinCarrito = !carrito && <Link to={seguir.ruta}>{seguir.texto}</Link>;

    const editandoCarrito = edicionCarrito.bloqueado || edicionCarrito.ctx.estado === "ACTUALIZANDO";

    const resumen = (acciones: ReactNode, editable = false) =>
        carrito && (
            <ResumenCarrito
                carrito={carrito}
                idioma={idioma}
                acciones={acciones}
                edicion={
                    editable
                        ? {
                              publicar: edicionCarrito.publicar,
                              deshabilitado: ocupado || editandoCarrito,
                              error: edicionCarrito.ctx.error,
                              seguir,
                          }
                        : undefined
                }
            />
        );

    const botonContinuar = (
        <BotonTienda tipo="submit" formulario={ID_FORMULARIO} ancho deshabilitado={ocupado || editandoCarrito || !cuentaCargada}>
            Revisar pedido
        </BotonTienda>
    );

    const botonTerminar = sinPasarela ? (
        <BotonTienda ancho deshabilitado={ocupado || !carrito} onClick={() => lanzar("confirmar")}>
            Confirmar pedido
        </BotonTienda>
    ) : (
        <BotonTienda ancho deshabilitado={ocupado || !carrito} onClick={() => lanzar("pagar")}>
            {carrito ? `Pagar ${formatearPrecio(carrito.total, carrito.divisa, idioma)}` : "Pagar"}
        </BotonTienda>
    );

    if (carrito && estaVacio(carrito)) return <Navigate to="/carrito" replace />;

    if (editando && !cuentaCargada)
        return (
            <div className="CheckoutTienda">
                <div className="checkout-contenedor contenedor-tienda">
                    <p role="status">Cargando…</p>
                </div>
            </div>
        );

    if (editando)
        return (
            <div className="CheckoutTienda">
                <div className="checkout-contenedor contenedor-tienda">
                    <div className="checkout-rejilla">
                        <form
                            id={ID_FORMULARIO}
                            noValidate
                            onSubmit={(e) => {
                                e.preventDefault();
                                lanzar("continuar");
                            }}
                        >
                            <h1>Datos del pedido</h1>
                            <PasosCheckout estado={estado} />
                            {mensajeError}
                            {sinCarrito}
                            <fieldset>
                                <Leyenda icono="usuario" texto="Contacto" />
                                <div className="ancho">
                                    {cuenta ? (
                                        <p className="checkout-email-cuenta">
                                            <span>Email</span> {datos.email}
                                        </p>
                                    ) : (
                                        <CampoFormulario
                                            etiqueta="Email"
                                            tipo="email"
                                            autocompletar="email"
                                            valor={datos.email}
                                            obligatorio
                                            error={errores.email}
                                            deshabilitado={ocupado}
                                            onCambiar={(email) => cambiar({ email })}
                                        />
                                    )}
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
                                <Leyenda icono="menu_fiscalidad" texto="Facturación" />
                                <CampoFormulario
                                    etiqueta="Nombre"
                                    autocompletar="name"
                                    valor={datos.nombre}
                                    obligatorio
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
                                <SelectorDireccion
                                    tipo="facturacion"
                                    cuenta={cuenta}
                                    idElegida={ctx.idDireccionFacturacion}
                                    direccion={datos.direccionFacturacion}
                                    paises={paises}
                                    errores={errores}
                                    deshabilitado={ocupado}
                                    emitir={emitir}
                                    onCambiar={(direccionFacturacion) =>
                                        cambiar({ direccionFacturacion })
                                    }
                                />
                            </fieldset>
                            <SelectorForma
                                titulo="Envío"
                                icono="menu_compras"
                                nombre="forma_envio"
                                formas={formasEnvio}
                                seleccionada={datos.idFormaEnvio}
                                deshabilitado={ocupado}
                                onElegir={(forma) =>
                                    emitir("datos_cambiados", elegirFormaEnvio(datos, forma))
                                }
                            >
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
                            </SelectorForma>
                            {!recogida && datos.envioDistinto && (
                                <fieldset>
                                    <Leyenda icono="casa" texto="Dirección de envío" />
                                    <SelectorDireccion
                                        tipo="envio"
                                        cuenta={cuenta}
                                        idElegida={ctx.idDireccionEnvio}
                                        direccion={datos.direccionEnvio}
                                        paises={paises}
                                        errores={errores}
                                        deshabilitado={ocupado}
                                        emitir={emitir}
                                        onCambiar={(direccionEnvio) => cambiar({ direccionEnvio })}
                                    />
                                </fieldset>
                            )}
                            <SelectorForma
                                titulo="Pago"
                                icono="tarjeta"
                                nombre="forma_pago"
                                formas={formasPago}
                                seleccionada={datos.idFormaPago}
                                deshabilitado={ocupado}
                                onElegir={(forma) => cambiar({ idFormaPago: forma.id })}
                            />
                            {conDedicatoria && (
                                <CampoDedicatoria
                                    valor={datos.dedicatoria ?? ""}
                                    deshabilitado={ocupado}
                                    onCambiar={(dedicatoria) => cambiar({ dedicatoria })}
                                />
                            )}
                            <div className="checkout-acciones checkout-acciones-movil">{botonContinuar}</div>
                        </form>
                        {resumen(botonContinuar, estado === "DATOS")}
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
                        <PasosCheckout estado={estado} />
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
                            <div className="checkout-acciones checkout-acciones-movil">{botonTerminar}</div>
                        </div>
                    </div>
                    {resumen(botonTerminar)}
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
