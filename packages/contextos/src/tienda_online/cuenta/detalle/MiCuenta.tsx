import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { BotonTienda } from "../../comun/componentes/boton_tienda.tsx";
import { CampoFormulario } from "../../comun/componentes/campo_formulario.tsx";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import { formatearPrecio, hayMas } from "../../comun/dominio.ts";
import "../CuentaTienda.css";
import { CambioPassword, DatosCuenta, DireccionCuenta, DireccionRegistro } from "../diseño.ts";
import {
    direccionNuevaInicial,
    etiquetasDireccion,
    passwordNuevoInicial,
    textoDireccion,
} from "../dominio.ts";
import { CamposDireccionCuenta } from "./campos_direccion.tsx";
import { contextoCuentaInicial } from "./detalle.ts";
import { getMaquina } from "./maquina.ts";

type Formulario =
    | { tipo: "datos"; datos: DatosCuenta }
    | { tipo: "password"; password: CambioPassword }
    | { tipo: "direccion"; id: string | null; direccion: DireccionRegistro };

const aFormularioDireccion = (d: DireccionCuenta): Formulario => ({
    tipo: "direccion",
    id: d.id,
    direccion: {
        nombreVia: d.nombreVia,
        numero: d.numero,
        codPostal: d.codPostal,
        ciudad: d.ciudad,
        provincia: d.provincia,
        paisId: d.paisId,
    },
});

