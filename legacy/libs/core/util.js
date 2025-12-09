import { formatRelative, localesFns as locales } from "@quimera/thirdparty";

const user = JSON.parse(localStorage.getItem("user"));
const localSettings = {};
let environment = {};
let mediaWidth = null;

function formatter(value, decimalNumber = 2) {
  if (!value) {
    return value;
  }
  const currentLocale = getLocale();
  // Con es-Es no aparecen los . de los miles
  // const LANGUAGE_CODE = navigator.language || navigator.userLanguage

  // const nFormat = new Intl.NumberFormat('de-DE', { style: 'decimal', maximumFractionDigits: decimalNumber, useGrouping: true })
  const nFormat = new Intl.NumberFormat(currentLocale, {
    style: "decimal",
    maximumFractionDigits: decimalNumber,
    minimumFractionDigits: decimalNumber,
    useGrouping: true,
  });
  value = nFormat.format(value);

  if (!value) {
    return false;
  }

  return value;
}

function euros(value) {
  if (value === null || value === undefined) {
    return value;
  }
  const currentLocale = getLocale() === "es-ES" ? "de-DE" : getLocale();
  // Con es-Es no aparecen los . de los miles
  // const LANGUAGE_CODE = navigator.language || navigator.userLanguage

  // const nFormat = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', useGrouping: true })
  const nFormat = new Intl.NumberFormat(currentLocale, {
    style: "currency",
    currency: "EUR",
    useGrouping: true,
  });

  value = nFormat.format(value);

  if (!value) {
    return false;
  }

  return value;
}

function formatDate(value) {
  if (value == null) {
    return "";
  }
  const timeZone = getZonaHoraria();
  const options = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    timeZone,
  };
  const fecha = new Date(Date.parse(value));
  const currentLocale = getLocale();

  // alert(locale)
  return fecha.toLocaleDateString(/* 'es-ES' */ currentLocale, options);
}

function getLocale() {
  return user ? user.locale || navigator.language : navigator.language; // es-ES
}

function renderHeader() {
  const render_header = environment.renderHeader;
  if (render_header === false) return false;

  return true;
}

function setSetting(clave, valor) {
  localSettings[clave] = valor;
}

function getSetting(clave) {
  return localSettings[clave];
}

// las funciones Global son las que guardan en el navegador y las que no llevan Global las que guardan en memoria

function getGlobalSetting(clave) {
  return JSON.parse(localStorage.getItem(clave));
}

function setGlobalSetting(clave, valor) {
  localStorage && localStorage.setItem(clave, JSON.stringify(valor));
}

function newDate() {
  return new Date();
}

function addDays(date, days) {
  return date.setDate(date.getDate() + days);
}

function addMonths(date, months) {
  return date.setMonth(date.getMonth() + months);
}

function addYears(date, years) {
  return date.setFullYear(date.getFullYear() + years);
}

function setFirstMonthDay(date) {
  return date.setDate(1);
}

function setPreviousDay(date) {
  return addDays(date, -1);
}

function setNextDay(date) {
  return addDays(date, 1);
}

function setLastMonthDay(date) {
  date.setMonth(date.getMonth() + 1);

  return date.setDate(0);
}

function setFirstWeekDay(date) {
  const weekDay = date.getDay() || 7;

  return addDays(date, (weekDay - 1) * -1);
}

function setLastWeekDay(date) {
  const weekDay = date.getDay() || 7;

  return addDays(date, 7 - weekDay);
}

function setFirstMonth(date) {
  return date.setMonth(0);
}

function setPreviousMonth(date) {
  return addMonths(date, -1);
}

function setNextMonth(date) {
  return addMonths(date, 1);
}

function setLastMonth(date) {
  return date.setMonth(11);
}

function setPreviousYear(date) {
  return addYears(date, -1);
}

function setNextYear(date) {
  return addYears(date, 1);
}

