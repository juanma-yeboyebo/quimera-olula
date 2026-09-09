import { idFiscalCompraValido, tipoIdFiscalCompraValido } from "#/compras/comun/valores.ts";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos, MetaModelo } from "@olula/lib/dominio.ts";
import {
    accionesListaActivaEntidades,
    listaActivaEntidadesInicial,
    ProcesarListaActivaEntidades,
} from "@olula/lib/ListaActivaEntidades.ts";
import {
    accionesListaEntidades,
    listaEntidadesInicial,
    ProcesarListaEntidades,
} from "@olula/lib/ListaEntidades.ts";
import { ArticuloProveedor } from "../../articulo_proveedor/diseño.ts";
import { getArticulosDeProveedor } from "../../articulo_proveedor/infraestructura.ts";
import { CuentaBancoProveedor, DireccionProveedor, Proveedor } from "../diseño.ts";
import {
    asignarCuentaPago,
    getCuentasBancoProveedor,
    getDireccionesProveedor,
    getProveedor,
    marcarDireccionPrincipal,
    patchProveedor,
} from "../infraestructura.ts";
import { ContextoDetalleProveedor, EstadoDetalleProveedor } from "./diseño.ts";

type ProcesarDetalle = ProcesarContexto<EstadoDetalleProveedor, ContextoDetalleProveedor>;

const pipeProveedor = ejecutarListaProcesos<EstadoDetalleProveedor, ContextoDetalleProveedor>;

const conDirecciones = (fn: ProcesarListaEntidades<DireccionProveedor>) =>
    (ctx: ContextoDetalleProveedor) => ({ ...ctx, direcciones: fn(ctx.direcciones) });

const conCuentas = (fn: ProcesarListaEntidades<CuentaBancoProveedor>) =>
    (ctx: ContextoDetalleProveedor) => ({ ...ctx, cuentas: fn(ctx.cuentas) });

const conArticulos = (fn: ProcesarListaActivaEntidades<ArticuloProveedor>) =>
    (ctx: ContextoDetalleProveedor) => ({ ...ctx, articulos: fn(ctx.articulos) });

export const ArticulosProv = accionesListaActivaEntidades(conArticulos);

export const Direcciones = accionesListaEntidades(conDirecciones);
export const Cuentas = accionesListaEntidades(conCuentas);

export const metaProveedor: MetaModelo<Proveedor> = {
    campos: {
        nombre: { requerido: true },
        nombreComercial: {},
        tipoIdFiscal: {
            requerido: true,
            validacion: (proveedor) => tipoIdFiscalCompraValido(proveedor.tipoIdFiscal),
        },
        idFiscal: {
            requerido: true,
            validacion: (proveedor) =>
                idFiscalCompraValido(proveedor.tipoIdFiscal)(proveedor.idFiscal),
        },
        telefono1: { tipo: "telefono" },
        telefono2: { tipo: "telefono" },
        email: { tipo: "email" },
        web: { tipo: "url" },
        observaciones: { tipo: "texto" },
        fechaBaja: { tipo: "fecha" },
        subcuentaId: { tipo: "entero" },
        cuentaPago: { bloqueado: true },
        divisa: { bloqueado: true },
        serie: { bloqueado: true },
        formaPago: { bloqueado: true },
    },
};

export const proveedorVacio = (): Proveedor => ({
    id: '',
    nombre: '',
    nombreComercial: null,
    idFiscal: '',
    tipoIdFiscal: 'NIF',
    divisaId: null,
    serieId: null,
    grupoIvaNegocioId: '',
    formaPagoId: null,
    contactoId: null,
    telefono1: null,
    telefono2: null,
    email: null,
    web: null,
    observaciones: null,
    fechaBaja: null,
    deBaja: false,
    subcuentaCodigo: null,
    subcuentaId: null,
    cuentaPagoId: null,
    cuentaPago: null,
    formaPago: null,
    divisa: null,
    serie: null,
});

export const contextoDetalleProveedorInicial: ContextoDetalleProveedor = {
    estado: 'INICIAL',
    proveedor: proveedorVacio(),
    direcciones: listaEntidadesInicial<DireccionProveedor>(),
    cuentas: listaEntidadesInicial<CuentaBancoProveedor>(),
    articulos: listaActivaEntidadesInicial<ArticuloProveedor>(),
};

