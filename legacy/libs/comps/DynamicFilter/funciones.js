import { subDays } from "@quimera/thirdparty";
import { util } from "quimera";
// import $ from 'jquery'

const signosToQuimeraAPI = { "<=": "lte", "=": "eq", ">=": "gte" };

export const generarFiltro = (autocompleteValue, propiedades) => {
  const valores = Array.isArray(autocompleteValue)
    ? autocompleteValue.reduce(
        (accumulated, actual) => ({
          ...accumulated,
          [actual.nombreCampo]: actual.opciones || actual.value,
        }),
        {},
      )
    : autocompleteValue;

  const clausulas = []; /* hola */
  propiedades.forEach(option => {
    if (option.nombreCampo in valores) {
      const nombreCampo = option.nombreCampo;
      const valor = valores[nombreCampo];
      if (option.tipoCampo === "apiselect") {
        clausulas.push([option.nombreCampo, "eq", valor.key]);
        // No necesario puesto que opción viene de propiedades y no de autocompleteValue
        // const prop1 = propiedades.filter(p => p.nombreCampo === option.nombreCampo)
        // if (prop1.length > 0 && prop1[0].componente) {
        //   option.componente = prop1[0].componente
        // }
      }

      switch (option.tipoCampo) {
        case "string":
          clausulas.push([nombreCampo, "like", valor]);
          break;

        case "checkboxmultiple": {
          const clausulaOr = [];
          const optionValues = Array.isArray(valor) ? valor : [valor];
          optionValues.forEach(op =>
            op.value ? clausulaOr.push([nombreCampo, "eq", op.key]) : null,
          );
          clausulaOr.length > 0 && clausulas.push({ or: clausulaOr });
          break;
        }

        case "null":
          clausulas.push([nombreCampo, valor ? "is_falsy" : "is_not_falsy"]);
          break;

        case "boolean":
          clausulas.push([nombreCampo, "eq", valor]);
          break;

        case "date": {
          let valorTraducir;
          if (valor.persistencia) {
            !rangosEIntervalosFecha[valor.persistencia] &&
              alert("campo persistencia no coincide, revisar prop propiedades");
            valorTraducir = rangosEIntervalosFecha[valor.persistencia];
          } else {
            valorTraducir = Object.assign({}, valor); // copiamos objeto
          }
          valorTraducir.fecha && clausulas.push([nombreCampo, "eq", valorTraducir.fecha]);
          valorTraducir.desde && clausulas.push([nombreCampo, "gte", valorTraducir.desde]);
          valorTraducir.hasta && clausulas.push([nombreCampo, "lte", valorTraducir.hasta]);
          if (!valorTraducir.fecha && !valorTraducir.desde && !valorTraducir.hasta) {
            clausulas.push([nombreCampo, "is_null"]);
          }
          break;
        }

        case "number":
          clausulas.push([nombreCampo, signosToQuimeraAPI[option.signo] || "eq", valor]);
          break;
      }
    }
  });

  return clausulas.length > 0 ? { and: clausulas } : {};
};

export const cargarFiltro = (valores, propiedades) => {
  const filtro = []; /* hola */
  propiedades.forEach(option => {
    if (option.nombreCampo in valores) {
      const valor = valores[option.nombreCampo];
      const criterio = Object.assign({}, option);
      filtro.push({ ...criterio, ...valor });
    }
  });

  return filtro;
};

export const volcarFiltro = filtro => {
  const valores = {};
  filtro.forEach(clausula => {
    const tipoCampo = clausula.tipoCampo;
    const nombreCampo = clausula.nombreCampo;
    if (["apiselect", "string", "boolean"].includes(tipoCampo)) {
      valores[nombreCampo] = { value: clausula.value };
    }
    if (["checkboxmultiple"].includes(tipoCampo)) {
      valores[nombreCampo] = { opciones: clausula.opciones, value: clausula.value };
    }
    if (["date"].includes(tipoCampo)) {
      valores[nombreCampo] = { value: { ...clausula.value } };
    }
    if (["number"].includes(tipoCampo)) {
      valores[nombreCampo] = { signo: clausula.signo, value: clausula.valor };
    }
  });

  return valores;
};

// export const generarFiltro = (autocompleteValue, propiedades) => {
//   const clausulas = [] /* hola */
//   autocompleteValue.forEach(option => {
//     if (option.tipoCampo === 'apiselect') {
//       clausulas.push([option.nombreCampo, 'eq', option.value.key])
//       const prop1 = propiedades.filter(p => p.nombreCampo === option.nombreCampo)
//       if (prop1.length > 0 && prop1[0].componente) {
//         option.componente = prop1[0].componente
//       }
//     }

