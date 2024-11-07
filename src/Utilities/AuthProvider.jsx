import { useEffect, useState, createContext, useContext } from "react";
import { auth, onAuthStateChanged } from "../Auth/firebase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [loginUser, setLoginUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        setLoginUser(user);
      } else {
        setLoginUser(null);
      }
    });
  }, []);

  return (
    <>
      <AuthContext.Provider
        value={{ loginUser, setLoginUser, loading, setLoading }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
export default AuthProvider;
