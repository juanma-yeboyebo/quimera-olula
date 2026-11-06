# Memoria técnica — tienda_online / checkout

Tests en `packages/contextos/src/tienda_online/checkout/test/` (lanzar con `(cd packages/contextos && npx vitest run src/tienda_online/checkout/)`).
Trampa Vitest: `beforeEach(() => { mock.mockReset(); })` siempre con llaves.

## Ficheros a crear

- `checkout/diseño.ts`: `DireccionCheckout`, `DatosCheckout`, `ResultadoPago`.
- `checkout/dominio.ts`: `datosCheckoutIniciales(c)`, `erroresCheckout(d)`, `datosCheckoutAApi(d)`, `resultadoPago(estado)`, `clavePagoEnCurso(codigo)`.
- `checkout/infraestructura.ts`: `patchDatosCheckout(token, body)`, `postIniciarPago(token): Promise<string>`, `postCancelarPago(token)`.
- `checkout/navegacion.ts`: `redirigirA(url)` (envuelve `window.location.assign`).
- `checkout/detalle/{diseño,detalle,maquina}.ts`: `ContextoCheckout`, `guardarDatos(ctx)`, `iniciarPago(ctx)`.
- `checkout/ok/ok.ts`: `pasoConsulta(token)`, `consultarPago(token, {intervaloMs, maxMs})`, `cerrarPago(codigoStoreview)`.
- `checkout/cancelado/cancelado.ts`: `cancelarPago(codigoStoreview): Promise<boolean>`.

## Mapeo spec -> test

| Spec | Fichero |
|---|---|
| datos-01, 02, 03, maquina-01 (body), ok-02 (resultadoPago), maquina-04/ok-01 (clave) | dominio.test.ts |
| maquina-01, 04, cancelado-01 (rutas, cabecera) | infraestructura.test.ts |
| datos-03 (guardar con errores), maquina-01, 02, 04, 05, 06 | detalle.test.ts |
| ok-02, 05, 06 | ok.test.ts |
| cancelado-01, 02 | cancelado.test.ts |
| datos-04, maquina-03, 07, ok-01 (vista), ok-03, ok-04 | sin test (vista) |