export const recargarArticulosProv: ProcesarDetalle = async (contexto, payload) => {
    const criteria = (payload as Criteria) ?? contexto.articulos.criteria;
    const resultado = await getArticulosDeProveedor(contexto.proveedor.id, criteria);

    return ArticulosProv.recargar(contexto, resultado);
};

export const ampliarArticulosProv: ProcesarDetalle = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getArticulosDeProveedor(contexto.proveedor.id, criteria);

    return ArticulosProv.ampliar(contexto, resultado);
};

export const refrescarProveedor: ProcesarDetalle = async (contexto) => {
    const proveedor = await getProveedor(contexto.proveedor.id);
    return [
        { ...contexto, proveedor },
        [["proveedor_cambiado", proveedor]],
    ];
};

export const refrescarDirecciones: ProcesarDetalle = async (contexto) => {
    const direcciones = await getDireccionesProveedor(contexto.proveedor.id);
    return Direcciones.recargar(contexto, { datos: direcciones, total: direcciones.length });
};

export const refrescarCuentas: ProcesarDetalle = async (contexto) => {
    const cuentas = await cuentasDelProveedor(contexto.proveedor.id);
    return Cuentas.recargar(contexto, { datos: cuentas, total: cuentas.length });
};

export const guardarProveedor = async (
    contexto: ContextoDetalleProveedor,
    proveedor: Proveedor
): Promise<void> => {
    const campos: (keyof Proveedor)[] = [
        "nombre",
        "nombreComercial",
        "idFiscal",
        "tipoIdFiscal",
        "divisaId",
        "serieId",
        "grupoIvaNegocioId",
        "formaPagoId",
        "contactoId",
        "telefono1",
        "telefono2",
        "email",
        "web",
        "observaciones",
        "fechaBaja",
        "subcuentaCodigo",
        "subcuentaId",
    ];

    const cambios = Object.fromEntries(
        campos
            .filter((campo) => proveedor[campo] !== contexto.proveedor[campo])
            .map((campo) => [campo, proveedor[campo]])
    );

    if (Object.keys(cambios).length === 0) return;

    await patchProveedor(proveedor.id, cambios);
};

export const darDeBajaProceso: ProcesarDetalle = async (contexto, payload) => {
    const fecha = (payload as Date | undefined) ?? new Date();
    await patchProveedor(contexto.proveedor.id, { deBaja: true, fechaBaja: fecha });
    return pipeProveedor(contexto, [refrescarProveedor]);
};

export const darDeAltaProceso: ProcesarDetalle = async (contexto) => {
    await patchProveedor(contexto.proveedor.id, { deBaja: false, fechaBaja: null });
    return pipeProveedor(contexto, [refrescarProveedor]);
};

const activarDireccionPorId = (id: string) => async (contexto: ContextoDetalleProveedor) => ({
    ...contexto,
    direcciones: {
        ...contexto.direcciones,
        activo: contexto.direcciones.lista.find((d) => d.id === id) ?? null,
    },
});

const activarCuentaPorId = (id: string) => async (contexto: ContextoDetalleProveedor) => ({
    ...contexto,
    cuentas: {
        ...contexto.cuentas,
        activo: contexto.cuentas.lista.find((c) => c.id === id) ?? null,
    },
});

const activarPorIndice = <T extends { id: string }>(lista: T[], indice: number): T | null =>
    lista.length > 0
        ? indice >= 0 && indice < lista.length
            ? lista[indice]
            : lista[lista.length - 1]
        : null;

export const onDireccionCreada: ProcesarDetalle = async (contexto, payload) => {
    const id = payload as string;
    return pipeProveedor(contexto, [refrescarDirecciones, activarDireccionPorId(id)]);
};

export const onDireccionCambiada: ProcesarDetalle = async (contexto, payload) => {
    const id = payload as string;
    return pipeProveedor(contexto, [refrescarDirecciones, activarDireccionPorId(id)]);
};

