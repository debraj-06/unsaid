import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";


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


  // ==========================================
  // SEARCH
  // ==========================================

  const [
    search,
    setSearch,
  ] = useState("");


  // ==========================================
  // MOBILE SEARCH
  // ==========================================

  const [
    mobileSearchOpen,
    setMobileSearchOpen,
  ] = useState(false);


  // ==========================================
  // PROFILE MENU
  // ==========================================

  const [
    profileMenuOpen,
    setProfileMenuOpen,
  ] = useState(false);


  // ==========================================
  // LOGOUT
  // ==========================================

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);


  // ==========================================
  // PROFILE MENU REF
  // ==========================================

  const profileMenuRef =
    useRef(null);


  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch =
    (event) => {
      event.preventDefault();

      const query =
        search.trim();

      if (!query) {
        return;
      }

      navigate(
        `/search?q=${encodeURIComponent(
          query
        )}`
      );

      setMobileSearchOpen(
        false
      );
    };


  // ==========================================
  // CLOSE MENU ON OUTSIDE CLICK
  // ==========================================

  useEffect(() => {
    const handleOutsideClick =
      (event) => {
        if (
          profileMenuRef.current &&
          !profileMenuRef.current.contains(
            event.target
          )
        ) {
          setProfileMenuOpen(
            false
          );
        }
      };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);


  // ==========================================
  // CLOSE MENU WITH ESC
  // ==========================================

  useEffect(() => {
    const handleEscape =
      (event) => {
        if (
          event.key ===
          "Escape"
        ) {
          setProfileMenuOpen(
            false
          );
        }
      };


    document.addEventListener(
      "keydown",
      handleEscape
    );


    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);


  // ==========================================
  // NAVIGATE PROFILE
  // ==========================================

  const handleMySpace =
    () => {
      setProfileMenuOpen(
        false
      );

      navigate(
        "/space"
      );
    };


  // ==========================================
  // NAVIGATE NOTIFICATIONS
  // ==========================================

  const handleNotifications =
    () => {
      setProfileMenuOpen(
        false
      );

      navigate(
        "/notifications"
      );
    };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout =
    async () => {
      if (loggingOut) {
        return;
      }

      try {
        setLoggingOut(
          true
        );

        setProfileMenuOpen(
          false
        );

        await logout();

        navigate(
          "/login",
          {
            replace: true,
          }
        );
      } catch (error) {
        console.error(
          "Logout error:",
          error
        );
      } finally {
        setLoggingOut(
          false
        );
      }
    };


  // ==========================================
  // AVATAR
  // ==========================================

  const avatarLetter =
    user?.username
      ?.charAt(0)
      ?.toUpperCase() ||
    "U";


  return (
    <header
      className="
        sticky
        top-0
        z-50
        w-full

        border-b
        border-transparent

        bg-transparent

        backdrop-blur-[2px]

        transition-all
        duration-200
      "
    >

      {/* ======================================
          MAIN BAR
      ====================================== */}

      <div
        className="
          flex
          min-h-[82px]
          w-full
          items-center

          px-4

          sm:px-6

          lg:px-8

          xl:px-10

          2xl:px-14

          3xl:px-20
        "
      >

        <div
          className="
            flex
            w-full
            items-center
            gap-3

            sm:gap-4

            lg:gap-6
          "
        >

          {/* ==================================
              BRAND
          ================================== */}

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="
              flex
              shrink-0
              items-center
              gap-3
              text-left
            "
            aria-label="Go home"
          >

            <div
              className="
                grid
                h-10
                w-10
                shrink-0
                place-items-center
                rounded-[14px]

                bg-[#eee8ff]

                text-sm
                font-bold
                text-[#302839]

                shadow-sm

                sm:h-11
                sm:w-11
              "
            >
              U
            </div>


            <div
              className="
                hidden
                sm:block
              "
            >

              <p
                className="
                  text-sm
                  font-semibold
                  tracking-[-0.02em]

                  text-[#f4edf7]

                  drop-shadow-sm
                "
              >
                Unsaid
              </p>


              <p
                className="
                  mt-0.5
                  text-[8px]
                  font-medium
                  tracking-[0.18em]

                  text-[#817786]
                "
              >
                SAY WHAT YOU MEAN
              </p>

            </div>

          </button>


          {/* ==================================
              MOBILE SEARCH BUTTON
          ================================== */}

          <button
            type="button"
            onClick={() =>
              setMobileSearchOpen(
                (current) =>
                  !current
              )
            }
            className="
              ml-auto
              grid
              h-10
              w-10
              shrink-0
              place-items-center
              rounded-full

              text-[#afa3b5]

              transition

              hover:bg-white/5
              hover:text-white

              lg:hidden
            "
            aria-label="Search"
          >

            <Search
              size={19}
              strokeWidth={1.8}
            />

          </button>


          {/* ==================================
              DESKTOP SEARCH
          ================================== */}

          <div
            className="
              hidden
              min-w-0
              flex-1
              justify-center

              lg:flex
            "
          >

            <form
              onSubmit={
                handleSearch
              }
              className="
                w-full

                max-w-[620px]

                xl:max-w-[700px]

                2xl:max-w-[760px]

                3xl:max-w-[820px]
              "
            >

              <div
                className="
                  relative
                  w-full
                "
              >

                <Search
                  size={18}
                  strokeWidth={1.8}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2

                    text-[#84788d]
                  "
                />


                <input
                  type="text"
                  value={
                    search
                  }
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search Unsaid..."
                  autoComplete="off"
                  spellCheck={false}
                  className="
                    h-11
                    w-full
                    rounded-full

                    border
                    border-white/5

                    bg-transparent

                    pl-11
                    pr-5

                    text-sm
                    text-[#eee8f1]

                    outline-none

                    transition

                    placeholder:text-[#817786]

                    hover:border-white/10

                    focus:border-white/15

                    focus:ring-4
                    focus:ring-white/5
                  "
                />

              </div>

            </form>

          </div>


          {/* ==================================
              RIGHT ACTIONS
          ================================== */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-1

              sm:gap-2
            "
          >

            {/* ==================================
                NOTIFICATION ICON
            ================================== */}

            <button
              type="button"
              onClick={
                handleNotifications
              }
              className="
                relative
                grid
                h-10
                w-10
                shrink-0
                place-items-center
                rounded-full

                text-[#afa3b5]

                transition

                hover:bg-white/5
                hover:text-white
              "
              aria-label="Notifications"
              title="Notifications"
            >

              <Bell
                size={19}
                strokeWidth={1.8}
              />

            </button>


            {/* ==================================
                THEME
            ================================== */}

            <button
              type="button"
              onClick={() =>
                setDarkMode(
                  (current) =>
                    !current
                )
              }
              className="
                hidden
                h-10
                w-10
                shrink-0
                place-items-center
                rounded-full

                text-[#afa3b5]

                transition

                hover:bg-white/5
                hover:text-white

                sm:grid
              "
              aria-label={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >

              {darkMode ? (
                <Sun
                  size={19}
                  strokeWidth={1.8}
                />
              ) : (
                <Moon
                  size={19}
                  strokeWidth={1.8}
                />
              )}

            </button>


            {/* ==================================
                PROFILE + DROPDOWN
            ================================== */}

            <div
              ref={
                profileMenuRef
              }
              className="
                relative
                ml-1
              "
            >

              <button
                type="button"
                onClick={() =>
                  setProfileMenuOpen(
                    (current) =>
                      !current
                  )
                }
                className="
                  flex
                  shrink-0
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-white/5

                  bg-transparent

                  p-1.5
                  pr-2.5

                  transition

                  hover:border-white/10
                  hover:bg-white/5

                  sm:pr-3
                "
                aria-expanded={
                  profileMenuOpen
                }
                aria-haspopup="menu"
                aria-label="Open account menu"
              >

                {/* AVATAR */}

                <div
                  className="
                    grid
                    h-8
                    w-8
                    shrink-0
                    place-items-center
                    rounded-full

                    bg-[#eee8ff]

                    text-xs
                    font-semibold
                    text-[#302839]
                  "
                >
                  {avatarLetter}
                </div>


                {/* USERNAME */}

                <span
                  className="
                    hidden
                    max-w-[110px]
                    truncate

                    text-xs
                    font-semibold

                    text-[#eee8f1]

                    drop-shadow-sm

                    md:block

                    lg:max-w-[130px]
                  "
                >
                  @{user?.username ||
                    "user"}
                </span>


                <ChevronDown
                  size={14}
                  strokeWidth={2}
                  className={`
                    hidden
                    text-[#8f8497]

                    transition-transform
                    duration-200

                    md:block

                    ${
                      profileMenuOpen
                        ? "rotate-180"
                        : "rotate-0"
                    }
                  `}
                />

              </button>


              {/* ==================================
                  DROPDOWN
              ================================== */}

              {profileMenuOpen && (
                <div
                  role="menu"
                  className="
                    absolute
                    right-0
                    top-[calc(100%+10px)]
                    z-[100]

                    w-[220px]

                    overflow-hidden

                    rounded-[20px]

                    border
                    border-[#3a3340]

                    bg-[#1b1820]

                    p-1.5

                    shadow-[0_20px_50px_rgba(0,0,0,0.35)]

                    backdrop-blur-xl
                  "
                >

                  {/* USER HEADER */}

                  <div
                    className="
                      px-3
                      py-3
                    "
                  >

                    <p
                      className="
                        truncate

                        text-xs
                        font-semibold

                        text-[#f2ebf5]
                      "
                    >
                      @{user?.username ||
                        "user"}
                    </p>


                    <p
                      className="
                        mt-1

                        text-[10px]

                        text-[#817786]
                      "
                    >
                      Your Unsaid space
                    </p>

                  </div>


                  <div
                    className="
                      my-1
                      border-t
                      border-[#302934]
                    "
                  />


                  {/* MY SPACE */}

                  <button
                    type="button"
                    role="menuitem"
                    onClick={
                      handleMySpace
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-3

                      rounded-[14px]

                      px-3
                      py-2.5

                      text-left

                      text-xs
                      font-medium

                      text-[#d8cedc]

                      transition

                      hover:bg-white/5
                      hover:text-white
                    "
                  >

                    <UserRound
                      size={16}
                      strokeWidth={1.8}
                    />

                    <span>
                      My space
                    </span>

                  </button>


                  {/* NOTIFICATIONS */}

                  <button
                    type="button"
                    role="menuitem"
                    onClick={
                      handleNotifications
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-3

                      rounded-[14px]

                      px-3
                      py-2.5

                      text-left

                      text-xs
                      font-medium

                      text-[#d8cedc]

                      transition

                      hover:bg-white/5
                      hover:text-white
                    "
                  >

                    <Bell
                      size={16}
                      strokeWidth={1.8}
                    />

                    <span>
                      Notifications
                    </span>

                  </button>


                  <div
                    className="
                      my-1
                      border-t
                      border-[#302934]
                    "
                  />


                  {/* LOGOUT */}

                  <button
                    type="button"
                    role="menuitem"
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
                      gap-3

                      rounded-[14px]

                      px-3
                      py-2.5

                      text-left

                      text-xs
                      font-medium

                      text-red-400

                      transition

                      hover:bg-red-500/10
                      hover:text-red-300

                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    {loggingOut ? (
                      <span
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-red-400/30
                          border-t-red-400
                        "
                      />
                    ) : (
                      <LogOut
                        size={16}
                        strokeWidth={1.8}
                      />
                    )}

                    <span>
                      {loggingOut
                        ? "Logging out..."
                        : "Log out"}
                    </span>

                  </button>

                </div>
              )}

            </div>


            {/* ==================================
                MOBILE MENU
            ================================== */}

            <button
              type="button"
              className="
                grid
                h-10
                w-10
                shrink-0
                place-items-center
                rounded-full

                text-[#afa3b5]

                transition

                hover:bg-white/5
                hover:text-white

                lg:hidden
              "
              aria-label="Open menu"
            >

              <Menu
                size={20}
                strokeWidth={1.8}
              />

            </button>

          </div>

        </div>

      </div>


      {/* ======================================
          MOBILE SEARCH
      ====================================== */}

      {mobileSearchOpen && (
        <div
          className="
            border-t
            border-transparent

            bg-transparent

            px-4
            pb-4
            pt-3

            backdrop-blur-[2px]

            sm:px-6

            lg:hidden
          "
        >

          <form
            onSubmit={
              handleSearch
            }
          >

            <div
              className="
                relative
              "
            >

              <Search
                size={18}
                strokeWidth={1.8}
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2

                  text-[#84788d]
                "
              />


              <input
                autoFocus
                type="text"
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search Unsaid..."
                autoComplete="off"
                spellCheck={false}
                className="
                  h-11
                  w-full
                  rounded-full

                  border
                  border-white/5

                  bg-transparent

                  pl-11
                  pr-5

                  text-sm
                  text-[#eee8f1]

                  outline-none

                  placeholder:text-[#817786]

                  focus:border-white/15

                  focus:ring-4
                  focus:ring-white/5
                "
              />

            </div>

          </form>

        </div>
      )}

    </header>
  );
}


export default Topbar;