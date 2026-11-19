import { beforeEach, describe, expect, test, vi } from "vitest";
import { ContextoRegistro } from "#/tienda_online/cuenta/crear/diseño.ts";
import { DatosRegistro } from "#/tienda_online/cuenta/diseño.ts";

const postRegistro = vi.fn();
const iniciarSesion = vi.fn();

vi.mock("#/tienda_online/cuenta/infraestructura.ts", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    postRegistro: (body: unknown) => postRegistro(body),
}));

vi.mock("#/tienda_online/cuenta/sesion.ts", () => ({
    iniciarSesion: (email: string, password: string) => iniciarSesion(email, password),
}));

const { cambiarDatos, registrar, tocarCampo } = await import("#/tienda_online/cuenta/crear/crear.ts");
const { getMaquina } = await import("#/tienda_online/cuenta/crear/maquina.ts");

const datos: DatosRegistro = {
    email: "ana@example.com",
    password: "12345678",
    repetirPassword: "12345678",
    nombre: "Ana",
    idFiscal: "B12345678",
    telefono: null,
    direccion: {
        nombreVia: "Mayor",
        numero: null,
        codPostal: "28001",
        ciudad: "Madrid",
        provincia: null,
        paisId: "ES",
    },
};

const contexto = (d: DatosRegistro = datos): ContextoRegistro => ({
    estado: "REGISTRANDO",
    datos: d,
    errores: {},
    tocados: [],
    error: null,
    emailRepetido: false,
});

type Resultado = ContextoRegistro | [ContextoRegistro, unknown[]];
const ctxDe = (r: Resultado): ContextoRegistro => (Array.isArray(r) ? r[0] : r);

const errorApi = (estado: number, descripcion = "texto del backend") => ({
    nombre: "Error",
    descripcion,
    estado,
});

beforeEach(() => {
    postRegistro.mockReset();
    iniciarSesion.mockReset();
    iniciarSesion.mockResolvedValue(true);
});

describe("[cuenta-registro-02] Con errores no se envía", () => {
    test("cuenta_registro_02_vuelve_a_editando_con_errores_y_sin_llamar_a_la_api", async () => {
        const r = ctxDe(await registrar(contexto({ ...datos, email: "", nombre: "" })));

        expect(r.estado).toBe("EDITANDO");
        expect(r.errores.email).toBeTruthy();
        expect(r.errores.nombre).toBeTruthy();
        expect(postRegistro).not.toHaveBeenCalled();
        expect(iniciarSesion).not.toHaveBeenCalled();
    });
});

describe("[cuenta-registro-04] [EDITANDO] crear → REGISTRANDO → login", () => {
    test("cuenta_registro_04_la_maquina_pasa_por_registrando", () => {
        const transicion = getMaquina().EDITANDO.crear;

        expect(Array.isArray(transicion) && transicion[0]).toBe("REGISTRANDO");
    });

    test("cuenta_registro_04_envia_el_body_y_hace_login_con_el_mismo_email_y_password", async () => {
        postRegistro.mockResolvedValue(undefined);

        const r = ctxDe(await registrar(contexto()));

        expect(postRegistro).toHaveBeenCalledOnce();
        expect(postRegistro.mock.calls[0][0].id_fiscal).toBe("B12345678");
        expect(postRegistro.mock.calls[0][0]).not.toHaveProperty("repetirPassword");
        expect(iniciarSesion).toHaveBeenCalledWith("ana@example.com", "12345678");
        expect(r.estado).toBe("REGISTRADO");
    });
});

describe("[cuenta-registro-05] 409 → EDITANDO con aviso de email repetido", () => {
    test("cuenta_registro_05_409_marca_email_repetido_y_no_hace_login", async () => {
        postRegistro.mockRejectedValue(errorApi(409));

        const r = ctxDe(await registrar(contexto()));

        expect(r.estado).toBe("EDITANDO");
        expect(r.emailRepetido).toBe(true);
        expect(r.error).toBeNull();
        expect(iniciarSesion).not.toHaveBeenCalled();
    });
});

describe("[cuenta-registro-06] 400 y otros errores", () => {
    test("cuenta_registro_06_400_muestra_el_texto_del_backend", async () => {
        postRegistro.mockRejectedValue(errorApi(400, "NIF no válido"));

        const r = ctxDe(await registrar(contexto()));

        expect(r.estado).toBe("EDITANDO");
        expect(r.error).toBe("NIF no válido");
        expect(r.emailRepetido).toBe(false);
    });

    test("cuenta_registro_06_otro_error_muestra_el_mensaje_generico", async () => {
        postRegistro.mockRejectedValue(errorApi(500, "interno"));

        const r = ctxDe(await registrar(contexto()));

        expect(r.estado).toBe("EDITANDO");
        expect(r.error).toBe("No se ha podido crear la cuenta. Inténtalo de nuevo.");
    });
});

describe("[cuenta-registro-07] Registro correcto con login fallido", () => {
    test("cuenta_registro_07_pasa_a_registrado_sin_sesion", async () => {
        postRegistro.mockResolvedValue(undefined);
        iniciarSesion.mockResolvedValue(false);

        const r = ctxDe(await registrar(contexto()));

        expect(r.estado).toBe("REGISTRADO_SIN_SESION");
    });
});

describe("[cuenta-registro-08] Validación al salir de cada campo", () => {
    const editando = (d: DatosRegistro, tocados: string[] = []): ContextoRegistro => ({
        ...contexto(d),
        estado: "EDITANDO",
        tocados,
    });

    test("cuenta_registro_08_la_maquina_atiende_campo_tocado", () => {
        expect(getMaquina().EDITANDO.campo_tocado).toEqual([tocarCampo]);
    });

    test("cuenta_registro_08_al_salir_solo_muestra_el_error_de_ese_campo", async () => {
        const r = ctxDe(await tocarCampo(editando({ ...datos, email: "x", nombre: "" }), "email"));

        expect(r.tocados).toEqual(["email"]);
        expect(r.errores).toEqual({ email: "Introduce un email válido" });
    });

    test("cuenta_registro_08_al_escribir_en_un_campo_tocado_el_error_se_va_y_los_demas_siguen", async () => {
        const previo = editando({ ...datos, email: "x", nombre: "" }, ["email", "nombre"]);

        const r = ctxDe(await cambiarDatos(previo, { ...previo.datos, email: "ana@example.com" }));

        expect(r.errores).toEqual({ nombre: "El nombre es obligatorio" });
    });

    test("cuenta_registro_08_cambiar_la_contraseña_revalida_la_repeticion", async () => {
        const previo = editando(datos, ["password", "repetirPassword"]);

        const r = ctxDe(await cambiarDatos(previo, { ...datos, password: "otra-clave-1" }));

        expect(r.errores.repetirPassword).toBe("Las contraseñas no coinciden");
    });

    test("cuenta_registro_08_al_crear_quedan_tocados_todos_los_obligatorios", async () => {
        const r = ctxDe(await registrar(contexto({ ...datos, email: "" })));

        expect(r.tocados).toContain("email");
        expect(r.tocados).toContain("direccion.paisId");
    });
});
