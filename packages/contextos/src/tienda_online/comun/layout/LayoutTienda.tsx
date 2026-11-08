import { ContextoError, Intentar, QError } from "@olula/lib/contexto.ts";
import { useCallback, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { esRutaCheckout } from "../dominio.ts";
import { CabeceraCheckoutTienda } from "./cabecera_checkout_tienda.tsx";
import { CabeceraTienda } from "./cabecera_tienda.tsx";
import { DialogoErrorTienda } from "./dialogo_error_tienda.tsx";
import { PieTienda } from "./pie_tienda.tsx";
import { useHueco } from "./usar_hueco.ts";
import "./layout_tienda.css";

const SinAviso = () => null;

export const LayoutTienda = () => {
    const { pathname } = useLocation();
    const [error, setError] = useState<QError | null>(null);
    const Aviso = useHueco("layout_aviso", SinAviso);
    const Pie = useHueco("layout_pie", PieTienda);

    const intentar: Intentar = useCallback(async (f, onError) => {
        try {
            return await f();
        } catch (e) {
            const apiError = e as QError;
            const errorJS = e as Error;
            setError({
                nombre: apiError.nombre ?? "Error",
                descripcion: apiError.descripcion ?? errorJS.message,
            });
            if (onError) {
                onError(e);
            }
            throw e;
        }
    }, []);

    const checkout = esRutaCheckout(pathname);

    return (
        <ContextoError.Provider value={{ error, setError, intentar }}>
            <div className="layout-tienda">
                {checkout ? (
                    <CabeceraCheckoutTienda />
                ) : (
                    <>
                        <div className="layout-tienda-aviso">
                            <Aviso />
                        </div>
                        <CabeceraTienda />
                    </>
                )}
                <main>
                    <Outlet />
                </main>
                {!checkout && <Pie />}
            </div>
            {error && <DialogoErrorTienda error={error} onCerrar={() => setError(null)} />}
        </ContextoError.Provider>
    );
};
