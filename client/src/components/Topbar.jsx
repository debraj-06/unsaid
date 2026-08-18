import {
  Bell,
  Bookmark,
  ChevronDown,
  Compass,
  Home,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  UserRound,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";


// ==========================================
// TOPBAR
// ==========================================

function Topbar({
  darkMode,
  setDarkMode,
}) {
  const navigate =
    useNavigate();

  const location =
    useLocation();

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
  // MOBILE DRAWER
  // ==========================================

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);


  // ==========================================
  // LOGOUT
  // ==========================================

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);


  // ==========================================
  // REFS
  // ==========================================

  const profileMenuRef =
    useRef(null);


  // ==========================================
  // AVATAR
  // ==========================================

  const avatarLetter =
    user?.username
      ?.charAt(0)
      ?.toUpperCase() ||
    "U";


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
  // CLOSE PROFILE ON OUTSIDE CLICK
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
  // ESCAPE HANDLER
  // ==========================================

  useEffect(() => {
    const handleEscape =
      (event) => {
        if (
          event.key !==
          "Escape"
        ) {
          return;
        }

        setProfileMenuOpen(
          false
        );

        setMobileMenuOpen(
          false
        );

        setMobileSearchOpen(
          false
        );
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
  // PREVENT BODY SCROLL WHEN DRAWER OPEN
  // ==========================================

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }


    const previousOverflow =
      document.body.style
        .overflow;


    document.body.style.overflow =
      "hidden";


    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    mobileMenuOpen,
  ]);


  // ==========================================
  // CLOSE DRAWER WHEN ROUTE CHANGES
  // ==========================================

  useEffect(() => {
    setMobileMenuOpen(
      false
    );

    setMobileSearchOpen(
      false
    );

    setProfileMenuOpen(
      false
    );
  }, [
    location.pathname,
    location.search,
  ]);


  // ==========================================
  // MOBILE NAV
  // ==========================================

  const mobileNavigation = [
    {
      label: "Home",
      path: "/",
      icon: Home,
    },

    {
      label: "Discover",
      path: "/discover",
      icon: Compass,
    },

    {
      label: "Saved",
      path: "/saved",
      icon: Bookmark,
    },

    {
      label: "Notifications",
      path: "/notifications",
      icon: Bell,
    },

    {
      label: "My space",
      path: "/space",
      icon: UserRound,
    },
  ];


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

        setMobileMenuOpen(
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
  // PROFILE ACTIONS
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
  // NAVIGATION ITEM
  // ==========================================

  const MobileNavItem =
    ({
      item,
    }) => {
      const Icon =
        item.icon;


      return (
        <NavLink
          to={
            item.path
          }
          end={
            item.path ===
            "/"
          }
          onClick={() =>
            setMobileMenuOpen(
              false
            )
          }
          className={({
            isActive,
          }) =>
            `
              flex
              min-h-[52px]
              items-center
              gap-3
              rounded-[16px]
              px-4
              text-sm
              font-medium
              transition

              ${
                isActive
                  ? `
                    bg-[#eee8ff]
                    text-[#302839]
                  `
                  : `
                    text-[#c3b8c8]
                    hover:bg-white/5
                    hover:text-white
                  `
              }
            `
          }
        >
          <Icon
            size={19}
            strokeWidth={1.8}
          />

          <span>
            {item.label}
          </span>
        </NavLink>
      );
    };


  return (
    <>
      {/* ======================================
          TOPBAR
      ====================================== */}

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

        <div
          className="
            flex
            min-h-[74px]
            w-full
            items-center

            px-4

            sm:min-h-[78px]
            sm:px-6

            lg:min-h-[82px]
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
              gap-2

              sm:gap-3

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
                ml-auto
                flex
                shrink-0
                items-center
                gap-1

                sm:gap-2
              "
            >

              {/* MOBILE SEARCH */}

              <button
                type="button"
                onClick={() =>
                  setMobileSearchOpen(
                    (current) =>
                      !current
                  )
                }
                className="
                  grid
                  h-10
                  w-10
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


              {/* DESKTOP NOTIFICATION */}

              <button
                type="button"
                onClick={
                  handleNotifications
                }
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
                "
                aria-label="Notifications"
              >
                <Bell
                  size={19}
                  strokeWidth={1.8}
                />
              </button>


              {/* THEME */}

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


              {/* PROFILE DESKTOP */}

              <div
                ref={
                  profileMenuRef
                }
                className="
                  relative
                  hidden

                  lg:block
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
                    items-center
                    gap-2

                    rounded-full

                    border
                    border-white/5

                    bg-transparent

                    p-1.5
                    pr-3

                    transition

                    hover:border-white/10
                    hover:bg-white/5
                  "
                  aria-expanded={
                    profileMenuOpen
                  }
                >

                  <div
                    className="
                      grid
                      h-8
                      w-8
                      place-items-center
                      rounded-full

                      bg-[#eee8ff]

                      text-xs
                      font-semibold
                      text-[#302839]
                    "
                  >
                    {
                      avatarLetter
                    }
                  </div>


                  <span
                    className="
                      max-w-[130px]
                      truncate

                      text-xs
                      font-semibold

                      text-[#eee8f1]
                    "
                  >
                    @
                    {
                      user?.username ||
                      "user"
                    }
                  </span>


                  <ChevronDown
                    size={14}
                    className={
                      profileMenuOpen
                        ? "rotate-180 transition-transform"
                        : "transition-transform"
                    }
                  />

                </button>


                {/* PROFILE MENU */}

                {profileMenuOpen && (
                  <div
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
                        @
                        {
                          user?.username ||
                          "user"
                        }
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
                        border-t
                        border-[#302934]
                      "
                    />


                    <button
                      type="button"
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

                        hover:bg-white/5
                      "
                    >
                      <UserRound
                        size={16}
                      />

                      My space
                    </button>


                    <button
                      type="button"
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

                        hover:bg-white/5
                      "
                    >
                      <Bell
                        size={16}
                      />

                      Notifications
                    </button>


                    <div
                      className="
                        my-1
                        border-t
                        border-[#302934]
                      "
                    />


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
                        gap-3

                        rounded-[14px]

                        px-3
                        py-2.5

                        text-left
                        text-xs
                        font-medium

                        text-red-400

                        hover:bg-red-500/10

                        disabled:opacity-50
                      "
                    >

                      <LogOut
                        size={16}
                      />

                      {
                        loggingOut
                          ? "Logging out..."
                          : "Log out"
                      }

                    </button>

                  </div>
                )}

              </div>


              {/* MOBILE MENU BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(
                    (current) =>
                      !current
                  )
                }
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
                aria-label={
                  mobileMenuOpen
                    ? "Close menu"
                    : "Open menu"
                }
                aria-expanded={
                  mobileMenuOpen
                }
              >

                {mobileMenuOpen ? (
                  <X
                    size={21}
                    strokeWidth={1.8}
                  />
                ) : (
                  <Menu
                    size={21}
                    strokeWidth={1.8}
                  />
                )}

              </button>

            </div>

          </div>

        </div>


        {/* ======================================
            MOBILE SEARCH PANEL
        ====================================== */}

        {mobileSearchOpen && (
          <div
            className="
              border-t
              border-transparent

              bg-transparent

              px-4
              pb-4
              pt-2

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


      {/* ======================================
          MOBILE BACKDROP
      ====================================== */}

      <div
        className={`
          fixed
          inset-0
          z-[80]

          bg-black/50

          transition-opacity
          duration-300

          lg:hidden

          ${
            mobileMenuOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
        onClick={() =>
          setMobileMenuOpen(
            false
          )
        }
        aria-hidden="true"
      />


      {/* ======================================
          MOBILE DRAWER
      ====================================== */}

      <aside
        className={`
          fixed
          bottom-0
          left-0
          top-0

          z-[90]

          flex
          w-[min(86vw,340px)]
          flex-col

          border-r
          border-[#302934]

          bg-[#121016]

          shadow-[20px_0_60px_rgba(0,0,0,0.35)]

          transition-transform
          duration-300
          ease-out

          lg:hidden

          ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
        aria-hidden={
          !mobileMenuOpen
        }
      >

        {/* ==================================
            DRAWER HEADER
        ================================== */}

        <div
          className="
            flex
            min-h-[78px]
            items-center
            justify-between

            border-b
            border-[#29242d]

            px-5
          "
        >

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(
                false
              );

              navigate("/");
            }}
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                grid
                h-10
                w-10
                place-items-center
                rounded-[13px]

                bg-[#eee8ff]

                text-sm
                font-bold
                text-[#302839]
              "
            >
              U
            </div>


            <div
              className="
                text-left
              "
            >

              <p
                className="
                  text-sm
                  font-semibold
                  text-[#f4edf7]
                "
              >
                Unsaid
              </p>

              <p
                className="
                  mt-0.5
                  text-[8px]
                  tracking-[0.16em]
                  text-[#817786]
                "
              >
                SAY WHAT YOU MEAN
              </p>

            </div>

          </button>


          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                false
              )
            }
            className="
              grid
              h-9
              w-9
              place-items-center
              rounded-full

              text-[#93889b]

              hover:bg-white/5
              hover:text-white
            "
            aria-label="Close menu"
          >
            <X size={19} />
          </button>

        </div>


        {/* ==================================
            USER CARD
        ================================== */}

        <div
          className="
            mx-4
            mt-5

            rounded-[20px]

            border
            border-[#302a35]

            bg-[#1a171e]

            p-4
          "
        >

          <button
            type="button"
            onClick={
              handleMySpace
            }
            className="
              flex
              w-full
              items-center
              gap-3
              text-left
            "
          >

            <div
              className="
                grid
                h-10
                w-10
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


            <div
              className="
                min-w-0
              "
            >

              <p
                className="
                  truncate
                  text-xs
                  font-semibold
                  text-[#eee8f1]
                "
              >
                @
                {
                  user?.username ||
                  "user"
                }
              </p>


              <p
                className="
                  mt-1
                  text-[10px]
                  text-[#817786]
                "
              >
                Your space
              </p>

            </div>

          </button>

        </div>


        {/* ==================================
            NAVIGATION
        ================================== */}

        <nav
          className="
            mt-5
            flex-1

            overflow-y-auto

            px-4
          "
        >

          <p
            className="
              px-3
              pb-2

              text-[9px]
              font-semibold
              uppercase
              tracking-[0.16em]

              text-[#6f6576]
            "
          >
            Navigation
          </p>


          <div
            className="
              space-y-1
            "
          >

            {mobileNavigation.map(
              (item) => (
                <MobileNavItem
                  key={
                    item.path
                  }
                  item={
                    item
                  }
                />
              )
            )}

          </div>


          <div
            className="
              my-5

              border-t
              border-[#29242d]
            "
          />


          {/* THEME */}

          <button
            type="button"
            onClick={() =>
              setDarkMode(
                (current) =>
                  !current
              )
            }
            className="
              flex
              min-h-[52px]
              w-full
              items-center
              gap-3
              rounded-[16px]
              px-4

              text-sm
              font-medium

              text-[#c3b8c8]

              transition

              hover:bg-white/5
              hover:text-white
            "
          >

            {darkMode ? (
              <Sun
                size={19}
              />
            ) : (
              <Moon
                size={19}
              />
            )}

            <span>
              {darkMode
                ? "Light mode"
                : "Dark mode"}
            </span>

          </button>

        </nav>


        {/* ==================================
            DRAWER FOOTER
        ================================== */}

        <div
          className="
            border-t
            border-[#29242d]

            p-4
          "
        >

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
              min-h-[50px]
              w-full
              items-center
              gap-3

              rounded-[16px]

              px-4

              text-sm
              font-medium

              text-red-400

              transition

              hover:bg-red-500/10

              disabled:opacity-50
            "
          >

            <LogOut
              size={19}
            />

            <span>
              {
                loggingOut
                  ? "Logging out..."
                  : "Log out"
              }
            </span>

          </button>

        </div>

      </aside>
    </>
  );
}


export default Topbar;