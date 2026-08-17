import {
  Bell,
  Menu,
  Moon,
  Search,
  Sun,
} from "lucide-react";

import {
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
  } = useAuth();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    mobileSearchOpen,
    setMobileSearchOpen,
  ] = useState(false);


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
  // PROFILE
  // ==========================================

  const handleProfile =
    () => {
      navigate(
        "/space"
      );
    };


  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  const handleNotifications =
    () => {
      navigate(
        "/notifications"
      );
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

            {/* LOGO */}

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


            {/* BRAND NAME */}

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

            {/* NOTIFICATIONS */}

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


            {/* PROFILE */}

            <button
              type="button"
              onClick={
                handleProfile
              }
              className="
                ml-1
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
              aria-label="Open profile"
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

            </button>


            {/* MOBILE MENU */}

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