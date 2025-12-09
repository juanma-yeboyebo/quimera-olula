import { InnerDB } from "quimera/lib";

const VENTA_CHARS = 12;

const ventasDb = InnerDB.table("ventas_tpv");
const catalogoDb = InnerDB.table("catalogo");
const puntoVentaDb = InnerDB.table("punto_venta");

export function getVentas() {
  return ventasDb.readAll();
}

export function createVenta(venta) {
  return ventasDb.createRecord(venta);
}

export function ventaExist(venta) {
  return !!ventasDb.readRecord(venta);
}

export function setVentasSincronizadas(filter) {
  ventasDb.updateMulti(filter, venta => ({ ...venta, sincronizada: true }));

  return ventasDb.readMulti(filter, 1000);
}

export function getVentasNoSincro(limit) {
  return ventasDb.readMulti(venta => !!venta.cerrada && !venta.sincronizada, limit);
}

export function estanVentasSincronizadas(ventas) {
  return ventasDb.readMulti(venta => ventas.includes(venta.id) && !!venta.sincronizada);
}

export function clearVentasSincronizadas() {
  return ventasDb.deleteMulti(venta => !!venta.sincronizada);
}

export function getNextCodigo() {
  const TPV_CODE = getPuntoVenta().puntoventa.codigo;
  const ULTIMO_TIQUE = getPuntoVenta().puntoventa.ultimoTique;

  const allRegs = Object.values(ventasDb.readAll());
  const integerCodes = allRegs
    .map(r => r.codigo)
    .filter(codigo => codigo !== "nueva")
    .map(codigo => parseInt(codigo.slice(TPV_CODE.length)));

  const maxCode = integerCodes.length ? Math.max(...integerCodes) : ULTIMO_TIQUE;

  return `${TPV_CODE}${(maxCode + 1).toString().padStart(VENTA_CHARS - TPV_CODE.length, "0")}`;
}

export function getCatalogo() {
  return {
    articulos: [],
    ...catalogoDb.readAll(),
  };
}

export function getPuntoVenta() {
  return puntoVentaDb.readAll();
}

export function setPuntoVenta(value) {
  return puntoVentaDb.updateRecord("puntoventa", value);
}

export function cargarCatalogo(catalogo) {
  return catalogoDb.createMulti(catalogo);
}

export function leerUltimaFechaCatalogo() {
  const fecha = catalogoDb.readRecord("fechaCarga");

  return typeof fecha === "string" ? fecha : false;
}
