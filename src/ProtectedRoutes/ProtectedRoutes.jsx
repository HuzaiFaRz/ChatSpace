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