//     switch (option.tipoCampo) {
//       case 'string':
//         clausulas.push([option.nombreCampo, 'like', option.value])
//         break

//       case 'checkboxmultiple':
//       {
//         const clausulaOr = []
//         option.options.forEach(op =>
//           op.value ? clausulaOr.push([option.nombreCampo, 'eq', op.key]) : null
//         )
//         clausulaOr.length > 0 && clausulas.push({ or: clausulaOr })
//         break
//       }

//       case 'boolean':
//         clausulas.push([option.nombreCampo, 'eq', option.value])
//         break

//       case 'date':
//       {
//         let valorTraducir
//         if (option.value.persistencia) {
//           !rangosEIntervalosFecha[option.value.persistencia] && alert('campo persistencia no coincide, revisar prop propiedades')
//           valorTraducir = rangosEIntervalosFecha[option.value.persistencia]
//         } else {
//           valorTraducir = Object.assign({}, option.value) // copiamos objeto
//         }
//         valorTraducir.fecha && clausulas.push([option.nombreCampo, 'eq', valorTraducir.fecha])
//         valorTraducir.desde && clausulas.push([option.nombreCampo, 'gte', valorTraducir.desde])
//         valorTraducir.hasta && clausulas.push([option.nombreCampo, 'lte', valorTraducir.hasta])
//         if (!valorTraducir.fecha && !valorTraducir.desde && !valorTraducir.hasta) {
//           clausulas.push([option.nombreCampo, 'is_null'])
//         }
//         break
//       }

//       case 'number':
//         clausulas.push([option.nombreCampo, signosToQuimeraAPI[option.signo] || 'eq', option.value])
//         break
//     }
//   })
//   const filtro = clausulas.length > 0 ? { and: clausulas } : {}
//   return filtro
// }

export const filtrosPredAFiltrosAdaptados = (propiedades, filtrosPredefinidos) => {
  // solo funciona para dailyjob
  // de filtros que nos llegan de la tabla sisfilter a filtros entendibles por DynamicFilter
  const filtrosPreAdaptados = [];

  filtrosPredefinidos.forEach(filtroP => {
    const nuevoFiltro = {};
    nuevoFiltro.tipo = "filtroDeFiltros";
    nuevoFiltro.nombre = filtroP.descripcion;
    nuevoFiltro.labelNombre = filtroP.descripcion;
    const filtroJSON = JSON.parse(filtroP.filtro);
    const propiedadesF = [];
    propiedades.forEach(p => {
      if (
        filtroJSON[p.nombreCampo] ||
        (p.otrosIdentificativos &&
          tieneElObjetoAlgunaDeEstasClaves(filtroJSON, p.otrosIdentificativos))
      ) {
        // const claveObj = filtroJSON[p.nombreCampo] ? p.nombreCampo : queClaveDeEsteArrayTieneElObjeto(filtroJSON, p.otrosIdentificativos)
        const claveObj =
          queClaveDeEsteArrayTieneElObjeto(filtroJSON, p.otrosIdentificativos) ||
          (filtroJSON[p.nombreCampo] && p.nombreCampo);

        let valueFiltroP = filtroJSON[claveObj];
        // MAL LOS SUB_OBJETOS DE DENTRO SIGUEN TENIENDO LA MISMA REFERENCIA!! https://platzi.com/blog/como-copiar-objetos-en-javascript-sin-morir-en-el-intento/
        // const aCambiar = Object.assign({}, p) // copiamos el objeto
        const aCambiar = JSON.parse(JSON.stringify(p)); // si da problemas usar la clonación profunda de jquery
        // const aCambiar = $.extend({}, p) // deep cloning jquery
        p.porDefecto = false;
        switch (aCambiar.tipoCampo) {
          case "string":
            aCambiar.value = rangosEIntervalosString[valueFiltroP] || valueFiltroP;
            propiedadesF.push(aCambiar);
            break;
          case "apiselect":
            valueFiltroP = valueFiltroP === "me" ? util.getUser().user : valueFiltroP; // si es idUsuario
            aCambiar.value.key = valueFiltroP;
            propiedadesF.push(aCambiar);
            break;
          case "null":
          case "notnull":
          case "boolean":
            aCambiar.value = Boolean(valueFiltroP);
            propiedadesF.push(aCambiar);
            break;
          case "checkboxmultiple": {
            const valor = rangosEIntervalosCheckboxmultiple[valueFiltroP] || valueFiltroP;
            const tieneValorElValue = aCambiar.opciones.find(op => op.key === valor);
            aCambiar.value = tieneValorElValue ? tieneValorElValue.valor : valor;
            // aCambiar.value = valueFiltroP
            // aCambiar.opciones.forEach(op => { op.value = false }) // reseteamos
            aCambiar.opciones.forEach(op => {
              if (op.key === valor) {
                op.value = true; /* ;  alert(filtroP.descripcion + p.nombreCampo + op.key + ' == ' + valueFiltroP) */
              }
            });
            propiedadesF.push(aCambiar);
            break;
          }
          case "date": {
            let fechaValue;
            if (rangosEIntervalosFecha[valueFiltroP] && deRangosARangosMostrar[valueFiltroP]) {
              // si es un rango persistente
              fechaValue = {
                nombre: deRangosARangosMostrar[valueFiltroP],
                persistencia: valueFiltroP,
              };
            } else {
              fechaValue = { desde: null, hasta: null, fecha: valueFiltroP };
            }
            aCambiar.value = JSON.parse(JSON.stringify(fechaValue));
            propiedadesF.push(aCambiar);
            break;
          }
        }
      }
    });
    nuevoFiltro.propiedades = propiedadesF;
    nuevoFiltro.propiedades.length > 0 && filtrosPreAdaptados.push(nuevoFiltro); // si ha encontrado alguno lo añadimos
  });

  return filtrosPreAdaptados;
};

