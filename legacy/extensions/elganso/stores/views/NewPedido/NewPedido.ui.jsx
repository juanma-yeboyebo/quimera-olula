import "./NewPedido.style.scss";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import MuiInput from "@mui/material/Input";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Field, Grid, Icon, IconButton } from "@quimera/comps";
import { navigate } from "hookrouter";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useSound from "use-sound";

import errorSound from "../../../../../apps/elganso-stores/assets/sound/error.mp3";
import successSound from "../../../../../apps/elganso-stores/assets/sound/success.mp3";
import { BarcodeScanner } from "../../comps";

function NewPedido({ ...props }) {
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const [state, dispatch] = useStateValue();
  const { idComanda } = props;
  const {
    barcode,
    jornadaAbierta,
    msgSuccess,
    msgError,
    newPedido,
    puntoVentaSeleccionado,
    puntosVenta,
  } = state;
  const { datosCliente, direccionCliente, idArqueo, lineas } = newPedido;
  const [optionsPuntosVenta, setOptionsPuntosVenta] = useState([]);

  const inputRef = useRef(null);
  const [showReaderBarcode, setShowReaderBarcode] = useState(false);
  const [reproduceSound, setReproduceSound] = useState(false);

  useEffect(() => {
    dispatch({
      type: "init",
      payload: {
        hoy: new Date().toISOString().substring(0, 10),
      },
    });
  }, [dispatch]);

  const getOptionsPuntosVenta = useCallback(data => {
    const aux = [];

    if (data && data.length > 0) {
      data.forEach(item => {
        aux.push({
          key: item.codtpv_puntoventa,
          value: `${item.codtpv_puntoventa}-${item.descripcion}`,
          option: item,
        });
      });
    }

    setOptionsPuntosVenta(aux);
  }, []);

  useEffect(() => {
    getOptionsPuntosVenta(puntosVenta);
  }, [puntosVenta, getOptionsPuntosVenta]);

  const render = () => {
    const [successBeep] = useSound(successSound);
    const [errorBeep] = useSound(errorSound);

    const renderDatosCliente = () => {
      return (
        <Accordion className="Accordion Accordion-Datos" defaultExpanded>
          <AccordionSummary
            expandIcon={<Icon>arrow_drop_down</Icon>}
            aria-controls="panel1-content"
            id="panel1-header"
            className="cabeceraAccordion"
          >
            <h3 className="main title-accordion">Cliente</h3>
          </AccordionSummary>
          <AccordionDetails className="bodyAccordion">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Field.Text
                  id="newPedido.datosCliente.nombre"
                  label="Nombre"
                  autoFocus={true}
                  value={datosCliente.nombre}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Field.Text
                  id="newPedido.datosCliente.cifnif"
                  label="C.I.F/N.I.F*"
                  value={datosCliente.cifnif}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Field.Text
                  id="newPedido.datosCliente.codTarjetaPuntos"
                  label="Tarjeta Puntos*"
                  value={datosCliente.codTarjetaPuntos}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      );
    };

    const renderDatosDireccion = () => {
      return (
        <Accordion className="Accordion Accordion-Datos" defaultExpanded={false}>
          <AccordionSummary
            expandIcon={<Icon>arrow_drop_down</Icon>}
            aria-controls="panel1-content"
            id="panel1-header"
            className="cabeceraAccordion"
          >
            <h3 className="main title-accordion">Dirección</h3>
          </AccordionSummary>
          <AccordionDetails className="bodyAccordion">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 2 }}>
                <Field.Text
                  id="newPedido.direccionCliente.tipovia"
                  label="Tipo Vía"
                  autoFocus={true}
                  value={direccionCliente.tipovia}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field.Text
                  id="newPedido.direccionCliente.direccion"
                  label="Dirección*"
                  autoFocus={true}
                  required={true}
                  value={direccionCliente.direccion}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 1 }}>
                <Field.Text
                  id="newPedido.direccionCliente.numero"
                  label="Número"
                  autoFocus={true}
                  value={direccionCliente.numero}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Field.Text
                  id="newPedido.direccionCliente.otros"
                  label="Otros"
                  autoFocus={true}
                  value={direccionCliente.otros}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Field.Text
                  id="newPedido.direccionCliente.ciudad"
                  label="Ciudad"
                  autoFocus={true}
                  value={direccionCliente.ciudad}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Field.Text
                  id="newPedido.direccionCliente.provincia"
                  label="Provincia"
                  autoFocus={true}
                  value={direccionCliente.provincia}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 2 }}>
                <Field.Text
                  id="newPedido.direccionCliente.cpostal"
                  label="Código Postal"
                  autoFocus={true}
                  value={direccionCliente.cpostal}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 2 }}>
                <Field.Text
                  id="newPedido.direccionCliente.pais"
                  label="País"
                  autoFocus={true}
                  value={direccionCliente.pais}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      );
    };

    const saveLinea = (e, readedBarcode = null) => {
      let newBarcode = null;

      if (barcode === null || barcode === "") {
        if (readedBarcode !== null) {
          newBarcode = readedBarcode;
        }
      } else {
        newBarcode = barcode;
      }

      if (newBarcode !== null && newBarcode !== "") {
        const result = lineas.find(item => item.barcode === newBarcode);

        if (result !== undefined) {
          setReproduceSound(true);
          result.cantidad += 1;
          dispatch({
            type: "setMessageSuccess",
            payload: {
              linea: result,
            },
          });
        } else {
          setReproduceSound(true);
          dispatch({
            type: "onClickAddNewLinea",
          });
        }

        // Despues de añadir o modificar la linea, limpiar el barcode
        dispatch({
          type: "setActualReadBarcode",
          payload: {
            value: null,
          },
        });
        inputRef.current.focus();
      }
    };

    const barCodeKeyUp = event => {
      const { key, target } = event;

      if (key === "Enter" && target.value !== "") {
        saveLinea();
      }
    };

    const setBarcode = e => {
      dispatch({
        type: "setActualReadBarcode",
        payload: {
          value: e,
        },
      });

      saveLinea(false, e);
    };

    const renderBarcode = () => {
      return <BarcodeScanner parentDispatch={setBarcode} focus={inputRef.current} />;
    };

    const renderInputBarcode = () => {
      return (
        <>
          {showReaderBarcode ? renderBarcode() : null}
          <Box width={1} className="new-linea">
            <Box width={1} spacing={2} className="new-linea-container">
              <Box>
                <Field.Text
                  id="barcode"
                  label="Barcode Reader"
                  autoFocus
                  inputRef={inputRef}
                  onKeyUp={barCodeKeyUp}
                />
              </Box>
              <Box className="rowMargin">
                <IconButton id="button-add" className="buttonNuevaLinea" onClick={saveLinea}>
                  <Icon>add_circle</Icon>
                </IconButton>
                <IconButton
                  id="button-reader-barcode"
                  className="buttonReaderBarcode"
                  onClick={() => {
                    dispatch({
                      type: "setActualReadBarcode",
                      payload: {
                        value: null,
                      },
                    });
                    setShowReaderBarcode(!showReaderBarcode);
                    inputRef.current.focus();
                  }}
                >
                  <Icon>qr_code_scanner_icon</Icon>
                </IconButton>
              </Box>
            </Box>
          </Box>
        </>
      );
    };

    const renderPriceFixed = price => {
      return <span> {price.toFixed(2)}</span>;
    };

    const renderProducto = params => {
      return (
        <Accordion className="Accordion Accordion-Producto">
          <AccordionSummary
            expandIcon={<Icon>arrow_drop_down</Icon>}
            aria-controls="panel1-content"
            id="panel1-header"
            className="cabeceraAccordion"
          >
            <div className="header-producto">
              <b>
                {params.row.id}
                {params.row.talla && params.row.talla !== "TU" ? ` - ${params.row.talla}` : ""}
              </b>
              <span>{params.row.description}</span>
            </div>
          </AccordionSummary>
          <AccordionDetails className="bodyAccordion">
            <div>
              <b>Barcode: </b>
              {params.row.barcode}
            </div>
            {params.row.talla && params.row.talla !== "TU" && (
              <div>
                <b>Talla: </b>
                {params.row.talla}
              </div>
            )}
            <div>
              <b>Precio Ud: </b>
              {renderPriceFixed(params.row.pvpund)}
            </div>
            <div>
              <b>Precio IVA: </b>
              {renderPriceFixed(params.row.pvpiva)}
            </div>
          </AccordionDetails>
        </Accordion>
      );
    };

    const changeCantidad = (event, params) => {
      const { value } = event.target;

      if (value === 0 || value === "0") {
        dispatch({
          type: "onDeleteLineaInventarioClicked",
          payload: {
            idLinea: params.row.id,
            descriptionLinea: params.row.description,
          },
        });
      } else if (value !== params.row.cantidad) {
        dispatch({
          type: "onChangeCantidad",
          payload: {
            idLinea: params.row.id,
            newCantidad: value,
          },
        });
      }
    };

    const renderCantidad = params => {
      return (
        <MuiInput
          value={params.row.cantidad}
          size="small"
          onChange={e => changeCantidad(e, params)}
          inputProps={{
            "step": 1,
            "min": 0,
            "max": 999,
            "type": "number",
            "aria-labelledby": "input-slider",
          }}
        />
      );
    };

    const renderTotalIVA = params => {
      const { pvpiva, cantidad } = params.row;

      const total = (pvpiva * cantidad).toFixed(2);

      return <span className="cantidad centerContentTable"> {total}</span>;
    };

    const renderActions = params => {
      return (
        <>
          <IconButton
            id="button-delete"
            className="buttonAcciones buttonAcciones-active"
            onClick={() => {
              dispatch({
                type: "onDeleteLineaInventarioClicked",
                payload: {
                  idLinea: params.row.id,
                  descriptionLinea: params.row.description,
                },
              });
            }}
          >
            <Icon>delete</Icon>
          </IconButton>
        </>
      );
    };

    const columns = [
      {
        field: "product",
        headerName: "Producto",
        renderCell: params => renderProducto(params),
        flex: mobile ? 6 : 6,
      },
      {
        field: "cantidad",
        headerName: "Qty.",
        sortable: false,
        flex: mobile ? 0.5 : 0.5,
        renderCell: params => renderCantidad(params),
      },
      {
        field: "totaliva",
        headerName: "Total IVA",
        sortable: false,
        flex: mobile ? 0.75 : 0.75,
        renderCell: params => renderTotalIVA(params),
      },
      {
        field: "action",
        headerName: "",
        sortable: false,
        flex: mobile ? 0.5 : 0.5,
        renderCell: params => renderActions(params),
      },
    ];

    const renderTotales = () => {
      let totalItems = 0;
      let totalNeto = 0;
      let totalIva = 0;

      // eslint-disable-next-line array-callback-return
      lineas.map(linea => {
        totalItems += parseInt(linea.cantidad, 10);
        totalNeto += linea.pvpund * linea.cantidad;
        totalIva += linea.pvpiva * linea.cantidad;
      });

      return (
        <>
          <div className="totals-line">
            <div className="totals-title">Items:</div>
            <div className="totals-value">{totalItems}</div>
          </div>
          <div className="totals-line">
            <div className="totals-title">Neto:</div>
            <div className="totals-value">{totalNeto.toFixed(2)}</div>
          </div>
          <div className="totals-line result">
            <div className="totals-title">Total:</div>
            <div className="totals-value">{totalIva.toFixed(2)}</div>
          </div>
        </>
      );
    };

    const renderMsgSuccess = (msgSuccess, msgError, successBeep) => {
      if (msgError === "" && msgSuccess !== "" && reproduceSound) {
        successBeep();
        setReproduceSound(false);

        setTimeout(() => {
          dispatch({
            type: "setReloadMessages",
          });
        }, 5000);
      }

      return <div className="msg-success">{msgSuccess}</div>;
    };

    const renderMsgError = (msgError, errorBeep) => {
      if (msgError !== "" && msgSuccess === "" && reproduceSound) {
        errorBeep();
        setReproduceSound(false);

        setTimeout(() => {
          dispatch({
            type: "setReloadMessages",
          });
        }, 5000);
      }

      return <div className="msg-error">{msgError}</div>;
    };

    const renderFormPedido = () => {
      if (jornadaAbierta === false) {
        return (
          <div className="jornada-cerrada-msg">
            <h3>Para crear un nuevo pedido es necesario tener la jornada abierta.</h3>
            <p>Por favor, inicie su jornada.</p>
            <Button
              id="to-control-horario"
              onClick={() => {
                navigate("/control_horario");
              }}
            >
              <Icon fontSize="large" className="icon-calendar">
                calendar_month
              </Icon>
              Ir A Control Horario
            </Button>
          </div>
        );
      }

      if (puntoVentaSeleccionado === null || puntoVentaSeleccionado === undefined) {
        return (
          <div className="jornada-cerrada-msg">
            <h3>Para crear un nuevo pedido es necesario tener un punto de venta asignado.</h3>
            <p>Por favor, asigne un punto de venta.</p>
            <Field.Select
              id="puntoVentaSeleccionado"
              className="select-punto-venta"
              getOptions={getOptionsPuntosVenta}
              onChange={e =>
                dispatch({
                  type: "setStatePuntoVentaValue",
                  payload: {
                    key: "puntoVentaSeleccionado",
                    data: e.target.value === null ? null : e.target.value.key,
                  },
                })
              }
              options={optionsPuntosVenta}
              translateOptions={false}
              label="Punto de Venta"
            />
          </div>
        );
      }

      if (idArqueo === null || idArqueo === undefined) {
        return (
          <div className="jornada-cerrada-msg">
            <h3>Para crear un nuevo pedido es necesario tener un arqueo iniciado.</h3>
            <p>Por favor, inicie un arqueo.</p>
          </div>
        );
      }

      return (
        <div className="main-new-pedido">
          <Grid container spacing={2} className="order-info">
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 4 }}>
                  <Field.Date id="newPedido.fecha" label="Fecha" disabled />
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                  <Field.Time id="newPedido.hora" label="Hora" disabled />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}></Grid>
                <Grid size={4}>
                  <Field.Text id="newPedido.codAgente" label="Agente" disabled />
                </Grid>
                <Grid size={8}>
                  <Field.Text
                    id="newPedido.descripcionAgente"
                    label="Descripción"
                    disabled
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <div className="main-new-pedido-totales">
                <div className="main-new-pedido-totales-container">{renderTotales()}</div>
              </div>
            </Grid>
          </Grid>
          <div className="form-container">
            <div className="main-new-pedido-container-cliente">{renderDatosCliente()}</div>
            {/* <div className="main-new-pedido-container-direccion">{renderDatosDireccion()}</div> */}
          </div>
          <div className="main-new-pedido-container-escaner">
            <h4 className="main">Líneas</h4>
            {renderInputBarcode()}
            {msgSuccess !== "" ? renderMsgSuccess(msgSuccess, msgError, successBeep) : null}
            {msgError !== "" ? renderMsgError(msgError, errorBeep) : null}
          </div>
          <DataGrid
            rows={lineas}
            autoHeight={true}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            disableColumnMenu
            disableRowSelectionOnClick
            columns={columns}
            getRowId={row => row.id}
            getRowClassName={() => "rowProducto"}
            getRowHeight={() => "auto"}
            localeText={{ noRowsLabel: "Sin líneas" }}
            sx={{
              ".MuiDataGrid-virtualScroller::-webkit-scrollbar": { display: "none" },
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                printOptions: { disableToolbarButton: true },
                csvOptions: { disableToolbarButton: true },
              },
              pagination: {
                labelRowsPerPage: "Líneas por página",
                labelDisplayedRows: ({ from, to, count }) => `${from}-${to} de ${count}`,
              },
            }}
            slots={{ toolbar: null }}
          />
          <div>
            <Button
              id="crearNuevoPedido"
              color="primary"
              variant="text"
              text={"Crear"}
              disabled={!idArqueo || !puntoVentaSeleccionado}
            />
          </div>
          <div>
            <p>
              codTarjetaPuntos = "AWEB00000265042" (marmatsim@gmail.com) | "AWEB00000272394"
              (martin@yeboyebo.es)
            </p>

            <p>Gabardina 'XL' 8445005547877 (1040s240014)</p>
            <p>Camiseta Azul 'S' 8445005623410 (1100W240099)</p>
            <p>Camiseta Verde 'M' 8445005623465 (1100W240100)</p>
            <p>Pantalon '48' 8445005586531 (1020W240003)</p>
            <p>Toalla 8433613786757 (4122s160001)</p>
          </div>
        </div>
      );
    };

    return (
      <div id="NewPedido" className="page-container">
        <h2 className="main">Nuevo Pedido</h2>

        {renderFormPedido()}
      </div>
    );
  };

  return <Quimera.Template id="NewPedido">{render()}</Quimera.Template>;
}

NewPedido.propTypes = PropValidation.propTypes;
NewPedido.defaultProps = PropValidation.defaultProps;
export default NewPedido;