const ContenidoMiCuenta = ({ idioma }: { idioma: string }) => {
    const navigate = useNavigate();
    const { ctx, emitir } = useMaquina(getMaquina, contextoCuentaInicial);
    const { estado, cuenta, pedidos, total, errorPedidos, errorEdicion, erroresEdicion } = ctx;
    const [formulario, setFormulario] = useState<Formulario | null>(null);
    const [borrando, setBorrando] = useState<string | null>(null);
    const [guardando, setGuardando] = useState(false);
    const [guardado, setGuardado] = useState(false);
    const [passwordCambiado, setPasswordCambiado] = useState(false);

    useEffect(() => {
        if (!guardado) return;
        setGuardado(false);
        if (!errorEdicion && Object.keys(erroresEdicion).length === 0) {
            if (formulario?.tipo === "password") setPasswordCambiado(true);
            setFormulario(null);
            setBorrando(null);
        }
    }, [guardado, errorEdicion, erroresEdicion, formulario]);

    const guardar = async (evento: string, payload: unknown) => {
        setGuardando(true);
        try {
            await emitir(evento, payload);
            setGuardado(true);
        } finally {
            setGuardando(false);
        }
    };

    const abrir = (f: Formulario | null) => {
        setBorrando(null);
        setPasswordCambiado(false);
        setFormulario(f);
        emitir("cerrar_formulario");
    };

    const formularioDatos = formulario?.tipo === "datos" ? formulario : null;
    const formularioDireccion = formulario?.tipo === "direccion" ? formulario : null;
    const formularioPassword = formulario?.tipo === "password" ? formulario : null;

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
                <div className="cuenta-contenedor contenedor-tienda">
                    <p>Cargando...</p>
                </div>
            </div>
        );

    if (estado === "SIN_CUENTA")
        return (
            <div className="CuentaTienda">
                <div className="cuenta-contenedor contenedor-tienda">
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
                <div className="cuenta-contenedor contenedor-tienda">
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
            <div className="cuenta-contenedor contenedor-tienda">
                <h1>Mi cuenta</h1>
                <section className="cuenta-tarjeta">
                    <h2>Datos</h2>
                    {formularioDatos ? (
                        <form
                            className="cuenta-formulario"
                            noValidate
                            onSubmit={(e) => {
                                e.preventDefault();
                                guardar("guardar_datos", formularioDatos.datos);
                            }}
                        >
                            {errorEdicion && (
                                <p role="alert" className="cuenta-error">
                                    {errorEdicion}
                                </p>
                            )}
                            <p>
                                <span className="cuenta-suave">Email</span> {cuenta.email}
                            </p>
                            <fieldset>
                                <div className="ancho">
                                    <CampoFormulario
                                        etiqueta="Nombre"
                                        autocompletar="name"
                                        valor={formularioDatos.datos.nombre}
                                        error={erroresEdicion.nombre}
                                        deshabilitado={guardando}
                                        onCambiar={(nombre) =>
                                            setFormulario({
                                                ...formularioDatos,
                                                datos: { ...formularioDatos.datos, nombre },
                                            })
                                        }
                                    />
                                </div>
                                <CampoFormulario
                                    etiqueta="NIF/CIF"
                                    valor={formularioDatos.datos.idFiscal}
                                    error={erroresEdicion.idFiscal}
                                    deshabilitado={guardando}
                                    onCambiar={(idFiscal) =>
                                        setFormulario({
                                            ...formularioDatos,
                                            datos: { ...formularioDatos.datos, idFiscal },
                                        })
                                    }
                                />
                                <CampoFormulario
                                    etiqueta="Teléfono (opcional)"
                                    tipo="tel"
                                    autocompletar="tel"
                                    valor={formularioDatos.datos.telefono}
                                    deshabilitado={guardando}
                                    onCambiar={(telefono) =>
                                        setFormulario({
                                            ...formularioDatos,
                                            datos: { ...formularioDatos.datos, telefono },
                                        })
                                    }
                                />
                            </fieldset>
                            <div className="cuenta-botones">
                                <BotonTienda tipo="submit" deshabilitado={guardando}>
                                    Guardar
                                </BotonTienda>
                                <BotonTienda
                                    variante="secundario"
                                    deshabilitado={guardando}
                                    onClick={() => abrir(null)}
                                >
                                    Cancelar
                                </BotonTienda>
                            </div>
                        </form>
                    ) : (
                        <>
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
                            <div className="cuenta-botones">
                                <BotonTienda
                                    variante="enlace"
                                    deshabilitado={guardando}
                                    onClick={() =>
                                        abrir({
                                            tipo: "datos",
                                            datos: {
                                                nombre: cuenta.nombre,
                                                idFiscal: cuenta.idFiscal ?? "",
                                                telefono: cuenta.telefono,
                                            },
                                        })
                                    }
                                >
                                    Editar
                                </BotonTienda>
                            </div>
                        </>
                    )}
                </section>

                <section className="cuenta-tarjeta">
                    <h2>Direcciones</h2>
                    {errorEdicion && !formularioDatos && !formularioDireccion && !formularioPassword && (
                        <p role="alert" className="cuenta-error">
                            {errorEdicion}
                        </p>
                    )}
                    <ul className="cuenta-lista">
                        {cuenta.direcciones.map((d) => (
                            <li key={d.id}>
                                {formularioDireccion?.id === d.id ? null : (
                                    <>
                                        <span>{textoDireccion(d)}</span>
                                        <span className="cuenta-suave">
                                            {etiquetasDireccion(d).join(" · ")}
                                        </span>
                                        <div className="cuenta-botones cuenta-acciones">
                                            {borrando === d.id ? (
                                                <>
                                                    <span>¿Borrar esta dirección?</span>
                                                    <BotonTienda
                                                        variante="enlace"
                                                        deshabilitado={guardando}
                                                        onClick={() => guardar("borrar_direccion", d.id)}
                                                    >
                                                        Sí, borrar
                                                    </BotonTienda>
                                                    <BotonTienda
                                                        variante="enlace"
                                                        deshabilitado={guardando}
                                                        onClick={() => setBorrando(null)}
                                                    >
                                                        No
                                                    </BotonTienda>
                                                </>
                                            ) : (
                                                <>
                                                    <BotonTienda
                                                        variante="enlace"
                                                        deshabilitado={guardando}
                                                        onClick={() => abrir(aFormularioDireccion(d))}
                                                    >
                                                        Editar
                                                    </BotonTienda>
                                                    {!d.envio && (
                                                        <BotonTienda
                                                            variante="enlace"
                                                            deshabilitado={guardando}
                                                            onClick={() => guardar("marcar_envio", d.id)}
                                                        >
                                                            Usar para envío
                                                        </BotonTienda>
                                                    )}
                                                    {!d.facturacion && (
                                                        <BotonTienda
                                                            variante="enlace"
                                                            deshabilitado={guardando}
                                                            onClick={() => guardar("marcar_facturacion", d.id)}
                                                        >
                                                            Usar para facturación
                                                        </BotonTienda>
                                                    )}
                                                    {!d.facturacion && (
                                                        <BotonTienda
                                                            variante="enlace"
                                                            deshabilitado={guardando}
                                                            onClick={() => {
                                                                abrir(null);
                                                                setBorrando(d.id);
                                                            }}
                                                        >
                                                            Borrar
                                                        </BotonTienda>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                                {formularioDireccion?.id === d.id && (
                                    <FormularioDireccion
                                        formulario={formularioDireccion}
                                        errores={erroresEdicion}
                                        error={errorEdicion}
                                        guardando={guardando}
                                        onCambiar={setFormulario}
                                        onGuardar={() =>
                                            guardar("guardar_direccion", {
                                                id: formularioDireccion.id,
                                                direccion: formularioDireccion.direccion,
                                            })
                                        }
                                        onCancelar={() => abrir(null)}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                    {formularioDireccion && formularioDireccion.id === null ? (
                        <FormularioDireccion
                            formulario={formularioDireccion}
                            errores={erroresEdicion}
                            error={errorEdicion}
                            guardando={guardando}
                            onCambiar={setFormulario}
                            onGuardar={() =>
                                guardar("guardar_direccion", {
                                    id: null,
                                    direccion: formularioDireccion.direccion,
                                })
                            }
                            onCancelar={() => abrir(null)}
                        />
                    ) : (
                        <div className="cuenta-botones">
                            <BotonTienda
                                variante="secundario"
                                deshabilitado={guardando}
                                onClick={() =>
                                    abrir({
                                        tipo: "direccion",
                                        id: null,
                                        direccion: direccionNuevaInicial(),
                                    })
                                }
                            >
                                Añadir dirección
                            </BotonTienda>
                        </div>
                    )}
                </section>

                <section className="cuenta-tarjeta">
                    <h2>Contraseña</h2>
                    {formularioPassword ? (
                        <form
                            className="cuenta-formulario"
                            noValidate
                            onSubmit={(e) => {
                                e.preventDefault();
                                guardar("guardar_password", formularioPassword.password);
                            }}
                        >
                            {errorEdicion && (
                                <p role="alert" className="cuenta-error">
                                    {errorEdicion}
                                </p>
                            )}
                            <fieldset>
                                <CampoFormulario
                                    etiqueta="Contraseña actual"
                                    tipo="password"
                                    autocompletar="current-password"
                                    valor={formularioPassword.password.actual}
                                    error={erroresEdicion.actual}
                                    deshabilitado={guardando}
                                    onCambiar={(actual) =>
                                        setFormulario({
                                            ...formularioPassword,
                                            password: { ...formularioPassword.password, actual },
                                        })
                                    }
                                />
                                <CampoFormulario
                                    etiqueta="Nueva contraseña"
                                    tipo="password"
                                    autocompletar="new-password"
                                    valor={formularioPassword.password.nueva}
                                    error={erroresEdicion.nueva}
                                    deshabilitado={guardando}
                                    onCambiar={(nueva) =>
                                        setFormulario({
                                            ...formularioPassword,
                                            password: { ...formularioPassword.password, nueva },
                                        })
                                    }
                                />
                                <CampoFormulario
                                    etiqueta="Repite la nueva contraseña"
                                    tipo="password"
                                    autocompletar="new-password"
                                    valor={formularioPassword.password.repetir}
                                    error={erroresEdicion.repetir}
                                    deshabilitado={guardando}
                                    onCambiar={(repetir) =>
                                        setFormulario({
                                            ...formularioPassword,
                                            password: { ...formularioPassword.password, repetir },
                                        })
                                    }
                                />
                            </fieldset>
                            <div className="cuenta-botones">
                                <BotonTienda tipo="submit" deshabilitado={guardando}>
                                    Guardar
                                </BotonTienda>
                                <BotonTienda
                                    variante="secundario"
                                    deshabilitado={guardando}
                                    onClick={() => abrir(null)}
                                >
                                    Cancelar
                                </BotonTienda>
                            </div>
                        </form>
                    ) : (
                        <>
                            {passwordCambiado && <p role="status">Contraseña cambiada</p>}
                            <div className="cuenta-botones">
                                <BotonTienda
                                    variante="secundario"
                                    deshabilitado={guardando}
                                    onClick={() =>
                                        abrir({ tipo: "password", password: passwordNuevoInicial() })
                                    }
                                >
                                    Cambiar contraseña
                                </BotonTienda>
                            </div>
                        </>
                    )}
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

const FormularioDireccion = ({
    formulario,
    errores,
    error,
    guardando,
    onCambiar,
    onGuardar,
    onCancelar,
}: {
    formulario: Extract<Formulario, { tipo: "direccion" }>;
    errores: Record<string, string>;
    error: string | null;
    guardando: boolean;
    onCambiar: (formulario: Formulario) => void;
    onGuardar: () => void;
    onCancelar: () => void;
}) => (
    <form
        className="cuenta-formulario"
        noValidate
        onSubmit={(e) => {
            e.preventDefault();
            onGuardar();
        }}
    >
        {error && (
            <p role="alert" className="cuenta-error">
                {error}
            </p>
        )}
        <fieldset>
            <CamposDireccionCuenta
                direccion={formulario.direccion}
                errores={errores}
                deshabilitado={guardando}
                onCambiar={(direccion) => onCambiar({ ...formulario, direccion })}
            />
        </fieldset>
        <div className="cuenta-botones">
            <BotonTienda tipo="submit" deshabilitado={guardando}>
                Guardar
            </BotonTienda>
            <BotonTienda variante="secundario" deshabilitado={guardando} onClick={onCancelar}>
                Cancelar
            </BotonTienda>
        </div>
    </form>
);

export const MiCuenta = () => (
    <ConStoreView>{(sv) => <ContenidoMiCuenta idioma={sv.idioma} />}</ConStoreView>
);
