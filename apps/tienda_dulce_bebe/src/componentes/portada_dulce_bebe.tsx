import { ConStoreView } from "#/tienda_online/comun/componentes/con_storeview.tsx";
import "./portada_dulce_bebe.css";

export const PortadaDulceBebe = () => (
    <ConStoreView>
        {(sv) => (
            <div className="PortadaDulceBebe contenedor-tienda">
                <h1>{sv.website.nombre}</h1>
                <p>Para ver una lista de regalo, abre el enlace que te han compartido.</p>
            </div>
        )}
    </ConStoreView>
);
