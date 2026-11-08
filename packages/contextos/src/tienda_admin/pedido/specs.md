# Administración de la tienda — pedidos

Los pedidos de la tienda son pedidos de venta del ERP (los crea `conversion_carrito` al pagarse el carrito). Pantalla reservada para más adelante: filtrará los pedidos de ventas por origen tienda.

<!-- [tienda_admin-pedido-01] [nueva] -->
La ruta `/tienda_admin/pedido` muestra el título «Pedidos de la tienda», el texto «Próximamente: los pedidos de la tienda filtrados desde Ventas → Pedidos» y un enlace a `/ventas/pedido`. No llama al servidor.
