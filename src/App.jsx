import {
  createBrowserRouter,
  Route,
  RouterProvider,
  createRoutesFromChildren,
  Navigate,
} from "react-router-dom";
import React from "react";

import SignUp from "./Auth/SignUp";
import Login from "./Auth/Login";
import ChatSpaceApp from "./ChatSpaceApp/ChatSpaceApp";
import ProtectedRoutes from "./ProtectedRoutes/ProtectedRoutes";
import AuthProvider from "./Utilities/AuthProvider";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <React.Fragment>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <ChatSpaceApp />
            </ProtectedRoutes>
          }
        />
        <Route element={<Login />} path={"/login"} />
        <Route element={<SignUp />} path={"/signup"} />
        <Route path="*" element={<Navigate to="/login" />} />
      </React.Fragment>
    )
  );
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
