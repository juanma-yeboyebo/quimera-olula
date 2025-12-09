import core from "@quimera-extension/core";

import schemas from "./static/dynamicSchemas";
import { translations } from "./static/translations";
import UserMenu from "./static/usermenu";
import * as ForgotPassword from "./views/ForgotPassword";
import * as Global from "./views/Global";
import * as Groups from "./views/Groups";
import * as GroupsDetalle from "./views/Groups/DetalleGroups";
import * as GroupsMaster from "./views/Groups/MasterGroups";
import * as NuevoGroup from "./views/Groups/NuevoGroup";
import * as Login from "./views/Login";
import * as Logout from "./views/Logout";
import * as Signup from "./views/Signup";
import * as User from "./views/User";
import * as Users from "./views/Users";
import * as UsersDetalle from "./views/Users/DetalleUsers";
import * as UsersMaster from "./views/Users/MasterUsers";
import * as NuevoUser from "./views/Users/NuevoUser";
import * as Welcome from "./views/Welcome";

export default {
  path: "extensions/login",
  views: {
    ForgotPassword,
    Global,
    Groups,
    Login,
    Logout,
    Signup,
    User,
    Users,
    Welcome,
  },
  subviews: {
    "Users/MasterUsers": UsersMaster,
    "Users/DetalleUsers": UsersDetalle,
    "Users/NuevoUser": NuevoUser,
    "Groups/MasterGroups": GroupsMaster,
    "Groups/DetalleGroups": GroupsDetalle,
    "Groups/NuevoGroup": NuevoGroup,
  },
  routes: {
    "/forgot-password": { type: "view", view: "ForgotPassword" },
    "/forgot-password/:hash": { type: "view", view: "ForgotPassword" },
    "/signup": { type: "view", view: "Signup" },
    "/signup/:hash": { type: "view", view: "Signup" },
    "/login": { type: "view", view: "Login" },
    "/logout": { type: "view", view: "Logout" },
    "/user": { type: "view", view: "User" },
    "/users": { type: "view", view: "Users" },
    "/users/:idUser": { type: "view", view: "Users" },
    "/welcome": { type: "view", view: "Welcome" },
    "/groups": { type: "view", view: "Groups" },
    "/groups/:idGroup": { type: "view", view: "Groups" },
  },
  dependencies: [core],
  rules: {
    "Users:visit": false,
    "Groups:visit": false,
  },
  menus: {
    user: UserMenu,
  },
  schemas,
  translations,
};
