import core from "@quimera-extension/core";
import login from "@quimera-extension/login";

import * as ItemCatalogo from "./comps/ItemCatalogo";
import * as ItemLineaCarritoCheckout from "./comps/ItemLineaCarritoCheckout";
import AppMenu from "./static/appmenu";
import schemas from "./static/schemas";
import { translations } from "./static/translations";
import UserMenu from "./static/usermenu";
import * as Catalogo from "./views/Catalogo";
import * as CatalogoFiltro from "./views/Catalogo/CatalogoFiltro";
import * as CatalogoMaster from "./views/Catalogo/CatalogoMaster";
import * as Categoria from "./views/Categoria";
import * as CategoriaNueva from "./views/CategoriaNueva";
import * as Categorias from "./views/Categorias";
import * as CategoriasFiltro from "./views/Categorias/CategoriasFiltro";
import * as CategoriasMaster from "./views/Categorias/CategoriasMaster";
import * as Checkout from "./views/Checkout";
import * as CheckoutConfirmacion from "./views/Checkout/Confirmacion";
import * as CheckoutDatosCliente from "./views/Checkout/DatosCliente";
import * as CheckoutDirCliente from "./views/Checkout/DirCliente";
import * as CheckoutLineas from "./views/Checkout/Lineas";
import * as Container from "./views/Container";
import * as Global from "./views/Global";
import * as Header from "./views/Header";
import * as HeaderCarrito from "./views/Header/Carrito";
import * as Home from "./views/Home";
import * as Login from "./views/Login";
import * as LoginAdmin from "./views/LoginAdmin";
import * as Producto from "./views/Producto";

export * from "./comps";

export default {
  path: "extensions/base/tienda-nativa",
  views: {
    Header,
    Home,
    Login,
    LoginAdmin,
    Categoria,
    Categorias,
    CategoriaNueva,
    Catalogo,
    Checkout,
    Container,
    Global,
    Producto,
  },
  subviews: {
    "Categorias/CategoriasMaster": CategoriasMaster,
    "Categorias/CategoriasFiltro": CategoriasFiltro,
    "Catalogo/CatalogoMaster": CatalogoMaster,
    "Catalogo/CatalogoFiltro": CatalogoFiltro,
    "Checkout/Confirmacion": CheckoutConfirmacion,
    "Checkout/DatosCliente": CheckoutDatosCliente,
    "Checkout/DirCliente": CheckoutDirCliente,
    "Checkout/Lineas": CheckoutLineas,
    "Header/Carrito": HeaderCarrito,
    ItemCatalogo,
    ItemLineaCarritoCheckout,
  },
  routes: {
    "/admin/home": { type: "view", view: "Home" },
    "/admin": { type: "view", view: "LoginAdmin" },
    "/admin/catalogo/categorias": { type: "view", view: "Categorias" },
    "/admin/catalogo/categorias/:idCategoria": { type: "view", view: "Categorias" },
    "/catalogo": { type: "view", view: "Catalogo" },
    "/catalogo/:referencia": { type: "view", view: "Catalogo" },
    "/checkout": { type: "view", view: "Checkout" },
    "/login/:loginType": { type: "view", view: "Login" },
  },
  dependencies: [core, login],
  menus: {
    app: AppMenu,
    user: UserMenu,
  },
  schemas,
  translations,
};
