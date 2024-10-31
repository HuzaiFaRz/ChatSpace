import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  BrowserRouter,
  Routes,
  Route,
  RouterProvider,
  createRoutesFromChildren,
} from "react-router-dom";
import SignUp from "./Auth/SignUp";
import Login from "./Auth/Login";
import ChatSpaceApp from "./ChatSpaceApp/ChatSpaceApp";
import ProtectedRoutes from "./Utilities/ProtectedRoutes";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const router = createBrowserRouter(
  createRoutesFromChildren(
    <React.Fragment>
      <Route element={<Login />} path={"/login"} />
      <Route element={<SignUp />} path={"/signup"} />
      <Route element={<ProtectedRoutes />}>
        <Route element={<ChatSpaceApp />} path={"/"} />
      </Route>
    </React.Fragment>
  )
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
