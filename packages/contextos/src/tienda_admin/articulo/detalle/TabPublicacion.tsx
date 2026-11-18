import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { WebsiteAdmin } from "../../comun/diseño.ts";
import { ArticuloWebDetalle } from "../diseño.ts";
import { filasPublicacion } from "../dominio.ts";
import "./TabPublicacion.css";

export const TabPublicacion = ({
    articulo,
    websites,
    publicar,
}: {
    articulo: ArticuloWebDetalle;
    websites: WebsiteAdmin[];
    publicar: EmitirEvento;
}) => (
    <div className="TabPublicacion">
        <table className="TabPublicacion-tabla">
            <thead>
                <tr>
                    <th>Website</th>
                    <th>Estado</th>
                    <th>Slug</th>
                    <th>Orden</th>
                    <th>Fecha de publicación</th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {filasPublicacion(articulo, websites).map(({ website, publicacion, estado }) => (
                    <tr key={website.id}>
                        <td>{website.nombre}</td>
                        <td>{estado}</td>
                        <td>{publicacion?.slug ?? ""}</td>
                        <td>{publicacion?.orden ?? ""}</td>
                        <td>
                            {publicacion?.fechaPublicacion
                                ? new Date(publicacion.fechaPublicacion).toLocaleDateString()
                                : ""}
                        </td>
                        <td>
                            <QBoton
                                tamaño="pequeño"
                                variante={publicacion ? "borde" : "solido"}
                                onClick={() => publicar("publicacion_solicitada", website.id)}
                            >
                                {publicacion ? "Editar" : "Publicar"}
                            </QBoton>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
