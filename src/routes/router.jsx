import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home/Home";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/register";
import Search from "../pages/PublicPage/Search";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'search',
        Component: Search
      }
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
        loader: async () => {
          const districts = await fetch("/districts.json").then((res) =>
            res.json()
          );
          const upazilas = await fetch("/upazilas.json").then((res) =>
            res.json()
          );

          return { districts, upazilas };
        },
      },
    ],
  },
]);
