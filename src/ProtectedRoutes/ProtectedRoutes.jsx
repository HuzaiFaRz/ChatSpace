// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthCreateContext } from "../Utilities/AuthContext";

// const ProtectedRoutes = ({ children }) => {
//   const { loginUser } = useContext(AuthCreateContext);
//   console.log(loginUser);
//   // return loginUser ? children : <Navigate to={"/login"} />;
// };

// export default ProtectedRoutes;
// ProtectedRoutes.js

import { useAuth } from "../Utilities/AuthProvider";
import { Navigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const ProtectedRoutes = ({ children }) => {
  const { loginUser, loading } = useAuth();
  return loading ? (
    <CircularProgress
      size={"20rem"}
      
      sx={{
        color: "white",
      }}
    />
  ) : loginUser === null ? (
    <Navigate to="/login" />
  ) : (
    children
  );
};

export default ProtectedRoutes;
