import { Box } from "@quimera/thirdparty";
import Quimera, { useAppValue, usePath, useRoutes, useStateValue, useWidth, util } from "quimera";
import { buildView, getRoutes } from "quimera/hooks";
import { ACL } from "quimera/lib";
import { useEffect } from "react";

let routes = null;
function hookRoutes(loading) {
  if (loading) {
    return [];
  }
  if (!routes) {
    routes = Object.entries(getRoutes()).reduce((obj, [key, value]) => {
      return {
        ...obj,
        ...{
          [key]: params =>
            ACL.can(`${value.view}:visit`)
              ? buildView(value.view, { ...params })
              : buildView("Forbidden"),
        },
      };
    }, {});
  }

  return routes;
}

const loading = false;

function Container({ useStyles }) {
  const classes = useStyles();

  const [{ vistaMovil, modalVisible, tipoMensaje }, appDispatch] = useAppValue();
  const [{ authenticated }, dispatch] = useStateValue();
  const routeResult = useRoutes(hookRoutes(loading));
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const path = usePath();
  console.log("Mi path es", path);
  useEffect(() => {
    util.setSetting("appDispatch", appDispatch);
    appDispatch({ type: "updateMenus" });
  }, [appDispatch, vistaMovil, authenticated]);

  useEffect(() => {
    dispatch({ type: "onAuthenticatedChanged" });
  }, [authenticated]);

  const excepciones = ["/login", "/forgot-password", "/signup", "/welcome"];
  const isExcepcion = excepciones.find(excepcion => path && path.startsWith(excepcion));

  return (
    <Quimera.Template id="Container">
      {authenticated ? (
        <>
          <Box padding="1em">
            {/* <Box id="HeaderContainer" height={`${headerHeight}px`}>
              <Quimera.View id="Header" />
              <Quimera.View id="Dialog" />
            </Box> */}
            <Quimera.SubView id="HeaderContainer" />
            <Box id="ViewContainer">{routeResult || <Quimera.View id="PageNotFound" />}</Box>
            <Box height="0%">
              <Quimera.View id="Footer" />
            </Box>
          </Box>

          <Quimera.Block id="containerBlock" />
        </>
      ) : isExcepcion ? (
        routeResult || <Quimera.View id="PageNotFound" />
      ) : (
        // ? (<Quimera.View
        //   id="ForgotPassword"
        // />)
        <Quimera.View
          id="Login"
          onLogin={() =>
            dispatch({
              type: "setAuthenticated",
              payload: { authenticated: true },
            })
          }
        />
      )}

      <Quimera.View id="SnackBar" />
      {modalVisible && <Quimera.View id={modalVisible} />}
    </Quimera.Template>
  );
}

Container.displayName = "Container";
export default Container;
