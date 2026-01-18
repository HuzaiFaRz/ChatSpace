import { useAuth } from "../Utilities/AuthProvider";
import { Navigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const ProtectedRoutes = ({ children }) => {
  const { loginUser, loading } = useAuth();
  return loading ? (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <CircularProgress
        size={"20rem"}
        sx={{
          color: "white",
        }}
      />
    </div>
  ) : loginUser === null ? (
    <Navigate to="/login" />
  ) : (
    children
  );
};

export default ProtectedRoutes;
