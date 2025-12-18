import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home/Home";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Search from "../pages/PublicPage/Search";
import PrivateRoute from "./PrivateRoute";
import DashboardHome from "../pages/Dashboard/DashBoardHome/DashboardHome";
import CreateDonationRequest from "../pages/Dashboard/CreateDonationRequest";
import MyDonationRequests from "../pages/Dashboard/MyDonationRequests";
import Funding from "../pages/Funding/Funding";
import EditDonationRequest from "../pages/Dashboard/EditDonationRequest";
import AdminRoute from "./AdminRoute";
import VolunteerRoute from "./VolunteerRoute";
import AllUsers from "../pages/Dashboard/Admin/AllUsers";
import AllDonationRequests from "../pages/Dashboard/Admin/AllDonationRequests";
import DashboardLayout from "../layout/DashboardLayout";
import DonationRequests from "../pages/PublicPage/DonationRequests";
import DonationRequestDetails from "../pages/PublicPage/DonationRequestDetails";
import Profile from "../pages/Dashboard/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },

      {
        path: "donation-requests",   
        Component: DonationRequests,
      },
      {
        path: "donation-requests/:id", 
        element: (
          <PrivateRoute>
            <DonationRequestDetails />
          </PrivateRoute>
        ),
        loader: async ({ params }) => {
          const { id } = params;
          const donation = await fetch(
            `https://red-hope-server-alpha.vercel.app/donation-requests/${id}`
          ).then((res) => res.json());
          return { donation };
        },
      },

      {
        path: "search",
        Component: Search,
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
        path: "funding",
        element: (
          <PrivateRoute>
            <Funding />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
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
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, Component: DashboardHome },
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
      { path: "my-donation-requests", Component: MyDonationRequests },
      {
        path: "edit-donation-request/:id",
        Component: EditDonationRequest,
        loader: async ({ params }) => {
          const { id } = params;

          const donation = await fetch(
            `http://https://red-hope-server-alpha.vercel.app/donation-requests/${id}`
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
      {
        path: "profile",
        Component: Profile,
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
        path: "all-users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
      {
        path: "all-blood-donation-request",
        element: (
          <PrivateRoute>
            <AllDonationRequests />
          </PrivateRoute>
        ),
      },
    ],
  },
]);