import { useState } from "react";
import { SinImagen } from "./sin_imagen.tsx";
import "./imagen_producto.css";

export const ImagenProducto = ({
    imagen,
    prioritaria,
}: {
    imagen: { url: string; alt: string | null } | null;
    prioritaria?: boolean;
}) => {
    const [fallida, setFallida] = useState(false);

    return (
        <div className="imagen-producto">
            {imagen && !fallida ? (
                <img
                    src={imagen.url}
                    alt={imagen.alt ?? ""}
                    loading={prioritaria ? undefined : "lazy"}
                    onError={() => setFallida(true)}
                />
            ) : (
                <SinImagen />
            )}
        </div>
    );
};