export const onDireccionBorrada: ProcesarDetalle = async (contexto, payload) => {
    const id = payload as string;
    const indice = contexto.direcciones.lista.findIndex((d) => d.id === id);
    return pipeProveedor(contexto, [
        refrescarDirecciones,
        async (ctx) => ({
            ...ctx,
            direcciones: {
                ...ctx.direcciones,
                activo: activarPorIndice(ctx.direcciones.lista, indice),
            },
        }),
    ]);
};

export const marcarPrincipalProceso: ProcesarDetalle = async (contexto) => {
    const direccion = contexto.direcciones.activo;
    if (!direccion) return contexto;

    await marcarDireccionPrincipal(contexto.proveedor.id, direccion.id);
    return pipeProveedor(contexto, [
        refrescarDirecciones,
        activarDireccionPorId(direccion.id),
    ]);
};

export const onCuentaCreada: ProcesarDetalle = async (contexto, payload) => {
    const id = payload as string;
    return pipeProveedor(contexto, [refrescarCuentas, activarCuentaPorId(id)]);
};

export const onCuentaCambiada: ProcesarDetalle = async (contexto, payload) => {
    const id = payload as string;
    return pipeProveedor(contexto, [refrescarCuentas, activarCuentaPorId(id)]);
};

export const onCuentaBorrada: ProcesarDetalle = async (contexto, payload) => {
    const id = payload as string;
    const indice = contexto.cuentas.lista.findIndex((c) => c.id === id);
    return pipeProveedor(contexto, [
        refrescarCuentas,
        async (ctx) => ({
            ...ctx,
            cuentas: {
                ...ctx.cuentas,
                activo: activarPorIndice(ctx.cuentas.lista, indice),
            },
        }),
        refrescarProveedor,
    ]);
};

export const asignarCuentaPagoProceso: ProcesarDetalle = async (contexto) => {
    const cuenta = contexto.cuentas.activo;
    if (!cuenta) return contexto;

    await asignarCuentaPago(contexto.proveedor.id, cuenta.id);
    return pipeProveedor(contexto, [refrescarProveedor]);
};

export const desasignarCuentaPagoProceso: ProcesarDetalle = async (contexto) => {
    await asignarCuentaPago(contexto.proveedor.id, null);
    return pipeProveedor(contexto, [refrescarProveedor]);
};

const cuentasDelProveedor = (id: string) =>
    getCuentasBancoProveedor(id).catch(() => [] as CuentaBancoProveedor[]);

const articulosDelProveedor = (id: string, criteria: Criteria) =>
    getArticulosDeProveedor(id, criteria).catch(() => ({
        datos: [] as ArticuloProveedor[],
        total: 0,
    }));

const cargarProveedor: (_: string) => ProcesarDetalle = (idProveedor) => async (contexto) => {
    const [proveedor, direcciones, cuentas, articulos] = await Promise.all([
        getProveedor(idProveedor),
        getDireccionesProveedor(idProveedor),
        cuentasDelProveedor(idProveedor),
        articulosDelProveedor(idProveedor, contexto.articulos.criteria),
    ]);

    return pipeProveedor(contexto, [
        async (ctx) => ({
            ...ctx,
            proveedor,
            direcciones: {
                lista: direcciones,
                total: direcciones.length,
                activo: direcciones[0] ?? null,
            },
            cuentas: {
                lista: cuentas,
                total: cuentas.length,
                activo: cuentas[0] ?? null,
            },
            articulos: {
                ...ctx.articulos,
                lista: articulos.datos,
                total: articulos.total,
                activo: undefined,
            },
        }),
        'ABIERTO',
    ]);
};

export const limpiarContexto: ProcesarDetalle = async (contexto) => ({
    ...contexto,
    estado: 'INICIAL',
    proveedor: proveedorVacio(),
    direcciones: listaEntidadesInicial<DireccionProveedor>(),
    cuentas: listaEntidadesInicial<CuentaBancoProveedor>(),
    articulos: listaActivaEntidadesInicial<ArticuloProveedor>(),
});

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const idProveedor = payload as string;
    if (idProveedor) {
        return cargarProveedor(idProveedor)(contexto);
    }
    return limpiarContexto(contexto);
};
