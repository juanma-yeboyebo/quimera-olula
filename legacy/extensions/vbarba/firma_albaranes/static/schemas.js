import { util } from "quimera";
import { Field, Schema } from "quimera/lib";

// const validationCantidadesProveedor = data =>
//   data.lista
//     .filter(lineaItem => lineaItem.idLineaPc === data.linea.idLineaPc)
//     .reduce((accum, item) => accum + item.cantidadOk + item.cantidadKo, 0) >
//     data.linea.cantidadFactura && {
//     error: true,
//     message: "",
//   };

//   descuento: Field.Float("dto", "Descuento")
//   .default(0.0)
//   .validation(
//     ({ descuento }) =>
//       descuento >= 0 &&
//       descuento <= 100 && {
//         error: true,
//         message: "El descuento debe ser un valor entre 0 y 100",
//       },
//   ),

export default parent => {
  return {
    ...parent,
    albaranescli: parent.albaranescli.fields({
      codigoParte: Field.Text("codigoparte", "Codigo parte"),
      idParteES: Field.Text("idpartees", "Id parte E/S"),
      estadoFirma: Field.Text("estadofirma", "Estado de firma"),
      puestoFirma: Field.Text("puestofirma", "Puesto de firma"),
      idFirma: Field.Text("idfirma", "Id de la firma"),
      observacionesFirma: Field.Text("observacionesfirma", "Observaciones de firma"),
    }),
    contacto: Schema("contactos", "codcliente").fields({
      nombre: Field.Text("nombre", "nombre"),
      nif: Field.Text("nif", "nif"),
    }),
    firmasdealbaranes: Schema("firmasdealbaranes", "idalbaran").fields({
      idAlbaran: Field.Text("idalbaran", "idalbaran"),
      codigo: Field.Text("codigo", "codigo"),
      codContacto: Field.Text("codcontacto", "codContacto"),
      firmadopor: Field.Text("firmadopor", "firmadopor"),
      cifnif: Field.Text("cifnif", "cifnif"),
      puesto: Field.Text("puesto", "puesto"),
      fecha: Field.Text("fecha", "fecha"),
      hora: Field.Text("hora", "hora"),
      observacionesfirma: Field.TextArea("observacionesfirma", "observacionesfirma").default(""),
      estado: Field.Text("estado", "estado"),
      firma: Field.Text("firma", "firma"),
    }),
    partescarros: Schema("escarros", "id")
      .fields({
        idParte: Field.Int("id", "id").auto(),
        nombreCliente: Field.Text("nombrecli", "Nombre cliente").default(""),
        codCliente: Field.Text("codcliente", "codcliente").validation(parte => {
          return (
            parte.porCliente &&
            parte.aplicadoA === "Cliente" &&
            !parte.codCliente && {
              error: true,
              message: "Selecciona un cliente",
            }
          );
        }),
        codAgente: Field.Text("codagente", "codagente").validation(parte => {
          return (
            !parte.codAgente && {
              error: true,
              message: "Selecciona un agente",
            }
          );
        }),
        codigoParte: Field.Text("codigoparte", "Codigo parte"),
        fecha: Field.Date("fecha", "Fecha")
          .validation(parte => {
            return (
              !parte.fecha && {
                error: true,
                message: "Selecciona una fecha",
              }
            );
          })
          .default(util.today()),
        firmado: Field.Bool("firmado", "firmado").default(false),
        firmadoPor: Field.Text("firmadopor", "Firmado por").dump(false),
        codProveedor: Field.Text("codproveedor", "codproveedor").validation(parte => {
          return (
            !parte.codProveedor &&
            !parte.porCliente && {
              error: true,
              message: "Selecciona un proveedor",
            }
          );
        }),
        aliasProv: Field.Text("aliasprov", "aliasprov"),
        nombreProv: Field.Text("nombreprov", "nombreprov"),
        aplicadoA: Field.Text("aplicadoa", "aplicadoa"),
        porCliente: Field.Text("porcliente", "porcliente"),
        codTransportista: Field.Text("codtransportista", "codtransportista").validation(parte => {
          return (
            parte.porCliente &&
            parte.aplicadoA === "Transportista" &&
            !parte.codTransportista && {
              error: true,
              message: "Selecciona un transportista",
            }
          );
        }),
        nombreTrans: Field.Text("nombretrans", "nombretrans"),
        tipoDocCli: Field.Text("tipodoccli", "tipodoccli").default(" "),
        idDocumentoCli: Field.Text("iddocumentocli", "iddocumentocli"),
        codDocumentoCli: Field.Text("coddocumentocli", "coddocumentocli").default(" "),
        observaciones: Field.Text("observaciones", "observaciones"),
      })
      .order(() => ({ field: "fecha", direction: "DESC" }))
      .filter(() => ["1", "eq", "1"]),
    tiposCarro: Schema("escarros", "codigo")
      .fields({
        codigo: Field.Int("codigo", "codigo").auto(),
        idCarro: Field.Int("idcarro", "idcarro"),
        descripcion: Field.Text("descripcion", "descripcion").default(""),
        entrada: Field.Text("entrada", "entrada").default(0),
        salida: Field.Int("salida", "salida").default(0),
        total: Field.Int("total", "total"),
        saldo_antes: Field.Float("saldo_antes", "saldo_antes").default(0),
        saldo_despues: Field.Float("saldo_despues", "saldo_despues").default(0),
      })
      .order(() => ({ field: "fecha", direction: "DESC" }))
      .filter(({ parteCarro }) => ["id", "eq", parteCarro.data.idParte]),
    firmasdecarros: Schema("firmasdecarros", "idescarro").fields({
      idEscarro: Field.Text("idescarro", "idescarro"),
      codigoParte: Field.Text("codigoparte", "codigoparte"),
      codContacto: Field.Text("codcontacto", "codcontacto"),
      firmadopor: Field.Text("firmadopor", "firmadopor"),
      cifnif: Field.Text("cifnif", "cifnif"),
      puesto: Field.Text("puesto", "puesto"),
      fecha: Field.Text("fecha", "fecha"),
      hora: Field.Text("hora", "hora"),
      observacionesfirma: Field.TextArea("observacionesfirma", "observacionesfirma").default(""),
      estado: Field.Text("estado", "estado"),
      firma: Field.Text("firma", "firma"),
    }),
    puestosdefirma: Schema("vb_puestosdefirma", "puesto")
      .fields({
        puesto: Field.Text("puesto", "puesto"),
        tipofirma: Field.Text("tipofirma", "tipofirma"),
      })
      .filter(() => ["tipofirma", "eq", "WEB"]),
    mispuestosdefirma: Schema("vb_puestosdefirma", "puesto")
      .fields({
        key: Field.Text("puesto", "puesto"),
        value: Field.Text("puesto", "puesto"),
        tipofirma: Field.Text("tipofirma", "tipofirma"),
      })
      .filter(() => ["tipofirma", "eq", "WEB"]),
  };
};
