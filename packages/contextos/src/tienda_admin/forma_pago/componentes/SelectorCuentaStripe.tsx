import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { useEffect, useState } from "react";
import { CuentaStripe } from "../diseño.ts";
import { opcionesCuentas } from "../dominio.ts";
import { getCuentasStripe } from "../infraestructura.ts";

export const useCuentasStripe = (): CuentaStripe[] | null => {
    const [cuentas, setCuentas] = useState<CuentaStripe[] | null>(null);

    useEffect(() => {
        getCuentasStripe().then(setCuentas).catch(() => setCuentas([]));
    }, []);

    return cuentas;
};

interface SelectorCuentaStripeProps {
    cuentas: CuentaStripe[];
    valor: string;
    onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const SelectorCuentaStripe = ({ cuentas, valor, onChange, ...props }: SelectorCuentaStripeProps) => (
    <QSelect
        {...props}
        label="Cuenta de Stripe"
        nombre="credencialId"
        valor={valor}
        opciones={opcionesCuentas(cuentas)}
        onChange={onChange}
    />
);
