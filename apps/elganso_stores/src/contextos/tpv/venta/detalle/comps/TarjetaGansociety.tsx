import { BotonCambiar } from "#/ventas/comun/componentes/BotonCambiar.tsx";
import { BotonEliminar } from "#/ventas/comun/componentes/BotonEliminar.tsx";
import { CambioCliente } from "#/ventas/comun/componentes/moleculas/CambioClienteVenta/diseño.ts";
import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { formatearNumero } from "@olula/lib/dominio.ts";
import { useEffect, useState } from "react";
import { CambiosDatosCliente, VentaTpv } from "../../diseño.ts";
import { buscarTarjetasPuntos, TarjetaPuntos } from "../../infraestructura.ts";
import { BuscarTarjetaPuntos } from "../TabCliente/BuscarTarjetaPuntos.tsx";
import "./TarjetaGansociety.css";

// En Eneboo, al asignar una tarjeta Gansociety a la venta se sobreescriben
// los datos del cliente con los guardados en la propia tarjeta
// (informarDatosClienteTarjetaPtos), pero SOLO si "Datos Factura" (o Venta
// Web) está activo — si no, la tarjeta se vincula sin tocar nombre/CIF/
// dirección/email del cliente. La dirección de Eneboo es un único campo de
// texto libre, así que se vuelca entera en "Otros" (aquí la dirección va
// repartida en tipo_via/nombre_via/número/otros).
const cambiosDesdeTarjeta = (
  tarjeta: TarjetaPuntos,
  emailActual: string
): { cliente: CambioCliente; datosCliente: CambiosDatosCliente } => ({
  cliente: {
    nombre_cliente: tarjeta.nombre,
    id_fiscal: tarjeta.cifnif ?? "",
    otros: tarjeta.direccion ?? "",
    cod_postal: tarjeta.codpostal ?? "",
    ciudad: tarjeta.ciudad ?? "",
    provincia: tarjeta.provincia ?? "",
  },
  datosCliente: {
    email: tarjeta.email || emailActual,
    tarjeta_puntos_id: tarjeta.codtarjetapuntos,
  },
});

export const aplicarTarjetaACliente = async (
  publicar: EmitirEvento,
  tarjeta: TarjetaPuntos,
  emailActual: string,
  datosFacturaActivo: boolean
) => {
  if (!datosFacturaActivo) {
    await publicar("datos_cliente_listo", {
      email: emailActual,
      tarjeta_puntos_id: tarjeta.codtarjetapuntos,
    });
    return;
  }

  const { cliente, datosCliente } = cambiosDesdeTarjeta(tarjeta, emailActual);
  await publicar("cambio_cliente_listo", cliente);
  await publicar("datos_cliente_listo", datosCliente);
};

export const mensajeAsociarTarjeta = (tarjeta: TarjetaPuntos) =>
  `Va a asociar la venta a la tarjeta ${tarjeta.codtarjetapuntos} del cliente ${tarjeta.nombre} con DNI ${tarjeta.cifnif ?? ""}. ¿Desea continuar?`;

// Igual que en Eneboo (case "lbltitulartp"): junto al nombre del titular se
// indica el tipo de tarjeta — (E) de empleado, (D X%) con descuento
// especial, o (F) en el caso normal.
const sufijoTitular = (tarjeta: TarjetaPuntos): string => {
  if (tarjeta.deempleado) return " (E)";
  if (tarjeta.dtoespecial) return ` (D ${tarjeta.dtopor ?? 0}%)`;
  return " (F)";
};

interface TarjetaGansocietyProps {
  venta: VentaTpv;
  publicar: EmitirEvento;
  editable: boolean;
  datosFacturaActivo: boolean;
}

