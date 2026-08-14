import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "./context/AuthContext";

import AppLayout from "./layouts/AppLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Saved from "./pages/Saved";
import PublicProfile from "./pages/PublicProfile";
import Notifications from "./pages/Notifications";
import Search from "./pages/Search";
import Discover from "./pages/Discover";


// ==========================================
// PROTECTED ROUTE
// ==========================================

function ProtectedRoute({
  children,
}) {
  const {
    user,
    loading,
  } = useAuth();


  if (loading) {
    return (
      <div
        className="
          grid
          min-h-screen
          place-items-center
          bg-[#faf8fa]

          dark:bg-[#121016]
        "
      >
        <div
          className="
            h-7
            w-7
            animate-spin
            rounded-full
            border-2
            border-[#ddd4e2]
            border-t-[#806d8f]

            dark:border-[#39323e]
            dark:border-t-[#cbb6d5]
          "
        />
      </div>
    );
  }


  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  return children;
}


// ==========================================
// PUBLIC ROUTE
// ==========================================

function PublicOnlyRoute({
  children,
}) {
  const {
    user,
    loading,
  } = useAuth();


  if (loading) {
    return (
      <div
        className="
          grid
          min-h-screen
          place-items-center
          bg-[#faf8fa]

          dark:bg-[#121016]
        "
      >
        <div
          className="
            h-7
            w-7
            animate-spin
            rounded-full
            border-2
            border-[#ddd4e2]
            border-t-[#806d8f]

            dark:border-[#39323e]
            dark:border-t-[#cbb6d5]
          "
        />
      </div>
    );
  }


  if (user) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  return children;
}


// ==========================================
// APP
// ==========================================

function App() {
  const [
    darkMode,
    setDarkMode,
  ] = useState(() => {
    try {
      return (
        localStorage.getItem(
          "unsaid_theme"
        ) === "dark"
      );
    } catch {
      return false;
    }
  });


  // ==========================================
  // APPLY THEME
  // ==========================================

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    try {
      localStorage.setItem(
        "unsaid_theme",
        darkMode
          ? "dark"
          : "light"
      );
    } catch {
      // Ignore localStorage errors.
    }
  }, [
    darkMode,
  ]);


  return (
    <Routes>

      {/* ======================================
          AUTH
      ====================================== */}

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />


      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />


      {/* ======================================
          APP
      ====================================== */}

      <Route
        element={
          <ProtectedRoute>
            <AppLayout
              darkMode={
                darkMode
              }
              setDarkMode={
                setDarkMode
              }
            />
          </ProtectedRoute>
        }
      >

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/discover"
          element={
            <Discover />
          }
        />

        <Route
          path="/search"
          element={
            <Search />
          }
        />

        <Route
          path="/saved"
          element={
            <Saved />
          }
        />

        <Route
          path="/notifications"
          element={
            <Notifications />
          }
        />

        <Route
          path="/profile"
          element={
            <Profile />
          }
        />

        <Route
          path="/user/:username"
          element={
            <PublicProfile />
          }
        />

      </Route>


      {/* ======================================
          FALLBACK
      ====================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;