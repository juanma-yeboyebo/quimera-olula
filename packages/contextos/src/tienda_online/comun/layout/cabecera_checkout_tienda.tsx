import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { LogoTienda } from "./logo_tienda.tsx";
import "./cabecera_checkout_tienda.css";

export const CabeceraCheckoutTienda = () => (
    <header className="cabecera-checkout-tienda">
        <LogoTienda />
        <span className="cabecera-checkout-seguro">
            <QIcono nombre="candado" tamaño="sm" />
            Pago seguro
        </span>
    </header>
);
