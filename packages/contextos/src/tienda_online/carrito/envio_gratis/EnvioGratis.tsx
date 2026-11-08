import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { useContext } from "react";
import { formatearPrecio } from "../../comun/dominio.ts";
import { useStoreView } from "../../comun/usar_storeview.ts";
import { progresoEnvioGratis } from "../dominio.ts";
import "./EnvioGratis.css";

export const EnvioGratis = ({ total, divisa }: { total: number; divisa: string }) => {
    const { app } = useContext(FactoryCtx);
    const sv = useStoreView();
    const umbral = app.TiendaOnline?.envio_gratis_desde ?? null;

    if (umbral === null || umbral === undefined) return null;

    const idioma = sv.estado === "LISTO" ? sv.storeView.idioma : "es";
    const { falta, porcentaje } = progresoEnvioGratis(total, umbral);

    return (
        <div className="envio-gratis">
            <p>
                {falta > 0
                    ? `Te faltan ${formatearPrecio(falta, divisa, idioma)} para el envío gratis.`
                    : "Tienes envío gratis."}
            </p>
            <div className="envio-gratis-barra">
                <div className="envio-gratis-progreso" style={{ width: `${porcentaje}%` }} />
            </div>
        </div>
    );
};
