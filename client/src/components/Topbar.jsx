import {
  LogOut,
  Moon,
  Search,
  Sun,
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import NotificationBell from "./NotificationBell";
import SearchBox from "./SearchBox";

function Topbar({
  darkMode,
  setDarkMode,
}) {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);


  // ==========================================
  // THEME
  // ==========================================

  const handleThemeToggle = () => {
    setDarkMode(
      (current) => !current
    );
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);

      await logout();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      setLoggingOut(false);
      setMenuOpen(false);
    }
  };


  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-[#e8e2e9]
        bg-[#faf8fa]/95
        backdrop-blur-xl

        dark:border-[#2d2732]
        dark:bg-[#151319]/95
      "
    >
      <div
        className="
          mx-auto
          flex
          h-[64px]
          w-full
          max-w-[1280px]
          items-center
          gap-2
          px-3

          sm:h-[72px]
          sm:gap-4
          sm:px-5

          lg:px-8
        "
      >
        {/* ====================================
            BRAND
        ==================================== */}

        <Link
          to="/"
          className="
            flex
            shrink-0
            items-center
            gap-2.5

            sm:gap-3
          "
        >
          <div
            className="
              grid
              h-9
              w-9
              shrink-0
              place-items-center
              rounded-[12px]
              bg-[#302839]
              text-sm
              font-bold
              text-white

              dark:bg-[#eee8ff]
              dark:text-[#302839]
            "
          >
            U
          </div>

          <div className="hidden sm:block">
            <p
              className="
                text-[15px]
                font-semibold
                tracking-[-0.02em]
                text-[#302936]

                dark:text-[#f1ebf5]
              "
            >
              Unsaid
            </p>

            <p
              className="
                mt-0.5
                text-[9px]
                tracking-[0.12em]
                text-[#9a909f]
                uppercase

                dark:text-[#817786]
              "
            >
              say what you mean
            </p>
          </div>
        </Link>


        {/* ====================================
            DESKTOP SEARCH
        ==================================== */}

        {user && (
          <div
            className="
              hidden
              min-w-0
              flex-1
              justify-center
              px-3

              md:flex
              lg:px-6
            "
          >
            <SearchBox />
          </div>
        )}


        {/* ====================================
            RIGHT ACTIONS
        ==================================== */}

        <div
          className="
            ml-auto
            flex
            shrink-0
            items-center
            gap-0.5

            sm:gap-1
          "
        >
          {/* MOBILE SEARCH */}

          {user && (
            <button
              type="button"
              onClick={() =>
                navigate("/search")
              }
              className="
                grid
                h-10
                w-10
                place-items-center
                rounded-full
                text-[#756b7d]
                transition
                hover:bg-[#f2edf4]
                hover:text-[#332b38]

                dark:text-[#b8adbf]
                dark:hover:bg-[#28222d]
                dark:hover:text-white

                md:hidden
              "
              aria-label="Search"
            >
              <Search
                size={19}
                strokeWidth={1.8}
              />
            </button>
          )}


          {/* NOTIFICATIONS */}

          {user && (
            <NotificationBell />
          )}


          {/* THEME */}

          <button
            type="button"
            onClick={
              handleThemeToggle
            }
            className="
              grid
              h-10
              w-10
              place-items-center
              rounded-full
              text-[#756b7d]
              transition
              hover:bg-[#f2edf4]
              hover:text-[#332b38]

              dark:text-[#b8adbf]
              dark:hover:bg-[#28222d]
              dark:hover:text-white
            "
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <Sun
                size={18}
                strokeWidth={1.8}
              />
            ) : (
              <Moon
                size={18}
                strokeWidth={1.8}
              />
            )}
          </button>


          {/* USER */}

          {user && (
            <div className="relative ml-1">
              <button
                type="button"
                onClick={() =>
                  setMenuOpen(
                    (current) =>
                      !current
                  )
                }
                className="
                  flex
                  items-center
                  rounded-full
                  border
                  border-[#e0d8e3]
                  bg-white
                  p-1
                  transition
                  hover:bg-[#f8f4f9]

                  dark:border-[#39323e]
                  dark:bg-[#1d1921]
                  dark:hover:bg-[#28222d]

                  sm:pr-3
                "
                aria-label="Account menu"
                aria-expanded={menuOpen}
              >
                <div
                  className="
                    grid
                    h-8
                    w-8
                    place-items-center
                    rounded-full
                    bg-[#302839]
                    text-[11px]
                    font-bold
                    uppercase
                    text-white

                    dark:bg-[#eee8ff]
                    dark:text-[#302839]
                  "
                >
                  {user.username?.charAt(
                    0
                  ) || "U"}
                </div>

                <span
                  className="
                    hidden
                    max-w-[120px]
                    truncate
                    pl-2
                    text-xs
                    font-semibold
                    text-[#4b4252]

                    sm:block

                    dark:text-[#d8cedf]
                  "
                >
                  @{user.username}
                </span>
              </button>


              {/* DROPDOWN */}

              {menuOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[46px]
                    z-[100]
                    w-52
                    overflow-hidden
                    rounded-[18px]
                    border
                    border-[#e5dfe7]
                    bg-white
                    p-1
                    shadow-[0_18px_45px_rgba(50,38,60,0.12)]

                    dark:border-[#39313f]
                    dark:bg-[#211d25]
                    dark:shadow-[0_18px_45px_rgba(0,0,0,0.28)]
                  "
                >
                  <div
                    className="
                      border-b
                      border-[#eee8f0]
                      px-3
                      py-3

                      dark:border-[#302a35]
                    "
                  >
                    <p
                      className="
                        truncate
                        text-xs
                        font-semibold
                        text-[#3f3645]

                        dark:text-[#eee7f2]
                      "
                    >
                      @{user.username}
                    </p>

                    <p
                      className="
                        mt-1
                        text-[10px]
                        text-[#9a909f]

                        dark:text-[#817786]
                      "
                    >
                      Your Unsaid space
                    </p>
                  </div>


                  <Link
                    to="/profile"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      px-3
                      py-2.5
                      text-xs
                      font-medium
                      text-[#514856]
                      hover:bg-[#f5f1f6]

                      dark:text-[#d3cad8]
                      dark:hover:bg-[#2b2530]
                    "
                  >
                    <UserRound
                      size={14}
                    />
                    My space
                  </Link>


                  <Link
                    to="/saved"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      px-3
                      py-2.5
                      text-xs
                      font-medium
                      text-[#514856]
                      hover:bg-[#f5f1f6]

                      dark:text-[#d3cad8]
                      dark:hover:bg-[#2b2530]
                    "
                  >
                    <span>🔖</span>
                    Saved
                  </Link>


                  <Link
                    to="/notifications"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      px-3
                      py-2.5
                      text-xs
                      font-medium
                      text-[#514856]
                      hover:bg-[#f5f1f6]

                      dark:text-[#d3cad8]
                      dark:hover:bg-[#2b2530]
                    "
                  >
                    <span>🔔</span>
                    Notifications
                  </Link>


                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    disabled={
                      loggingOut
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-2
                      rounded-xl
                      px-3
                      py-2.5
                      text-left
                      text-xs
                      font-medium
                      text-red-500
                      hover:bg-red-50
                      disabled:opacity-50

                      dark:hover:bg-red-950/25
                    "
                  >
                    <LogOut
                      size={14}
                    />

                    {loggingOut
                      ? "Logging out..."
                      : "Log out"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;