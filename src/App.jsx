import LocomotiveScroll from "locomotive-scroll";
import "react-toastify/dist/ReactToastify.css";
import Home from "./MainComponents/Home";
import SignUp from "./Auth/SignUp";
import Login from "./Auth/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./Utilities/ProtectedRoutes";

const App = () => {
  new LocomotiveScroll();
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Login />} path={"/login"} />
        <Route element={<SignUp />} path={"/signup"} />
        <Route element={<ProtectedRoutes />}>
          <Route element={<Home />} path={"/"} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
