import { useState } from "react";
import { BotonIcono } from "../componentes/boton_icono.tsx";
import { BotonTienda } from "../componentes/boton_tienda.tsx";
import { CampoFormulario } from "../componentes/campo_formulario.tsx";
import { DistintivoTienda } from "../componentes/distintivo_tienda.tsx";
import { ImagenProducto } from "../componentes/imagen_producto.tsx";
import { PrecioTienda } from "../componentes/precio_tienda.tsx";
import { SelectorCantidad } from "../componentes/selector_cantidad.tsx";
import "./pagina_estilos.css";

const colores = [
    "fondo",
    "superficie",
    "superficie-hundida",
    "texto",
    "texto-suave",
    "borde",
    "borde-fuerte",
    "accion",
    "accion-hover",
    "accion-texto",
    "precio",
    "oferta",
    "exito",
    "error",
    "aviso-fondo",
    "aviso-texto",
    "distintivo-fondo",
    "distintivo-texto",
];

const textos = ["xs", "sm", "md", "lg", "xl", "xxl"];

export const PaginaEstilos = () => {
    const [cantidad, setCantidad] = useState(1);
    const [campo, setCampo] = useState("");

    return (
        <div className="pagina-estilos">
            <h1>Estilos</h1>

            <section>
                <h2>Colores</h2>
                <div className="pagina-estilos-colores">
                    {colores.map((c) => (
                        <div key={c} className="pagina-estilos-color">
                            <span style={{ backgroundColor: `var(--tienda-color-${c})` }} />
                            {c}
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2>Tipografía</h2>
                {textos.map((t) => (
                    <p key={t} style={{ fontSize: `var(--tienda-texto-${t})` }}>
                        Texto {t}
                    </p>
                ))}
                <p className="pagina-estilos-titulo">Fuente de títulos</p>
            </section>

            <section>
                <h2>Botones</h2>
                <div className="pagina-estilos-fila">
                    <BotonTienda>Principal</BotonTienda>
                    <BotonTienda variante="secundario">Secundario</BotonTienda>
                    <BotonTienda variante="enlace">Enlace</BotonTienda>
                    <BotonTienda deshabilitado>Deshabilitado</BotonTienda>
                    <BotonTienda a="/catalogo">Como enlace</BotonTienda>
                </div>
                <BotonTienda ancho>Ancho completo</BotonTienda>
                <div className="pagina-estilos-fila">
                    <BotonIcono icono="carrito" etiqueta="Carrito" contador={3} />
                    <BotonIcono icono="perfil" etiqueta="Cuenta" />
                    <BotonIcono icono="carrito" etiqueta="Carrito lleno" contador={120} />
                </div>
            </section>

            <section>
                <h2>Precio y distintivos</h2>
                <div className="pagina-estilos-fila">
                    <PrecioTienda importe={1234.5} divisa="EUR" />
                    <PrecioTienda importe={1234.5} divisa="EUR" grande />
                    <DistintivoTienda>Destacado</DistintivoTienda>
                    <DistintivoTienda variante="oferta">Oferta</DistintivoTienda>
                    <DistintivoTienda variante="agotado">Agotado</DistintivoTienda>
                </div>
            </section>

            <section>
                <h2>Cantidad y campo</h2>
                <div className="pagina-estilos-fila">
                    <SelectorCantidad valor={cantidad} maximo={5} onCambiar={setCantidad} />
                </div>
                <CampoFormulario etiqueta="Campo" valor={campo} deshabilitado={false} onCambiar={setCampo} />
                <CampoFormulario
                    etiqueta="Campo con error"
                    valor=""
                    error="Mensaje de error"
                    deshabilitado={false}
                    onCambiar={() => undefined}
                />
            </section>

            <section>
                <h2>Imagen</h2>
                <div className="pagina-estilos-imagen">
                    <ImagenProducto imagen={null} />
                </div>
            </section>
        </div>
    );
};
