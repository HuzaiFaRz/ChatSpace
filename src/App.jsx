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
import Error from "./ErrorComponent/Error";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <React.Fragment>
        <Route
          path="/chatspaceapp"
          element={
            <ProtectedRoutes>
              <ChatSpaceApp />
            </ProtectedRoutes>
          }
        />
        <Route element={<Login />} path={"/login"} />
        <Route element={<SignUp />} path={"/signup"} />
        <Route path="*" element={<Error />} />
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
