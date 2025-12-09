import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Layout } from "./pages/layout/Layout";
import { Home } from "./pages/home/Home";
import { Buttons } from "./pages/buttons/Buttons";
import { Palette } from "./pages/palette/Palette";
import { Labels } from "./pages/labels/Labels";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/buttons",
        element: <Buttons />,
      },
      {
        path: "/labels",
        element: <Labels />,
      },
      {
        path: "/palette",
        element: <Palette />,
      },
    ],
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
