import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import TrackingPage from "./pages/TrackingPage";
import MyOrdersPage from "./pages/MyOrdersPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/registro",
    Component: RegisterPage,
  },
  {
    path: "/chat/:restaurantId",
    Component: ChatPage,
  },
  {
    path: "/seguimiento/:orderId",
    Component: TrackingPage,
  },
  {
    path: "/mis-pedidos",
    Component: MyOrdersPage,
  },
]);