function dateToIsoString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function timeToIsoString(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(
    2,
    "0",
  )}:${String(date.getSeconds()).padStart(2, "0")}`;
}

function getZonaHoraria() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function firstOfWeek() {
  const date = newDate();
  setFirstWeekDay(date);

  return dateToIsoString(date);
}

function lastOfWeek() {
  const date = newDate();
  setLastWeekDay(date);

  return dateToIsoString(date);
}

function lastNDays(n) {
  const date = newDate();
  addDays(date, n * -1);

  return dateToIsoString(date);
}

function nextNDays(n) {
  const date = newDate();
  addDays(date, n);

  return dateToIsoString(date);
}

function lastNMonths(n) {
  const date = newDate();
  addMonths(date, n * -1);

  return dateToIsoString(date);
}

function nextNMonths(n) {
  const date = newDate();
  addMonths(date, n);

  return dateToIsoString(date);
}

function lastNYears(n) {
  const date = newDate();
  addYears(date, n * -1);

  return dateToIsoString(date);
}

function nextNYears(n) {
  const date = newDate();
  addYears(date, n);

  return dateToIsoString(date);
}

function firstOfPreviousWeek() {
  const date = newDate();
  addDays(date, -7);
  setFirstWeekDay(date);

  return dateToIsoString(date);
}

function lastOfPreviousWeek() {
  const date = newDate();
  addDays(date, -7);
  setLastWeekDay(date);

  return dateToIsoString(date);
}

function firstOfNextWeek() {
  const date = newDate();
  addDays(date, 7);
  setFirstWeekDay(date);

  return dateToIsoString(date);
}

function lastOfNextWeek() {
  const date = newDate();
  addDays(date, 7);
  setLastWeekDay(date);

  return dateToIsoString(date);
}

function firstOfMonth() {
  const date = newDate();
  setFirstMonthDay(date);

  return dateToIsoString(date);
}

function lastOfMonth() {
  const date = newDate();
  setLastMonthDay(date);

  return dateToIsoString(date);
}

function firstOfPreviousMonth() {
  const date = newDate();
  setPreviousMonth(date);
  setFirstMonthDay(date);

  return dateToIsoString(date);
}

function lastOfPreviousMonth() {
  const date = newDate();
  setPreviousMonth(date);
  setLastMonthDay(date);

  return dateToIsoString(date);
}

function firstOfNextMonth() {
  const date = newDate();
  setNextMonth(date);
  setFirstMonthDay(date);

  return dateToIsoString(date);
}

function lastOfNextMonth() {
  const date = newDate();
  setNextMonth(date);
  setLastMonthDay(date);

  return dateToIsoString(date);
}

function firstOfYear() {
  const date = newDate();
  setFirstMonth(date);
  setFirstMonthDay(date);

  return dateToIsoString(date);
}

function lastOfYear() {
  const date = newDate();
  setLastMonth(date);
  setLastMonthDay(date);

  return dateToIsoString(date);
}

function firstOfPreviousYear() {
  const date = newDate();
  setPreviousYear(date);
  setFirstMonth(date);
  setFirstMonthDay(date);

  return dateToIsoString(date);
}

function oneYearAgo() {
  const date = newDate();
  setPreviousYear(date);

  return dateToIsoString(date);
}

function lastOfPreviousYear() {
  const date = newDate();
  setPreviousYear(date);
  setLastMonth(date);
  setLastMonthDay(date);

  return dateToIsoString(date);
}

function firstOfNextYear() {
  const date = newDate();
  setNextYear(date);
  setFirstMonth(date);
  setFirstMonthDay(date);

  return dateToIsoString(date);
}

function lastOfNextYear() {
  const date = newDate();
  setNextYear(date);
  setLastMonth(date);
  setLastMonthDay(date);

  return dateToIsoString(date);
}

function today() {
  return dateToIsoString(newDate());
}

function yesterday() {
  const date = newDate();
  setPreviousDay(date);

  return dateToIsoString(date);
}

function tomorrow() {
  const date = newDate();
  setNextDay(date);

  return dateToIsoString(date);
}

const intervalByDay = {
  today: {
    nombre: "Hoy",
    desde: today,
    hasta: today,
  },
  yesterday: {
    nombre: "Ayer",
    desde: yesterday,
    hasta: yesterday,
  },
  tomorrow: {
    nombre: "Mañana",
    desde: tomorrow,
    hasta: tomorrow,
  },
  untilToday: {
    nombre: "Hasta hoy",
    desde: () => null,
    hasta: yesterday,
  },
  fromToday: {
    nombre: "A partir de mañana",
    desde: tomorrow,
    hasta: () => null,
  },
};

const intervalByWeek = {
  thisWeek: { nombre: "Esta semana", desde: firstOfWeek, hasta: lastOfWeek },
  lastWeek: {
    nombre: "Semana pasada",
    desde: firstOfPreviousWeek,
    hasta: lastOfPreviousWeek,
  },
  nextWeek: {
    nombre: "Semana que viene",
    desde: firstOfNextWeek,
    hasta: lastOfNextWeek,
  },
  preWeek: {
    nombre: "Última semana",
    desde: () => lastNDays(7),
    hasta: today,
  },
  postWeek: {
    nombre: "Próxima semana",
    desde: today,
    hasta: () => nextNDays(7),
  },
  untilThisWeek: {
    nombre: "Hasta esta semana",
    desde: () => null,
    hasta: lastOfPreviousWeek,
  },
  fromThisWeek: {
    nombre: "A partir de esta semana",
    desde: firstOfNextWeek,
    hasta: () => null,
  },
};

const intervalByMonth = {
  thisMonth: { nombre: "Este mes", desde: firstOfMonth, hasta: lastOfMonth },
  lastMonth: {
    nombre: "Mes pasado",
    desde: firstOfPreviousMonth,
    hasta: lastOfPreviousMonth,
  },
  nextMonth: {
    nombre: "Mes que viene",
    desde: firstOfNextMonth,
    hasta: lastOfNextMonth,
  },
  preMonth: {
    nombre: "Último mes",
    desde: () => lastNMonths(1),
    hasta: today,
  },
  postMonth: {
    nombre: "Próximo mes",
    desde: today,
    hasta: () => nextNMonths(1),
  },
  untilThisMonth: {
    nombre: "Hasta este mes",
    desde: () => null,
    hasta: lastOfPreviousMonth,
  },
  fromThisMonth: {
    nombre: "A partir de este mes",
    desde: firstOfNextMonth,
    hasta: () => null,
  },
};

const intervalByYear = {
  thisYear: { nombre: "Este año", desde: firstOfYear, hasta: lastOfYear },
  lastYear: {
    nombre: "Año pasado",
    desde: firstOfPreviousYear,
    hasta: lastOfPreviousYear,
  },
  nextYear: {
    nombre: "Año que viene",
    desde: firstOfNextYear,
    hasta: lastOfNextYear,
  },
  preYear: {
    nombre: "Último año",
    desde: () => lastNYears(1),
    hasta: today,
  },
  postYear: {
    nombre: "Próximo año",
    desde: today,
    hasta: () => nextNYears(1),
  },
  untilThisYear: {
    nombre: "Hasta este año",
    desde: () => null,
    hasta: lastOfPreviousYear,
  },
  fromThisYear: {
    nombre: "A partir de este año",
    desde: firstOfNextYear,
    hasta: () => null,
  },
};

const dynamicIntervals = {
  preNDays: days => ({
    nombre: `Últimos ${days} días`,
    desde: () => lastNDays(days),
    hasta: today,
  }),
  postNDays: days => ({
    nombre: `Próximos ${days} días`,
    desde: today,
    hasta: () => nextNDays(days),
  }),
  preNWeeks: weeks => ({
    nombre: `Últimas ${weeks} semanas`,
    desde: () => lastNDays(weeks * 7),
    hasta: today,
  }),
  postNWeeks: weeks => ({
    nombre: `Próximas ${weeks} semanas`,
    desde: today,
    hasta: () => nextNDays(weeks * 7),
  }),
  preNMonths: months => ({
    nombre: `Últimos ${months} meses`,
    desde: () => lastNMonths(months),
    hasta: today,
  }),
  postNMonths: months => ({
    nombre: `Próximos ${months} meses`,
    desde: today,
    hasta: () => nextNMonths(months),
  }),
  preNYears: years => ({
    nombre: `Últimos ${years} años`,
    desde: () => lastNYears(years),
    hasta: today,
  }),
  postNYears: years => ({
    nombre: `Próximos ${years} años`,
    desde: today,
    hasta: () => nextNYears(years),
  }),
};

const intervalos = {
  "": {
    nombre: "Vacío",
    desde: () => null,
    hasta: () => null,
  },
  ...intervalByDay,
  ...intervalByWeek,
  ...intervalByMonth,
  ...intervalByYear,
};

const capitalize = s => (typeof s === "string" ? `${s.charAt(0).toUpperCase()}${s.slice(1)}` : s);

let sessionUser = null;
let tr = null;

const isObject = item => item && typeof item === "object" && !Array.isArray(item);

const mergeDeep = (target, source) => {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
};

const funciones = {
  now() {
    return timeToIsoString(newDate());
  },
  renderHeader,
  mergeDeep,
  isObject,
  today,
  yesterday,
  tomorrow,
  firstOfWeek,
  lastOfWeek,
  lastNDays,
  firstOfPreviousWeek,
  lastOfPreviousWeek,
  firstOfNextWeek,
  lastOfNextWeek,
  firstOfMonth,
  lastOfMonth,
  firstOfPreviousMonth,
  lastOfPreviousMonth,
  firstOfNextMonth,
  lastOfNextMonth,
  firstOfYear,
  lastOfYear,
  firstOfPreviousYear,
  lastOfPreviousYear,
  firstOfNextYear,
  lastOfNextYear,
  oneYearAgo,
  setTranslateFunction(f) {
    tr = f;
  },
  translate(a, b) {
    return tr(a, b);
  },
  getOptionByKey(options, itemKeyValue, optionKey, itemKey) {
    optionKey = optionKey || "key";
    itemKey = itemKey || optionKey;
    const item = {};
    item[itemKey] = itemKeyValue;

    return this.getOption(options, item, optionKey, itemKey);
  },
  getOption(options, item, optionKey, itemKey) {
    if (this.isEmptyObject(item)) {
      return {};
    }
    if (options.length === 0) {
      return item;
    }
    optionKey = optionKey || "key";
    itemKey = itemKey || optionKey;

    return this.findOption(options, optionKey, item[itemKey]);
  },
  findOption(options, keyName, keyValue) {
    if (keyValue === undefined) {
      return {};
    }
    const incluidos = options.filter(o => o[keyName] === keyValue);
    if (incluidos.length > 0) {
      return incluidos[0];
    }

    return {};
  },
  getOptions(options, items, optionKey, itemKey) {
    if (items.length === 0) {
      return [];
    }
    if (options.length === 0) {
      return items;
    }
    optionKey = optionKey || "key";
    itemKey = itemKey || optionKey;
    const seleccionados = items.reduce((accumulated, item) => {
      const seleccionado = options.filter(option => option[optionKey] === item[itemKey]);

      return [...accumulated, ...seleccionado];
    }, []);

    return seleccionados;
  },
  relativeTime: ISOStrDate =>
    formatRelative(new Date(ISOStrDate), new Date(), {
      locale,
      weekStartsOn: 1,
    }),
  getAttr: (obj, attr, def) => (attr in obj ? obj[attr] || def : def),
  // setUser: u => { user = localStorage.setItem('user', u) },
  // getUser: () => JSON.parse(localStorage.getItem('user')),
  setUser: u => {
    sessionUser = u;
  },
  getUser: () => sessionUser,
  getUserToken: () => {
    const get_token_fn = environment.getToken;

    if (get_token_fn) return get_token_fn();

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const token = currentUser && currentUser.token ? `Token ${currentUser.token}` : false;

    return token;
  },
  setUserToken: t => {
    const set_token_fn = environment.setToken;

    if (set_token_fn) return set_token_fn();

    localStorage.setItem("user", `{"token":"${t}"}`);
  },
  capitalize: s => capitalize(s),
  formatter: (v, n) => formatter(v, n),
  euros: v => euros(v),
  formatDate: v => formatDate(v),
  // camelId: id => id ? id.toString().slice(0, id.indexOf('/')).split('.').map(s => capitalize(s)).join('') : '',
  camelId: id =>
    id
      ? id
          .toString()
          .replace(/\/\w+/g, "")
          .split(".")
          .map(s => capitalize(s))
          .join("")
      : "",
  // getStateValue: (field, state, def) => field ? field.split('.').reduce((val, prop) => val[prop], state) : def,
  getStateValue: (field, state, def) =>
    field
      ? field
          .replace("/", ".")
          .split(".")
          .reduce((val, prop) => (val ? val[prop] : undefined), state)
      : def,
  lastStateField: field =>
    field.indexOf("/") !== -1 ? field.replace("/", ".").split(".").pop() : field,
  // getStateValue: (field, state, def) => field ? field.split('.').reduce((val, prop) => prop.split('/').length === 2 ? val[prop[0]][prop[1]] : val[prop], state) : def,
  // getStateValue: (field, state, def) => {
  //   if (!field) {
  //     return def
  //   }
  //   return field.split('.').reduce((val, prop) => prop.split('/').length === 2 ? val[prop[0]][prop[1]] : val[prop], state) : def,
  fromKeyValueToObject: (key, value) => {
    const o = {};
    o[key] = value;

    return o;
  },
  isEmptyObject: obj => Object.keys(obj).length === 0 && obj.constructor === Object,
  // // /////
  getLocale: () => getLocale(),
  dateToIsoString: date => dateToIsoString(date),
  setSetting: (clave, valor) => setSetting(clave, valor),
  getSetting: clave => getSetting(clave),
  appDispatch: props => getSetting("appDispatch")?.(props),
  setPageTitle: title => (document.title = title),
  ahoraEnHorasMinSeg() {
    return new Date().toLocaleTimeString("en-GB"); // → "03:00:00" El inglés británico usa formato de 24 horas sin AM/PM
  },
  mesYAnyoANombre(mes, anyo) {
    // mes numero 2 dígitos, año numero 4 dígitos
    const fecha = new Date(`2019/${mes}/01`);
    const currentLocale = getLocale();

    return `${this.camelId(
      fecha.toLocaleString(/* 'default' */ currentLocale, { month: "long" }),
    )} ${anyo}`; // → default traduce el nombre de mes al idioma del navegador
  },
  // Función que convierte los minutos que le pasamos en horas y minutos ej: 200 => '03:20'
  minutosToHorasMins(mins) {
    let horas = Math.floor(mins / 60);
    let minutos = Math.round((mins / 60 - horas) * 60);
    horas = horas < 10 ? `0${horas}` : horas;
    minutos = minutos < 10 ? `0${minutos}` : minutos;

    return `${horas}:${minutos}`;
  },
  // Función que convierte las horas que le pasamos en horas y minutos ej: 1.5 => '01:30'
  horasToHorasMins(horas) {
    const hours = Math.floor(horas);
    const minutos = Math.round((horas - hours) * 60) + hours * 60;

    return this.minutosToHorasMins(minutos);
  },
  // Función que convierte un string time a minutos ej: '01:00:00' => 60
  horasMinsAMinutos(horasMinsString) {
    let minutos = horasMinsString.split(":");
    minutos = parseInt(+minutos[0] * 60 + +minutos[1]);

    return minutos;
  },
  // Función que convierte los segundos que le pasamos en horas y minutos segundos ej: 120 => '00:02:00'
  segundosToHorasMinsSegs(segs) {
    let horas = Math.floor(segs / 3600);
    let minutos = Math.floor((segs / 60) % 60);
    let segundos = segs % 60;
    horas = horas < 10 ? `0${horas}` : horas;
    minutos = minutos < 10 ? `0${minutos}` : minutos;
    segundos = segundos < 10 ? `0${segundos}` : segundos;

    return `${horas}:${minutos}:${segundos}`;
  },
  // Función que convierte los segundos que le pasamos en horas y minutos ej: 120 => '00:02'
  segundosToHorasMins(segs) {
    let horas = Math.floor(segs / 3600);
    let minutos = Math.floor((segs / 60) % 60);
    horas = horas < 10 ? `0${horas}` : horas;
    minutos = minutos < 10 ? `0${minutos}` : minutos;

    return `${horas}:${minutos}`;
  },
  // Función que convierte en porcentaje un dividendo y divisor
  formateoPorcentaje(dividendo, divisor) {
    let porcentajeFormateado = 0;
    if (divisor !== 0) {
      porcentajeFormateado = dividendo / divisor;
    }
    // porcentajeFormateado = porcentajeFormateado.toFixed(2).toString().replace('.', ',') + '%'
    const currentLocale = getLocale() === "es-ES" ? "de-DE" : getLocale();
    const nFormat = new Intl.NumberFormat(currentLocale, {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    porcentajeFormateado = nFormat.format(porcentajeFormateado);

    return porcentajeFormateado;
  },
  // Función que convierte un string time a minutos ej: '01:00:00' => 3600
  horasMinsSegsASegundos(horasMinsSegsString) {
    let segundos = horasMinsSegsString.split(":");
    segundos = parseInt(+segundos[0] * 3600 + +segundos[1] * 60 + +segundos[2]);

    return segundos;
  },
  getFormatWordsDate() {
    const formatWords = getLocale() === "en-US" ? "MM/dd/yyyy" : "dd/MM/yyyy";

    return formatWords;
  },
  getZonaHoraria: () => getZonaHoraria(),
  getLocaleDateFNS() {
    if (!getSetting("objetoLocale")) {
      setSetting("objetoLocale", locales[getLocale().substr(0, 2)] || locales.enGB);
    }

    return getSetting("objetoLocale");
  },
  getUniqueOptions: options => {
    if (options.length === 0) {
      return [];
    }
    const optionsNoRepetidos = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i] && !optionsNoRepetidos.find(op => op.key === options[i].key)) {
        optionsNoRepetidos.push(options[i]);
      }
    }

    return optionsNoRepetidos;
  },
  setGlobalSetting: (clave, valor) => setGlobalSetting(clave, valor),
  getGlobalSetting: clave => getGlobalSetting(clave),

  getLastFilter: filterName => {
    const filterNameU = `${filterName}-${getGlobalSetting("user_data")?.user?.user ?? "default"}`;
    let filter = getSetting(filterNameU);
    if (!filter) {
      filter = getGlobalSetting(filterNameU);
    }

    return filter;
  },
  setLastFilter: (filterName, filter) => {
    const filterNameU = `${filterName}-${getGlobalSetting("user_data")?.user?.user ?? "default"}`;
    setSetting(filterNameU, filter);
    setGlobalSetting(filterNameU, filter);
  },
  setMediaWidth: w => {
    mediaWidth = w;
  },
  getMediaWidth: () => mediaWidth,
  setEnvironment: env => (environment = env),
  getEnvironment: () => environment,
  buildAddress: (address, inline) => {
    if (address === null || address === undefined) {
      return "";
    }
    const dirLinea1 = `${address.dirTipoVia ?? ""} ${address.direccion ?? ""} ${
      address.dirNum ?? ""
    }`.trim();
    const dirLinea2 = `${address.codPostal ? `C.P. ${address.codPostal}` : ""} ${
      address.ciudad ?? ""
    } ${address.provincia ?? ""}`.trim();

    if (inline) {
      return `${dirLinea1}, ${dirLinea2}`;
    }

    return [dirLinea1, dirLinea2];
  },
  intervalos,
  dynamicIntervals,
  intervalosSelect: Object.entries(intervalos).map(([key, value]) => ({
    key,
    value: value?.nombre,
    desde: value?.desde,
    hasta: value?.hasta,
  })),
  intervalosAOpciones: lista =>
    lista.map(i => {
      const interval = Array.isArray(i) ? dynamicIntervals[i[0]](i[1]) : intervalos[i];

      return {
        key: Array.isArray(i) ? `${i[0]}-${i[1]}` : i,
        value: interval.nombre,
        desde: interval.desde,
        hasta: interval.hasta,
      };
    }),
  publishEvent: (event, publishFunction) => {
    if (!event.serial) {
      return;
    }
    if (publishFunction) {
      publishFunction(event);
    } else if (event.onSuccess) {
      event.onSuccess();
    }
  },
};

const locale = funciones.getLocaleDateFNS();
export default funciones;
