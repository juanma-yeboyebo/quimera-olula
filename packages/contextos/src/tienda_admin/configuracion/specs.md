# Administración de la tienda — configuración

Pantalla reservada para más adelante: datos del website, umbral de envío gratis, aviso superior y límites del menú (hoy en `FactoryTiendaOnline`).

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/tienda_admin/website/<id>` | datos del website, con `tpv_punto_venta_id`, `tpv_agente_id` y `usuario_notificaciones_id` |
| PATCH | `/tienda_admin/website/<id>` | body `{tpv_punto_venta_id, tpv_agente_id, usuario_notificaciones_id}` → `{}` |

<!-- [tienda_admin-configuracion-01] [x] -->
La ruta `/tienda_admin/configuracion` carga el website activo (selector de website de `tienda_admin`) con `GET /tienda_admin/website/<id>` y lo vuelve a cargar al cambiar de website. Muestra:
- «Datos de la tienda»: código y nombre, solo lectura.
- «Ventas en tienda (TPV)»: punto de venta (`PuntoVentaTpv`) y agente (`AgenteTpv`) con los que se crean las ventas de TPV de la tienda online.
- «Notificaciones»: usuario (`Usuario` de `comun/componentes`) que recibe los avisos de la tienda.
- «Envío gratis», «Aviso superior» y «Menú», como hasta ahora: deshabilitadas y con «Disponible próximamente».

<!-- [tienda_admin-configuracion-02] [x] -->
«Guardar» está deshabilitado hasta que se cambia algún campo, y envía los tres campos con `PATCH /tienda_admin/website/<id>`. Cada selector se puede vaciar, y entonces se envía null. Al guardar se recarga el website; si el servidor responde error, se muestra en el diálogo de errores y los campos se quedan como estaban.
