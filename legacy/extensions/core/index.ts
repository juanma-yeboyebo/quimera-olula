import AppMenu from "./static/appmenu";
import UserMenu from "./static/usermenu";
import * as Container from "./views/Container";
import * as HeaderContainer from "./views/Container/HeaderContainer";
import * as Dialog from "./views/Dialog";
import * as Footer from "./views/Footer";
import * as Forbidden from "./views/Forbidden";
import * as Global from "./views/Global";
import * as Header from "./views/Header";
import * as Landing from "./views/Landing";
import * as PageNotFound from "./views/PageNotFound";
import * as SnackBar from "./views/SnackBar";

export default {
  path: "extensions/core",
  views: {
    Container,
    Header,
    Footer,
    Global,
    PageNotFound,
    Forbidden,
    Landing,
    SnackBar,
    Dialog,
  },
  subviews: {
    HeaderContainer,
  },
  routes: {
    "/": { type: "view", view: "Landing" },
  },
  dependencies: [],
  menus: {
    app: AppMenu,
    user: UserMenu,
  },
};