const tieneElObjetoAlgunaDeEstasClaves = (obj, arrayClaves) => {
  for (let i = 0; i < arrayClaves.length; i++) {
    if (obj[arrayClaves[i]]) {
      return true;
    }
  }

  return false;
};

const queClaveDeEsteArrayTieneElObjeto = (obj, arrayClaves) => {
  if (!arrayClaves) {
    return;
  }
  let clave;
  for (let i = 0; i < arrayClaves.length; i++) {
    if (obj[arrayClaves[i]]) {
      if (arrayClaves[i].substr(0, 2) === "i_") {
        clave = arrayClaves[i];
      } else if (!clave) {
        clave = arrayClaves[i];
      }
      // return arrayClaves[i]
    }
  }

  return clave;
};

// claves valor para rangos e intervalos para fechas (campos date), tiene que haber los mismos que en el objeto deRangosARangosMostrar
const rangosEIntervalosFecha = {
  hoy: { desde: null, hasta: null, fecha: util.today() },
  ayer: { desde: null, hasta: null, fecha: util.yesterday() },
  manana: { desde: null, hasta: null, fecha: util.tomorrow() },
  hastaayer: { desde: null, hasta: util.yesterday(), fecha: null },
  estasemana: { desde: util.firstOfWeek(), hasta: util.lastOfWeek(), fecha: null },
  estemes: { desde: util.firstOfMonth(), hasta: util.lastOfMonth(), fecha: null },
  esteanyio: { desde: util.firstOfYear(), hasta: util.lastOfYear(), fecha: null },
  ultimos7dias: { desde: util.dateToIsoString(subDays(new Date(), 7)), hasta: null, fecha: null },
  ultimos30dias: { desde: util.dateToIsoString(subDays(new Date(), 30)), hasta: null, fecha: null },
  hastaHace7dias: { desde: null, hasta: util.dateToIsoString(subDays(new Date(), 8)), fecha: null },
  ultimos15dias: {
    desde: util.dateToIsoString(subDays(new Date(), 15)),
    hasta: util.today(),
    fecha: null,
  },
  haceMasDe30dias: {
    desde: null,
    hasta: util.dateToIsoString(subDays(new Date(), 30)),
    fecha: null,
  },
};

// tiene que haber los mismos que en el objeto rangosEIntervalosFecha
const deRangosARangosMostrar = {
  hoy: "Hoy",
  ayer: "Ayer",
  manana: "Mañana",
  hastaayer: "Hasta ayer",
  estasemana: "Esta Semana",
  estemes: "Este mes",
  esteanyio: "Este año",
  ultimos7dias: "Últimos 7 días",
  ultimos30dias: "Últimos 30 días",
  hastaHace7dias: "Hasta hace 7 días",
  ultimos15dias: "Últimos 15 días",
  haceMasDe30dias: "Hace más de 30 días",
};

const rangosEIntervalosString = {
  thisyear: new Date().getFullYear().toString(),
};

const rangosEIntervalosCheckboxmultiple = {
  thismonth: `0${new Date().getMonth() + 1}`.slice(-2),
};
