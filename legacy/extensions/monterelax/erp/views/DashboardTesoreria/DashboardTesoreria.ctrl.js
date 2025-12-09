import { util } from "quimera";
import { ModelAPI, ModelCtrl } from "quimera/lib";

import schemas from "./DashboardTesoreria.schema";

export const state = parent => ({
  ...parent,
  reciboscli: ModelCtrl(schemas.reciboscli),
  recibosprov: ModelCtrl(schemas.recibosprov),
  tesomanual: ModelCtrl(schemas.tesomanual),
  cargando: true,
  arrayRecibosCliente: [],
  arrayRecibosProv: [],
  arrayRecibosTesoManual: [],
  recibosOrdenados: [],
  recibosDetalle: [],
  fechaCurrent: null,
  bufferFiltro: {
    intervaloFecha: "nextWeek",
    fechaDesde: util.today(),
    fechaHasta: util.firstOfNextWeek(),
    cuenta: "",
    saldoCuenta: 0,
    saldoCuentaAntes: 0,
    formaPago: "",
  },
});

export const bunch = parent => ({
  ...parent,
  ...ModelAPI({
    name: "reciboscli",
    id: "idrecibo",
    schema: schemas.reciboscli,
  }),
  ...ModelAPI({
    name: "recibosprov",
    id: "idrecibo",
    schema: schemas.recibosprov,
  }),
  ...ModelAPI({
    name: "tesomanual",
    id: "idrecibo",
    schema: schemas.tesomanual,
  }),
  onInit: [
    {
      type: "get",
      id: () => "-static-",
      schema: schemas.reciboscli,
      action: "get_tesoreria",
      success: "onRecibosClienteRecibido",
    },
    {
      type: "get",
      id: () => "-static-",
      schema: schemas.recibosprov,
      action: "get_tesoreria",
      success: "onRecibosProvRecibido",
    },
    {
      type: "get",
      id: () => "-static-",
      schema: schemas.tesomanual,
      action: "get_tesoreria",
      success: "onRecibosManualRecibido",
    },
  ],
  onRecibosClienteRecibido: [
    {
      type: "setStateKeys",
      plug: payload => {
        let prueba = payload.response.arrayRecibosCliente;
        prueba = prueba.map(recibo => {
          return {
            ...recibo,
            tabla: "reciboscli",
          };
        });

        return {
          keys: {
            cargando: false,
            arrayRecibosCliente: prueba,
          },
        };
      },
    },
    {
      type: "grape",
      name: "onMostrarMovimientos",
    },
  ],
  onRecibosProvRecibido: [
    {
      type: "setStateKeys",
      plug: payload => {
        let prueba = payload.response.arrayRecibosProveedor;
        prueba = prueba.map(recibo => {
          return {
            ...recibo,
            tabla: "recibosprov",
          };
        });

        return {
          keys: {
            cargando: false,
            arrayRecibosProv: prueba,
          },
        };
      },
    },
    {
      type: "grape",
      name: "onMostrarMovimientos",
    },
  ],
  onRecibosManualRecibido: [
    {
      type: "setStateKeys",
      plug: payload => {
        let prueba = payload.response.arrayRecibosTesoManual;
        prueba = prueba.map(recibo => {
          return {
            ...recibo,
            tabla: "tesomanual",
          };
        });

        return {
          keys: {
            cargando: false,
            arrayRecibosTesoManual: prueba,
          },
        };
      },
    },
    {
      type: "grape",
      name: "onMostrarMovimientos",
    },
  ],
  onFiltrarClicked: [
    {
      type: "setStateKeys",
      plug: (payload, { bufferFiltro }) => {
        return {
          keys: {
            recibosDetalle: [],
            fechaCurrent: null,
            bufferFiltro: {
              ...bufferFiltro,
              saldoCuenta: bufferFiltro.saldoCuentaAntes,
            },
          },
        };
      },
    },
    {
      type: "grape",
      name: "onMostrarMovimientos",
    },
  ],
  onBufferFiltroCuentaChanged: [
    {
      type: "setStateKeys",
      plug: ({ value, option }, { bufferFiltro }) => {
        return {
          keys: {
            bufferFiltro: {
              ...bufferFiltro,
              cuenta: value || "",
              saldoCuentaAntes: option?.saldo || 0,
            },
          },
        };
      },
    },
  ],
  onBufferFiltroFormaPagoChanged: [
    {
      type: "setStateKeys",
      plug: ({ value }, { bufferFiltro }) => {
        return {
          keys: {
            bufferFiltro: {
              ...bufferFiltro,
              formaPago: value || "",
            },
          },
        };
      },
    },
  ],
  onBufferFiltroFechaDesdeChanged: [
    {
      type: "setStateKeys",
      plug: (payload, { bufferFiltro }) => {
        return {
          keys: {
            bufferFiltro: {
              ...bufferFiltro,
              fechaDesde: payload.value,
            },
          },
        };
      },
    },
  ],
  onBufferFiltroFechaHastaChanged: [
    {
      type: "setStateKeys",
      plug: (payload, { bufferFiltro }) => {
        return {
          keys: {
            bufferFiltro: {
              ...bufferFiltro,
              fechaHasta: payload.value,
            },
          },
        };
      },
    },
  ],
  onBufferFiltroIntervaloFechaChanged: [
    {
      type: "setStateKeys",
      plug: (payload, { bufferFiltro }) => {
        const valor = payload.value;

        const interval = util.intervalos[valor];
        const intervalFechaDesde = interval.desde();
        const intervalFechaHasta = interval.hasta();

        // let intervalFechaDesde
        // let intervalFechaHasta

        // if (valor === 'nextyear') {
        //   intervalFechaDesde = util.today()
        //   intervalFechaHasta = new Date()
        //   intervalFechaHasta.setFullYear(intervalFechaHasta.getFullYear() + 1)
        //   intervalFechaHasta = `${intervalFechaHasta.getFullYear()}-${String(intervalFechaHasta.getMonth() + 1).padStart(2, '0')}-${String(intervalFechaHasta.getDate()).padStart(2, '0')}`
        // } else if (valor === 'nextmonth') {
        //   intervalFechaDesde = util.today()
        //   intervalFechaHasta = new Date()
        //   intervalFechaHasta.setMonth(intervalFechaHasta.getMonth() + 1)
        //   intervalFechaHasta = `${intervalFechaHasta.getFullYear()}-${String(intervalFechaHasta.getMonth() + 1).padStart(2, '0')}-${String(intervalFechaHasta.getDate()).padStart(2, '0')}`
        // } else if (valor === 'nextweek') {
        //   intervalFechaDesde = util.today()
        //   intervalFechaHasta = new Date()
        //   intervalFechaHasta.setDate(intervalFechaHasta.getDate() + 7)
        //   intervalFechaHasta = `${intervalFechaHasta.getFullYear()}-${String(intervalFechaHasta.getMonth() + 1).padStart(2, '0')}-${String(intervalFechaHasta.getDate()).padStart(2, '0')}`
        // }
        return {
          keys: {
            bufferFiltro: {
              ...bufferFiltro,
              intervaloFecha: payload.value,
              fechaDesde: intervalFechaDesde,
              fechaHasta: intervalFechaHasta,
            },
          },
        };
      },
    },
  ],
  onMostrarMovimientos: [
    {
      type: "function",
      function: payload => {},
      success: [
        {
          condition: (payload, { bufferFiltro }) =>
            bufferFiltro.fechaDesde !== null && bufferFiltro.fechaHasta !== null,
          type: "setStateKey",
          plug: (
            payload,
            { arrayRecibosCliente, arrayRecibosProv, arrayRecibosTesoManual, bufferFiltro },
          ) => {
            // FILTRADO CLIENTE
            let filtroCliente;

            if (bufferFiltro.cuenta === "" && bufferFiltro.formaPago === "") {
              filtroCliente = arrayRecibosCliente.filter(
                elem =>
                  elem.fechav >= bufferFiltro.fechaDesde && elem.fechav <= bufferFiltro.fechaHasta,
              );
            } else if (bufferFiltro.cuenta !== "" && bufferFiltro.formaPago === "") {
              filtroCliente = arrayRecibosCliente.filter(
                elem =>
                  elem.fechav >= bufferFiltro.fechaDesde &&
                  elem.fechav <= bufferFiltro.fechaHasta &&
                  elem.codcuentapago === bufferFiltro.cuenta,
              );
            } else if (bufferFiltro.formaPago !== "" && bufferFiltro.cuenta === "") {
              filtroCliente = arrayRecibosCliente.filter(
                elem =>
                  elem.fechav >= bufferFiltro.fechaDesde &&
                  elem.fechav <= bufferFiltro.fechaHasta &&
                  elem.codpago === bufferFiltro.formaPago,
              );
            } else {
              filtroCliente = arrayRecibosCliente.filter(
                elem =>
                  elem.fechav >= bufferFiltro.fechaDesde &&
                  elem.fechav <= bufferFiltro.fechaHasta &&
                  elem.codcuentapago === bufferFiltro.cuenta &&
                  elem.codpago === bufferFiltro.formaPago,
              );
            }

            const arraySinClientes = filtroCliente.map(recibo => {
              return {
                fechav: recibo.fechav,
                importerecibo: recibo.importerecibo,
              };
            });

            const arrayClienteAgrupado = arraySinClientes.reduce((acum, actual) => {
              const existe = acum.find(e => e.fechav === actual.fechav);
              if (existe) {
                return acum.map(e => {
                  if (e.fechav === actual.fechav) {
                    return {
                      ...e,
                      importerecibo: e.importerecibo + actual.importerecibo,
                    };
                  }

                  return e;
                });
              }

              return [...acum, actual];
            }, []);

            // FILTRADO PROOVEDOR
            let filtroProveedor;

            if (bufferFiltro.cuenta === "" && bufferFiltro.formaPago === "") {
              filtroProveedor = arrayRecibosProv.filter(
                elem =>
                  elem.fechav >= bufferFiltro.fechaDesde && elem.fechav <= bufferFiltro.fechaHasta,
              );
            } else if (bufferFiltro.cuenta !== "" && bufferFiltro.formaPago === "") {
              filtroProveedor = arrayRecibosProv.filter(
                elem =>
                  elem.fechav >= bufferFiltro.fechaDesde &&
                  elem.fechav <= bufferFiltro.fechaHasta &&
                  elem.codcuentapago === bufferFiltro.cuenta,
              );
            } else if (bufferFiltro.formaPago !== "" && bufferFiltro.cuenta === "") {
              filtroProveedor = arrayRecibosProv.filter(
                elem =>
                  elem.fechav >= bufferFiltro.fechaDesde &&
                  elem.fechav <= bufferFiltro.fechaHasta &&
                  elem.codpago === bufferFiltro.formaPago,
              );
            } else {
              filtroProveedor = arrayRecibosProv.filter(
                elem =>
                  elem.fechav >= bufferFiltro.fechaDesde &&
                  elem.fechav <= bufferFiltro.fechaHasta &&
                  elem.codcuentapago === bufferFiltro.cuenta &&
                  elem.codpago === bufferFiltro.formaPago,
              );
            }

            const arraySinProveedor = filtroProveedor.map(recibo => {
              return {
                fechav: recibo.fechav,
                importerecibo: recibo.importerecibo,
              };
            });

            const arrayProvAgrupado = arraySinProveedor.reduce((acum, actual) => {
              const existe = acum.find(e => e.fechav === actual.fechav);
              if (existe) {
                return acum.map(e => {
                  if (e.fechav === actual.fechav) {
                    return {
                      ...e,
                      importerecibo: e.importerecibo + actual.importerecibo,
                    };
                  }

                  return e;
                });
              }

              return [...acum, actual];
            }, []);

            // FILTRADO MANUAL
            let filtroManual;

            if (bufferFiltro.cuenta === "") {
              filtroManual = arrayRecibosTesoManual.filter(
                elem =>
                  elem.fechav >= bufferFiltro.fechaDesde && elem.fechav <= bufferFiltro.fechaHasta,
              );
            } else {
              filtroManual = arrayRecibosTesoManual.filter(
                elem =>
                  elem.fechav >= bufferFiltro.fechaDesde &&
                  elem.fechav <= bufferFiltro.fechaHasta &&
                  elem.codcuentapago === bufferFiltro.cuenta,
              );
            }

            // SI ES UN PAGO, LA CANTIDAD ES NEGATIVA
            const arraySinManual = filtroManual.map(recibo => {
              if (recibo.tipo === "Pago" && recibo.importerecibo > 0) {
                recibo.importerecibo = recibo.importerecibo * -1;
              }

              return {
                fechav: recibo.fechav,
                importerecibo: recibo.importerecibo,
              };
            });

            const arrayManualAgrupado = arraySinManual.reduce((acum, actual) => {
              const existe = acum.find(e => e.fechav === actual.fechav);
              if (existe) {
                return acum.map(e => {
                  if (e.fechav === actual.fechav) {
                    return {
                      ...e,
                      importerecibo: e.importerecibo + actual.importerecibo,
                    };
                  }

                  return e;
                });
              }

              return [...acum, actual];
            }, []);

            // ORDENADO FECHAS
            const arrayordenado = arrayProvAgrupado.reduce((acum, actual) => {
              const existe = acum.find(e => e.fechav === actual.fechav);
              if (existe) {
                return acum.map(e => {
                  if (e.fechav === actual.fechav) {
                    return {
                      ...e,
                      importerecibo: e.importerecibo - actual.importerecibo,
                    };
                  }

                  return e;
                });
              }

              return [
                ...acum,
                {
                  fechav: actual.fechav,
                  importerecibo: actual.importerecibo * -1,
                },
              ];
            }, arrayClienteAgrupado);

            let arrayordenadoFinal;

            if (bufferFiltro.formaPago === "") {
              arrayordenadoFinal = arrayManualAgrupado.reduce((acum, actual) => {
                const existe = acum.find(e => e.fechav === actual.fechav);
                if (existe) {
                  return acum.map(e => {
                    if (e.fechav === actual.fechav) {
                      return {
                        ...e,
                        importerecibo: e.importerecibo + actual.importerecibo,
                      };
                    }

                    return e;
                  });
                }

                return [
                  ...acum,
                  {
                    fechav: actual.fechav,
                    importerecibo: actual.importerecibo,
                  },
                ];
              }, arrayordenado);
            } else {
              arrayordenadoFinal = arrayordenado;
            }

            arrayordenadoFinal.sort(function (a, b) {
              return new Date(a.fechav) - new Date(b.fechav);
            });

            // CALCULO SALDO
            let saldo = bufferFiltro.saldoCuenta;
            const arrayFinal = arrayordenadoFinal.map(e => {
              saldo += e.importerecibo;

              return {
                ...e,
                saldo,
              };
            });

            return {
              path: "recibosOrdenados",
              value: arrayFinal,
            };
          },
        },
      ],
    },
  ],
  onRecibosClicked: [
    {
      type: "function",
      function: payload => {},
    },
    {
      condition: payload => payload.item !== "",
      type: "setStateKeys",
      plug: (
        payload,
        { arrayRecibosCliente, arrayRecibosProv, arrayRecibosTesoManual, bufferFiltro },
      ) => {
        let arrayCliente;

        if (bufferFiltro.cuenta === "" && bufferFiltro.formaPago === "") {
          arrayCliente = arrayRecibosCliente.filter(elem => elem.fechav === payload.item);
        } else if (bufferFiltro.cuenta !== "" && bufferFiltro.formaPago === "") {
          arrayCliente = arrayRecibosCliente.filter(
            elem => elem.fechav === payload.item && elem.codcuentapago === bufferFiltro.cuenta,
          );
        } else if (bufferFiltro.formaPago !== "" && bufferFiltro.cuenta === "") {
          arrayCliente = arrayRecibosCliente.filter(
            elem => elem.fechav === payload.item && elem.codpago === bufferFiltro.formaPago,
          );
        } else {
          arrayCliente = arrayRecibosCliente.filter(
            elem =>
              elem.fechav === payload.item &&
              elem.codcuentapago === bufferFiltro.cuenta &&
              elem.codpago === bufferFiltro.formaPago,
          );
        }

        let arrayProveedor;

        if (bufferFiltro.cuenta === "" && bufferFiltro.formaPago === "") {
          arrayProveedor = arrayRecibosProv.filter(elem => elem.fechav === payload.item);
        } else if (bufferFiltro.cuenta !== "" && bufferFiltro.formaPago === "") {
          arrayProveedor = arrayRecibosProv.filter(
            elem => elem.fechav === payload.item && elem.codcuentapago === bufferFiltro.cuenta,
          );
        } else if (bufferFiltro.formaPago !== "" && bufferFiltro.cuenta === "") {
          arrayProveedor = arrayRecibosProv.filter(
            elem => elem.fechav === payload.item && elem.codpago === bufferFiltro.formaPago,
          );
        } else {
          arrayProveedor = arrayRecibosProv.filter(
            elem =>
              elem.fechav === payload.item &&
              elem.codcuentapago === bufferFiltro.cuenta &&
              elem.codpago === bufferFiltro.formaPago,
          );
        }

        arrayProveedor = arrayProveedor.map(e => {
          return {
            ...e,
            importerecibo: e.importerecibo * -1,
          };
        });

        let arrayManual;

        if (bufferFiltro.cuenta === "") {
          arrayManual = arrayRecibosTesoManual.filter(elem => elem.fechav === payload.item);
        } else {
          arrayManual = arrayRecibosTesoManual.filter(
            elem => elem.fechav === payload.item && elem.codcuentapago === bufferFiltro.cuenta,
          );
        }

        let arrayFecha = arrayCliente.concat(arrayProveedor);

        //SI FILTRAMOS POR PAGO, LOS MANUALES NO LOS MOSTRAMOS YA QUE NO TIENEN ESE CAMPO
        if (bufferFiltro.formaPago === "") {
          arrayFecha = arrayFecha.concat(arrayManual);
        }

        return {
          keys: {
            fechaCurrent: payload.item,
            recibosDetalle: arrayFecha,
          },
        };
      },
    },
  ],
  onAtrasClicked: [
    {
      type: "navigate",
      url: () => "/dashboardTesoreria",
    },
    {
      type: "setStateKeys",
      plug: (payload, { bufferFiltro }) => {
        return {
          keys: {
            recibosDetalle: [],
            fechaCurrent: null,
          },
        };
      },
    },
  ],
});
