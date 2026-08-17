import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authService";


const AuthContext =
  createContext(null);


export function AuthProvider({
  children,
}) {
  const [
    user,
    setUser,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  // ==========================================
  // RESTORE SESSION
  // ==========================================

  useEffect(() => {
    const restoreSession =
      async () => {
        try {
          const data =
            await getCurrentUser();


          setUser(
            data.user
          );
        } catch (
          error
        ) {
          console.log(
            "No active session"
          );


          localStorage.removeItem(
            "unsaid_token"
          );


          setUser(null);
        } finally {
          setLoading(
            false
          );
        }
      };


    restoreSession();
  }, []);


  // ==========================================
  // AUTH EXPIRED
  // ==========================================

  useEffect(() => {
    const handleAuthExpired =
      () => {
        localStorage.removeItem(
          "unsaid_token"
        );

        setUser(null);
      };


    window.addEventListener(
      "unsaid:auth-expired",
      handleAuthExpired
    );


    return () => {
      window.removeEventListener(
        "unsaid:auth-expired",
        handleAuthExpired
      );
    };
  }, []);


  // ==========================================
  // REGISTER
  // ==========================================

  const register =
    async (
      data
    ) => {
      const response =
        await registerUser(
          data
        );


      setUser(
        response.user
      );


      return response;
    };


  // ==========================================
  // LOGIN
  // ==========================================

  const login =
    async (
      data
    ) => {
      const response =
        await loginUser(
          data
        );


      setUser(
        response.user
      );


      return response;
    };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout =
    async () => {
      try {
        await logoutUser();
      } finally {
        localStorage.removeItem(
          "unsaid_token"
        );

        setUser(null);
      }
    };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(
    AuthContext
  );
}