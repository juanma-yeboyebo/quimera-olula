import {
  Box,
  Dialog,
  DialogContent,
  Field,
  Icon,
  QBox,
  QBoxButton,
  QListModel,
  QModelBox,
  QSection,
  QTitleBox,
  Typography,
} from "@quimera/comps";
import Quimera, { getSchemas, PropValidation, useStateValue, useWidth, util } from "quimera";
import React, { useEffect } from "react";

import { ListItemESCarro } from "../../comps";
// import { Agente, DocAgente, DocClienteYDir, DocDirCliente, DocFecha, Cliente, DirCliente, LineaPedidoCli, LineaInventario } from '../../comps'

function ParteCarro({ callbackChanged, idParte, initParteCarro, urlAtrasProp, useStyles }) {
  const [
    { logic, modalVistaEnviarDocumento, modalFirmaVisible, parteCarro, vistaDetalle, tiposCarro },
    dispatch,
  ] = useStateValue();
  const classes = useStyles();
  const width = useWidth();

  useEffect(() => {
    util.publishEvent(parteCarro.event, callbackChanged);
  }, [parteCarro.event.serial]);

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: { urlAtrasProp },
    });
  }, []);

  useEffect(() => {
    !!initParteCarro &&
      dispatch({
        type: "onInitParteCarro",
        payload: {
          initParteCarro,
        },
      });
    !initParteCarro &&
      !!idParte &&
      dispatch({
        type: "onInitParteCarroById",
        payload: {
          idParteCarro: idParte,
        },
      });
  }, [initParteCarro, idParte]);

  // useCallback necesario para que no salte el useEffect de onInit en cada render de LineaPedidoCliNueva
  // const callbackNuevaLinea = useCallback(
  //   payload => dispatch({ type: "onLineaCreada", payload }),
  //   [dispatch],
  // );

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const schema = getSchemas().partescarros;
  const editable = logic.parteEditable(parteCarro.data);
  const opcionesDocProp = {
    main: { tipo: "escarros", textoBoton: "Enviar" },
  };

  if ((!initParteCarro && !idParte) || initParteCarro?._status === "deleted") {
    return null;
  }

  if (idParte && !parteCarro.data.idParte) {
    return null;
  }

  function calculaTipoCodigo(parte) {
    let codigo = "";
    if (parte.porCliente) {
      codigo =
        parte.aplicadoA === "Cliente"
          ? `${parte.aplicadoA} ${parte.codCliente ?? ""}`
          : `${parte.aplicadoA} ${parte.codTransportista ?? ""}`;
    } else {
      codigo = `Proveedor ${parte.codProveedor ?? ""}`;
    }

    return codigo;
  }

  function calculaNombre(parte) {
    let nombre = "";
    if (parte.porCliente) {
      nombre = parte.aplicadoA === "Cliente" ? parte.nombreCliente : parte.nombreTrans;
    } else {
      nombre = parte.nombreProv;
    }

    return nombre;
  }

  // console.log("mimensaje_parteCarro", parteCarro);

  return (
    <Quimera.Template id="ParteCarro">
      {parteCarro && (
        <QBox
          width={anchoDetalle}
          titulo={`Código parte: ${parteCarro.data.codigoParte}`}
          botonesCabecera={[{ icon: "arrow_back", id: "atras", text: "Atrás" }]}
          sideButtons={
            <>
              <QBoxButton
                id="firmarParteCarro"
                title="Firmar parte y guardar entradas/salidas"
                icon="edit"
                disabled={!editable}
              />
              <QBoxButton
                id="guardarMovCarros"
                title="Guardar entradas/salidas"
                icon="save"
                disabled={!editable}
              />
              <QBoxButton
                id="enviarEmail"
                title="Enviar por email"
                icon="email"
                disabled={!parteCarro.data.firmado}
              />
              <Quimera.Block id="sideButtons" />
            </>
          }
        >
          <QModelBox id="parteCarro.buffer" schema={schema}>
            {vistaDetalle === "principal" ? (
              <Box>
                <QTitleBox titulo={calculaTipoCodigo(parteCarro.data)}>
                  <Typography variant="h5">{calculaNombre(parteCarro.data)}</Typography>
                </QTitleBox>

                {parteCarro.data.idDocumentoCli && parteCarro.data.tipoDocCli === "Albarán" && (
                  <QTitleBox titulo="Cod. Albarán">
                    <Typography variant="h5">{parteCarro.data.codDocumentoCli}</Typography>
                  </QTitleBox>
                )}

                {parteCarro.data.firmado && parteCarro.data.firmadoPor && (
                  <QTitleBox titulo="Firmado por">
                    <Typography variant="h5">{parteCarro.data.firmadoPor}</Typography>
                  </QTitleBox>
                )}

                <QTitleBox titulo="Fecha">
                  <Box display="flex" alignItems="center">
                    <Box mr={1}>
                      <Icon color="action" fontSize="default">
                        event
                      </Icon>
                    </Box>
                    <Typography variant="h5">{util.formatDate(parteCarro.buffer.fecha)}</Typography>
                  </Box>
                </QTitleBox>

                <QSection
                  title="Observaciones"
                  actionPrefix="parteCarro"
                  alwaysInactive={!editable}
                  dynamicComp={() => (
                    <Field.TextArea id="parteCarro.buffer.observaciones" label="" fullWidth />
                  )}
                >
                  {parteCarro.buffer.observaciones ? (
                    <Typography variant="body1">{parteCarro.buffer.observaciones}</Typography>
                  ) : (
                    <Typography variant="body2">{"Indique aquí sus observaciones"}</Typography>
                  )}
                </QSection>
                <Box mr={1}>
                  <QListModel
                    data={tiposCarro}
                    title="Entradas y salidas de carros"
                    modelName="tiposCarro"
                    ItemComponent={ListItemESCarro}
                    itemProps={{
                      variant: "section",
                    }}
                    disabled={parteCarro.buffer.firmado}
                  />
                </Box>
              </Box>
            ) : (
              <Box width={1}>{/* <DocAgente /> */}</Box>
            )}
          </QModelBox>
        </QBox>
      )}

      <Dialog
        open={modalFirmaVisible}
        fullWidth
        maxWidth="md"
        fullScreen={width === "xs" || width === "sm"}
      >
        <Quimera.View
          id="FirmaParteCarro"
          parteCarroProp={parteCarro.data}
          movCarroProp={Object.values(tiposCarro.dict).filter(
            car => car.entrada !== 0 || car.salida !== 0,
          )}
          callbackCerrado={payload => dispatch({ type: "onCerrarFirmaParteCarro", payload })}
          callbackChanged={payload => dispatch({ type: "onParteCarroFirmado", payload })}
        />
      </Dialog>

      <Dialog
        open={modalVistaEnviarDocumento}
        fullWidth
        maxWidth="md"
        fullScreen={width === "xs" || width === "sm"}
      >
        <DialogContent>
          <Quimera.View
            id="EnviarDocumentoEmail"
            opcionesDocProp={opcionesDocProp}
            idDocProp={parteCarro.data.idParte}
            codClienteProp={parteCarro.data.codCliente}
            codigoParteProp={parteCarro.data.codigoParte}
            callbackCerradoProp={payload =>
              dispatch({ type: "onCancelEnviarEmailClicked", payload })
            }
            callbackEnviadoProp={payload => dispatch({ type: "onEmailEnviado", payload })}
          />
        </DialogContent>
      </Dialog>
    </Quimera.Template>
  );
}

export default ParteCarro;