// Búsqueda/asignación de la tarjeta Gansociety: en Eneboo es un botón de la
// barra de la venta, independiente del tab de cliente y de "Datos Factura"
// (por eso vive aquí, junto a los totales, no dentro de TabCliente).
export const TarjetaGansociety = ({
  venta,
  publicar,
  editable,
  datosFacturaActivo,
}: TarjetaGansocietyProps) => {
  const [buscandoTarjeta, setBuscandoTarjeta] = useState(false);
  const [tarjetaAConfirmar, setTarjetaAConfirmar] = useState<TarjetaPuntos | null>(null);
  const [tarjetaVinculada, setTarjetaVinculada] = useState<TarjetaPuntos | null>(null);

  // Igual que en Eneboo (bChPreCursor sobre "codtarjetapuntos": lblTitularTP
  // + lblSaldoPuntos): debajo del código se muestra el titular y el saldo
  // de puntos de la tarjeta vinculada, releídos cada vez que cambia.
  useEffect(() => {
    let cancelado = false;
    if (!venta.tarjetaPuntosId) {
      setTarjetaVinculada(null);
      return;
    }
    buscarTarjetasPuntos({ codigo: venta.tarjetaPuntosId }).then((tarjetas) => {
      if (!cancelado) setTarjetaVinculada(tarjetas[0] ?? null);
    });
    return () => {
      cancelado = true;
    };
  }, [venta.tarjetaPuntosId]);

  // Igual que en Eneboo (comprobarYasignarTarjeta): antes de asignar la
  // tarjeta se pide confirmación, mostrando de quién es.
  const onSeleccionarTarjeta = (tarjeta: TarjetaPuntos) => {
    setBuscandoTarjeta(false);
    setTarjetaAConfirmar(tarjeta);
  };

  const confirmarTarjeta = async () => {
    if (!tarjetaAConfirmar) return;
    await aplicarTarjetaACliente(publicar, tarjetaAConfirmar, venta.email ?? "", datosFacturaActivo);
    setTarjetaAConfirmar(null);
  };

  // Igual que en Eneboo (tbnLimpiaTarjeta_clicked): solo desvincula el
  // código de tarjeta, sin tocar el resto de datos del cliente ya
  // informados (nombre, CIF/NIF, dirección, email).
  const quitarTarjeta = async () => {
    await publicar("datos_cliente_listo", {
      email: venta.email ?? "",
      tarjeta_puntos_id: "",
    });
  };

  return (
    <div className="TarjetaGansociety">
      <div className="TarjetaGansociety-info">
        <div>
          <label>Tarjeta Gansociety:</label>
          <span>{venta.tarjetaPuntosId || "Sin tarjeta"}</span>
        </div>

        {tarjetaVinculada && (
          <div className="TarjetaGansociety-titular">
            <span>{tarjetaVinculada.nombre}{sufijoTitular(tarjetaVinculada)}</span>
            {tarjetaVinculada.saldopuntos !== 0 && (
              <span>GIFT acumulado: {formatearNumero(tarjetaVinculada.saldopuntos)}</span>
            )}
          </div>
        )}
      </div>

      <div className="TarjetaGansociety-acciones">
        <BotonCambiar
          titulo="Buscar tarjeta Gansociety"
          onClick={() => setBuscandoTarjeta((valor) => !valor)}
          deshabilitado={!editable}
        />
        <BotonEliminar
          titulo="Quitar tarjeta Gansociety"
          onClick={quitarTarjeta}
          deshabilitado={!editable || !venta.tarjetaPuntosId}
        />
      </div>

      {buscandoTarjeta && (
        <BuscarTarjetaPuntos
          onSeleccionar={onSeleccionarTarjeta}
          onCerrar={() => setBuscandoTarjeta(false)}
        />
      )}

      {tarjetaAConfirmar && (
        <QModalConfirmacion
          nombre="confirmarTarjetaPuntosVentaTpv"
          abierto={true}
          titulo="Gansociety"
          mensaje={mensajeAsociarTarjeta(tarjetaAConfirmar)}
          onCerrar={() => setTarjetaAConfirmar(null)}
          onAceptar={confirmarTarjeta}
        />
      )}
    </div>
  );
};
