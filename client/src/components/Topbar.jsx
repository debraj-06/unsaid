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
        border-[#2d2732]
        bg-[#121016]/95
        backdrop-blur-xl

        dark:border-[#2d2732]
      "
    >

      {/* ======================================
          DESKTOP / TABLET HEADER
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

                sm:h-11
                sm:w-11
              "
            >
              U
            </div>


            {/* BRAND TEXT */}

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
                  className="
                    h-11
                    w-full
                    rounded-full
                    border
                    border-[#342d39]
                    bg-[#1a171e]
                    pl-11
                    pr-5
                    text-sm
                    text-[#eee8f1]
                    outline-none
                    transition

                    placeholder:text-[#817786]

                    hover:border-[#433a49]

                    focus:border-[#5b4d64]
                    focus:ring-4
                    focus:ring-[#30253a]
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
                border-[#38313d]
                bg-[#18151b]
                p-1.5
                pr-2.5
                transition

                hover:border-[#4a4050]
                hover:bg-[#211d24]

                sm:pr-3
              "
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
          MOBILE SEARCH PANEL
      ====================================== */}

      {mobileSearchOpen && (
        <div
          className="
            border-t
            border-[#2d2732]
            px-4
            pb-4
            pt-3

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
                className="
                  h-11
                  w-full
                  rounded-full
                  border
                  border-[#342d39]
                  bg-[#1a171e]
                  pl-11
                  pr-5
                  text-sm
                  text-[#eee8f1]
                  outline-none

                  placeholder:text-[#817786]

                  focus:border-[#5b4d64]
                  focus:ring-4
                  focus:ring-[#30253a]
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