import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home/Home";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/register";
import Search from "../pages/PublicPage/Search";
import DashboardLayout from "../layout/DashBoardLayout";
import PrivateRoute from "./PrivateRoute";
import DashboardHome from "../pages/Dashboard/DashBoardHome/DashboardHome";
import CreateDonationRequest from "../pages/Dashboard/CreateDonationRequest";
import MydDnationRequests from "../pages/Dashboard/MyDonationRequests";
import Funding from "../pages/Funding/Funding";
import DonorDashboardHome from "../pages/Dashboard/DashBoardHome/DonorDashboardHome";
import MyDonationRequests from "../pages/Dashboard/MyDonationRequests";
import EditDonationRequest from "../pages/Dashboard/EditDonationRequest";

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
        path: "search",
        Component: Search,
      },
      {
        path: "funding",
        element: (
          <PrivateRoute>
            <Funding></Funding>
          </PrivateRoute>
        ),
      },
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
{
  path: "dashboard",
  element: (
    <PrivateRoute>
      <DashboardLayout></DashboardLayout>
    </PrivateRoute>
  ),
  children: [
    {
      index: true,
      Component: DonorDashboardHome,
    },
    {
      path: "create-donation-request",
      Component: CreateDonationRequest,
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
    {
      path: "my-donation-requests",
      Component: MyDonationRequests,
    },
    {
      path: "edit-donation-request/:id",
      Component: EditDonationRequest,
      loader: async ({ params }) => {
        const { id } = params;

        const donation = await fetch(
          `http://localhost:3000/donation-requests/${id}`
        ).then((res) => res.json());

        const districts = await fetch("/districts.json").then((res) =>
          res.json()
        );
        const upazilas = await fetch("/upazilas.json").then((res) =>
          res.json()
        );

        return { donation, districts, upazilas };
      },
    },
  ],
}
]);
