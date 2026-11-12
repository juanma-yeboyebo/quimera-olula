import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { useEffect } from "react";
import { useParams } from "react-router";
import { BotonTienda } from "#/tienda_online/comun/componentes/boton_tienda.tsx";
import { ConStoreView } from "#/tienda_online/comun/componentes/con_storeview.tsx";
import { contextoListaInicial } from "./lista.ts";
import "./ListaRegalosTienda.css";
import { getMaquina } from "./maquina.ts";
import { TarjetaLineaLista } from "./tarjeta_linea_lista.tsx";

const ContenidoLista = () => {
    const { token = "" } = useParams();
    const { ctx, emitir } = useMaquina(getMaquina, contextoListaInicial);
    const { estado, lista } = ctx;

    useEffect(() => {
        emitir("token_cambiado", token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    if (estado === "CARGANDO")
        return (
            <div className="ListaRegalosTienda contenedor-tienda-ancho">
                <div className="lista-regalos-rejilla" aria-busy="true">
                    {Array.from({ length: 8 }, (_, i) => (
                        <div key={i} className="lista-regalos-esqueleto" />
                    ))}
                </div>
            </div>
        );

    if (estado === "NO_ENCONTRADA")
        return (
            <div className="ListaRegalosTienda contenedor-tienda-ancho" role="alert">
                <p>Esta lista no existe o ya no está disponible</p>
            </div>
        );

    if (estado === "ERROR" || !lista)
        return (
            <div className="ListaRegalosTienda contenedor-tienda-ancho">
                <div role="alert" className="lista-regalos-error">
                    <p>No se ha podido cargar la lista</p>
                    <BotonTienda onClick={() => emitir("reintentar")}>Reintentar</BotonTienda>
                </div>
            </div>
        );

    return (
        <div className="ListaRegalosTienda contenedor-tienda-ancho">
            <header className="lista-regalos-cabecera">
                <h1>{lista.nombre}</h1>
                {lista.descripcion && <p>{lista.descripcion}</p>}
            </header>
            <div className="lista-regalos-rejilla">
                {lista.lineas.map((linea) => (
                    <TarjetaLineaLista key={linea.id} token={token} linea={linea} />
                ))}
            </div>
        </div>
    );
};

export const ListaRegalosTienda = () => (
    <ConStoreView>{() => <ContenidoLista />}</ConStoreView>
);
