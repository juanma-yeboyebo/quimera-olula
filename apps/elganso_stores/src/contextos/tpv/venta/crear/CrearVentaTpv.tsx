import { CambioCliente } from "#/ventas/comun/componentes/moleculas/CambioClienteVenta/diseño.ts";
import { puntoVentaLocal } from "#/tpv/comun/infraestructura.ts";
import {
  getPrecheckPedido,
  getVenta,
  patchCambiarCliente,
  postVenta,
  PuntoVentaOpcion,
} from "../infraestructura.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./CrearVentaTpv.css";

// En El Ganso una venta TPV no lleva cliente real: se crea siempre con este
// cliente de paso fijo, sin preguntar nada al usuario. El endpoint de alta
// de tpv/venta no acepta cliente en la creación (solo agente_id/
// punto_venta_id, que además el backend resuelve por el usuario logueado),
// así que el cliente "Venta PDA" se fija en un segundo paso. "ciudad" no
// puede quedar en "": el backend exige que la ciudad de la dirección sea un
// string (aunque el resto de campos sí aceptan null).
const VENTA_PDA: CambioCliente = {
  nombre_cliente: "Venta PDA",
  ciudad: "-",
};

type EstadoPrecheck =
  | "cargando"
  | "sin_jornada"
  | "eligiendo_punto_venta"
  | "listo";

export const CrearVentaTpv = ({
  publicar = async () => {},
}: {
  publicar?: EmitirEvento;
}) => {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<EstadoPrecheck>("cargando");
  const [puntosVenta, setPuntosVenta] = useState<PuntoVentaOpcion[]>([]);

  // Mismas tres comprobaciones que hacía (a medias) el "Nuevo Pedido" del
  // legacy antes de dejar crear un pedido: jornada abierta, punto de venta
  // resuelto (aquí, guardado en localStorage vía puntoVentaLocal) y arqueo
  // abierto — el arqueo, a diferencia del legacy, se abre solo si falta en
  // vez de dejar al usuario sin salida (eso se comprueba al pulsar
  // "Guardar", ver más abajo).
  useEffect(() => {
    (async () => {
      const resultado = await getPrecheckPedido();

      if (!resultado.jornada_abierta) {
        setEstado("sin_jornada");
        return;
      }

      if (puntoVentaLocal.obtenerSeguro()) {
        setEstado("listo");
        return;
      }

      if (resultado.puntos_venta.length === 1) {
        const unico = resultado.puntos_venta[0];
        puntoVentaLocal.actualizar({
          id: unico.codtpv_puntoventa,
          nombre: unico.descripcion,
        });
        setEstado("listo");
        return;
      }

      setPuntosVenta(resultado.puntos_venta);
      setEstado("eligiendo_punto_venta");
    })();
  }, []);

  const elegirPuntoVenta = (opcion: { valor: string; descripcion: string } | null) => {
    if (!opcion) return;
    puntoVentaLocal.actualizar({ id: opcion.valor, nombre: opcion.descripcion });
    setEstado("listo");
  };

  const guardar_ = useCallback(async () => {
    // Se asegura el arqueo justo antes de crear, no en el precheck inicial:
    // así solo se abre uno cuando de verdad se va a usar.
    const puntoVentaId = puntoVentaLocal.obtener().id;
    await getPrecheckPedido(puntoVentaId);

    const id = await postVenta({ agente_id: "", punto_venta_id: puntoVentaId });
    await patchCambiarCliente(id, VENTA_PDA);
    const ventaCreada = await getVenta(id);
    publicar("venta_creada", ventaCreada);
  }, [publicar]);

  const cancelar_ = useCallback(() => {
    publicar("creacion_venta_cancelada");
  }, [publicar]);

  const [guardar, cancelar] = useForm(guardar_, cancelar_);

  if (estado === "cargando") return null;

  if (estado === "sin_jornada") {
    return (
      <div className="CrearVentaTpv">
        <p className="CrearVentaTpv-texto">
          Para crear un nuevo pedido es necesario tener la jornada abierta.
          Por favor, inicia tu jornada.
        </p>
        <div className="botones">
          <QBoton onClick={() => navigate("/control_horario")}>
            Ir a Control Horario
          </QBoton>
          <QBoton onClick={cancelar_} variante="texto">
            Cancelar
          </QBoton>
        </div>
      </div>
    );
  }

  if (estado === "eligiendo_punto_venta") {
    return (
      <div className="CrearVentaTpv">
        <p className="CrearVentaTpv-texto">
          Para crear un nuevo pedido es necesario elegir un punto de venta.
        </p>
        <quimera-formulario>
          <QSelect
            label="Punto de Venta"
            nombre="punto_venta_nuevo_pedido"
            valor=""
            opciones={puntosVenta.map((p) => ({
              valor: p.codtpv_puntoventa,
              descripcion: `${p.codtpv_puntoventa} - ${p.descripcion}`,
            }))}
            onChange={elegirPuntoVenta}
          />
        </quimera-formulario>
        <div className="botones">
          <QBoton onClick={cancelar_} variante="texto">
            Cancelar
          </QBoton>
        </div>
      </div>
    );
  }

  return (
    <div className="CrearVentaTpv">
      <p className="CrearVentaTpv-texto">
        Vas a crear un nuevo pedido, ¿deseas continuar?
      </p>
      <div className="botones">
        <QBoton onClick={guardar}>Guardar</QBoton>
        <QBoton onClick={cancelar} variante="texto">
          Cancelar
        </QBoton>
      </div>
    </div>
  );
};
