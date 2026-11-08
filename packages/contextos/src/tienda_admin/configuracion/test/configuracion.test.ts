import { describe, expect, test } from "vitest";
import {
    seccionesConfiguracion,
    TEXTO_CONFIGURACION_PROXIMAMENTE,
} from "#/tienda_admin/configuracion/maestro/ConfiguracionTiendaAdmin.tsx";

describe("[tienda_admin-configuracion-01] La configuración muestra sus secciones deshabilitadas", () => {
    test("tienda_admin_configuracion_01_las_cuatro_secciones_en_orden", () => {
        expect(seccionesConfiguracion.map((s) => s.titulo)).toEqual([
            "Datos de la tienda",
            "Envío gratis",
            "Aviso superior",
            "Menú",
        ]);
    });

    test("tienda_admin_configuracion_01_cada_seccion_tiene_campos", () => {
        expect(seccionesConfiguracion.every((s) => s.campos.length > 0)).toBe(true);
    });

    test("tienda_admin_configuracion_01_texto_de_proximamente", () => {
        expect(TEXTO_CONFIGURACION_PROXIMAMENTE).toBe("Disponible próximamente");
    });
});
