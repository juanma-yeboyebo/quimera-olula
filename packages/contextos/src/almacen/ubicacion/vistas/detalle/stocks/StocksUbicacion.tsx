import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MetaTabla } from "@olula/componentes/atomos/qtablacontrolada.tsx";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { useEffect, useState } from "react";
import { MoviStockUbicacion, StockUbicacionItem } from "../../../diseño.ts";
import { getStockUbicacion } from "../../../infraestructura.ts";

type ModoVista = "plana" | "cajas";

type GrupoCaja = {
    idCaja: string | null;
    caja: string | null;
    movimientos: MoviStockUbicacion[];
};

const agruparPorCaja = (movimientos: MoviStockUbicacion[]): GrupoCaja[] => {
    const mapa = new Map<string | null, GrupoCaja>();
    for (const m of movimientos) {
        const clave = m.idCaja;
        if (!mapa.has(clave)) {
            mapa.set(clave, { idCaja: m.idCaja, caja: m.caja, movimientos: [] });
        }
        mapa.get(clave)!.movimientos.push(m);
    }
    return Array.from(mapa.values());
};

const TablaMovimientosPlana = ({ movimientos }: { movimientos: MoviStockUbicacion[] }) => (
    <table>
        <thead>
            <tr>
                <th>Fecha/Hora</th>
                <th>Lote</th>
                <th>Caja</th>
                <th>Concepto</th>
                <th>Cantidad</th>
            </tr>
        </thead>
        <tbody>
            {movimientos.map((m) => (
                <tr key={m.id}>
                    <td>{m.fechaHora.toLocaleString("es-ES")}</td>
                    <td>{m.lote}</td>
                    <td>{m.caja ?? "Sin caja"}</td>
                    <td>{m.concepto}</td>
                    <td>{m.cantidad.toLocaleString("es-ES")}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

const MovimientosAgrupados = ({ movimientos }: { movimientos: MoviStockUbicacion[] }) => {
    const grupos = agruparPorCaja(movimientos);
    return (
        <div className="movimientos-agrupados">
            {grupos.map((grupo) => (
                <div key={grupo.idCaja ?? "__sin_caja"} className="grupo-caja">
                    <p className="grupo-caja-titulo">{grupo.caja ?? "Sin caja"}</p>
                    <TablaMovimientosPlana movimientos={grupo.movimientos} />
                </div>
            ))}
        </div>
    );
};

const ExpansionMovimientos = ({ entidad }: { entidad: StockUbicacionItem }) => {
    const [movimientos, setMovimientos] = useState<MoviStockUbicacion[]>([]);
    const [cargando, setCargando] = useState(true);
    const [modo, setModo] = useState<ModoVista>("plana");

    useEffect(() => {
        setCargando(true);
        getStockUbicacion(entidad.id)
            .then((stock) => setMovimientos(stock.movimientos))
            .finally(() => setCargando(false));
    }, [entidad.id]);

    if (cargando) return <p>Cargando movimientos...</p>;
    if (!movimientos.length) return <p>Sin movimientos</p>;

    return (
        <div className="ExpansionMovimientos">
            <div className="expansion-movimientos-barra">
                <QBoton
                    tamaño="pequeño"
                    variante={modo === "plana" ? "solido" : "borde"}
                    onClick={() => setModo("plana")}
                >
                    Lista plana
                </QBoton>
                <QBoton
                    tamaño="pequeño"
                    variante={modo === "cajas" ? "solido" : "borde"}
                    onClick={() => setModo("cajas")}
                >
                    Por cajas
                </QBoton>
            </div>
            {modo === "plana" ? (
                <TablaMovimientosPlana movimientos={movimientos} />
            ) : (
                <MovimientosAgrupados movimientos={movimientos} />
            )}
        </div>
    );
};

const metaTablaStocks: MetaTabla<StockUbicacionItem> = {
    cols: [
        { id: "articulo", cabecera: "Artículo" },
        { id: "cantidadFisica", cabecera: "Cantidad física", tipo: "numero" },
    ],
    expansion: ExpansionMovimientos,
};

export const StocksUbicacion = ({ stocks }: { stocks: StockUbicacionItem[] }) => {
    return (
        <ListadoSemiControlado
            metaTabla={metaTablaStocks}
            entidades={stocks}
            totalEntidades={stocks.length}
            cargando={false}
            seleccionada={null}
            onSeleccion={() => {}}
            criteriaInicial={criteriaDefecto}
            onCriteriaChanged={() => null}
            modo="tabla"
        />
    );
};
