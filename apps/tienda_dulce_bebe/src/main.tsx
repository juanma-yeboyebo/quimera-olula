import { crearAuthMiddleware } from "#/auth/middlewares.ts";
import { useTimerRefresco } from "#/auth/useTimerRefresco.ts";
import { InicioOlula } from "@olula/componentes/index.ts";
import { FactoryObj, FactoryProvider } from "@olula/lib/factory_ctx.tsx";
import { crearMenu, MenuContextFactory } from "@olula/lib/menu.ts";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router";
import { LayoutTienda } from "#/tienda_online/comun/layout/LayoutTienda.tsx";
import { iniciarCarrito } from "#/tienda_online/comun/carrito_store.ts";
import { codigoStoreViewDesdeEnv } from "#/tienda_online/comun/dominio.ts";
import { getStoreView } from "#/tienda_online/comun/infraestructura.ts";
import { fijarStoreViewActivo } from "#/tienda_online/comun/storeview.ts";
import FactoryTienda, { FactoryAuthTienda } from "./factory.ts";
import { router } from "./router_factory.ts";

const root = createRoot(document.getElementById("root")!);
const factory = new FactoryTienda();
const appFactory = factory as unknown as Record<string, Record<string, unknown>>;
const menuFactory = crearMenu(factory as unknown as Record<string, MenuContextFactory>);

const codigoStoreView = codigoStoreViewDesdeEnv(import.meta.env.VITE_STORE_VIEW);
if (codigoStoreView) {
    fijarStoreViewActivo(codigoStoreView);
    getStoreView(codigoStoreView)
        .then(() => iniciarCarrito(codigoStoreView))
        .catch(() => undefined);
}

const rutas = createBrowserRouter([
    {
        path: "/",
        middleware: [crearAuthMiddleware(FactoryAuthTienda.rutas_publicas)],
        Component: LayoutTienda,
        children: router as RouteObject[],
    },
]);

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
    useTimerRefresco({ rutas_publicas: FactoryAuthTienda.rutas_publicas });

    useEffect(() => {
        FactoryObj.setMenu(menuFactory);
        FactoryObj.setApp(appFactory);
    }, []);

    return (
        <>
            <RouterProvider router={rutas} />
            <InicioOlula />
        </>
    );
};

root.render(
    <StrictMode>
        <FactoryProvider>
            <App />
        </FactoryProvider>
    </StrictMode>
);
