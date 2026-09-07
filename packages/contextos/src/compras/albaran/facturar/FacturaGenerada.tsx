import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useNavigate } from "react-router";
import { FacturaCreada } from "../../factura/diseño.ts";

export const FacturaGenerada = ({
    factura,
    publicar,
}: {
    factura: FacturaCreada;
    publicar: EmitirEvento;
}) => {
    const navigate = useNavigate();

    const cerrar = () => publicar("resultado_facturado_cerrado");

    return (
        <QModal
            nombre="facturaGeneradaCompra"
            abierto={true}
            titulo="Factura generada"
            onCerrar={cerrar}
        >
            <div className="mensaje">
                {`Se ha generado la factura ${factura.codigo}.`}
            </div>
            <div className="botones">
                <QBoton onClick={() => navigate(`/compras/factura?id=${factura.id}`)}>
                    {`Ir a la factura ${factura.codigo}`}
                </QBoton>
                <QBoton variante="texto" onClick={cerrar}>
                    Aceptar
                </QBoton>
            </div>
        </QModal>
    );
};
