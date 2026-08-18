import {
  Bookmark,
  Compass,
  Gavel,
  Home,
  UserRound,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";


function AppNavigation() {
  const {
    user,
  } = useAuth();


  const navigationItems = [
    {
      to: "/",
      label: "Home",
      icon: Home,
      end: true,
    },

    {
      to: "/discover",
      label: "Discover",
      icon: Compass,
    },

    {
      to: "/court",
      label: "Court",
      icon: Gavel,
    },

    {
      to: "/saved",
      label: "Saved",
      icon: Bookmark,
    },

    {
      to: "/profile",
      label: "My space",
      icon: UserRound,
    },
  ];


  return (
    <>
      {/* ======================================
          DESKTOP SIDEBAR
      ====================================== */}

      <nav
        className="
          hidden
          lg:flex
          lg:flex-col
        "
      >

        {/* ====================================
            USER CARD
        ==================================== */}

        {user && (
          <div
            className="
              mb-4
              rounded-[20px]
              border
              border-[#e5dfe7]
              bg-white
              p-3

              dark:border-[#352e3a]
              dark:bg-[#1b191f]
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              {/* AVATAR */}

              <div
                className="
                  grid
                  h-9
                  w-9
                  shrink-0
                  place-items-center
                  rounded-full

                  bg-[#eee8ff]

                  text-[11px]
                  font-bold
                  uppercase

                  text-[#302839]
                "
              >
                {
                  user.username?.charAt(
                    0
                  ) || "U"
                }
              </div>


              {/* USERNAME */}

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

                    text-[#3f3645]

                    dark:text-[#eee7f2]
                  "
                >
                  @{user.username}
                </p>


                <p
                  className="
                    mt-0.5
                    text-[10px]

                    text-[#9b919f]

                    dark:text-[#817786]
                  "
                >
                  Your space
                </p>

              </div>

            </div>
          </div>
        )}


        {/* ====================================
            DESKTOP NAVIGATION
        ==================================== */}

        <div
          className="
            space-y-1
          "
        >

          {navigationItems.map(
            ({
              to,
              label,
              icon: Icon,
              end,
            }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({
                  isActive,
                }) => `
                  flex
                  w-full
                  items-center
                  gap-3

                  rounded-[16px]

                  px-3.5
                  py-3

                  text-sm

                  transition-colors
                  duration-150

                  ${
                    isActive
                      ? `
                        bg-[#eee8ff]
                        font-semibold
                        shadow-sm

                        text-[#302839]
                      `
                      : `
                        font-medium

                        text-[#736879]

                        hover:bg-[#f2edf4]
                        hover:text-[#352d3a]

                        dark:text-[#aaa0af]
                        dark:hover:bg-[#28222d]
                        dark:hover:text-[#eee8f2]
                      `
                  }
                `}
                style={({
                  isActive,
                }) => ({
                  color:
                    isActive
                      ? "#302839"
                      : undefined,
                })}
              >

                {({
                  isActive,
                }) => (
                  <>
                    <Icon
                      size={18}
                      strokeWidth={
                        isActive
                          ? 2.2
                          : 1.8
                      }
                      className="
                        shrink-0
                      "
                      style={{
                        color:
                          isActive
                            ? "#302839"
                            : "currentColor",
                      }}
                    />

                    <span
                      className="
                        truncate
                      "
                    >
                      {label}
                    </span>
                  </>
                )}

              </NavLink>
            )
          )}

        </div>


        {/* ====================================
            IDENTITY NOTE
        ==================================== */}

        <div
          className="
            mt-6

            rounded-[18px]

            border
            border-[#e7e0e9]

            bg-[#fbf9fc]

            px-3.5
            py-3

            dark:border-[#342e39]
            dark:bg-[#19171d]
          "
        >

          <p
            className="
              text-[10px]
              font-semibold

              text-[#74687d]

              dark:text-[#b0a4b8]
            "
          >
            Your identity stays minimal.
          </p>


          <p
            className="
              mt-1

              text-[9px]
              leading-4

              text-[#a098a4]

              dark:text-[#817786]
            "
          >
            Say what you think, not who you are.
          </p>

        </div>

      </nav>


      {/* ======================================
          MOBILE BOTTOM NAVIGATION
      ====================================== */}

      <nav
        className="
          flex
          w-full
          items-center
          justify-around

          gap-1

          lg:hidden
        "
      >

        {navigationItems.map(
          ({
            to,
            label,
            icon: Icon,
            end,
          }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({
                isActive,
              }) => `
                flex
                min-w-0
                flex-1

                flex-col
                items-center
                justify-center

                gap-1

                rounded-[15px]

                px-1
                py-1.5

                text-[9px]

                transition-colors
                duration-150

                ${
                  isActive
                    ? `
                      bg-[#eee8ff]
                      font-semibold
                      text-[#302839]
                    `
                    : `
                      font-semibold

                      text-[#8d8392]

                      hover:bg-[#f4eff5]
                      hover:text-[#413747]

                      dark:text-[#877c90]
                      dark:hover:bg-[#28222d]
                      dark:hover:text-white
                    `
                }
              `}
              style={({
                isActive,
              }) => ({
                color:
                  isActive
                    ? "#302839"
                    : undefined,
              })}
            >

              {({
                isActive,
              }) => (
                <>
                  <Icon
                    size={18}
                    strokeWidth={
                      isActive
                        ? 2.2
                        : 1.8
                    }
                    className="
                      shrink-0
                    "
                    style={{
                      color:
                        isActive
                          ? "#302839"
                          : "currentColor",
                    }}
                  />

                  <span
                    className="
                      truncate
                    "
                  >
                    {label ===
                    "My space"
                      ? "Me"
                      : label}
                  </span>
                </>
              )}

            </NavLink>
          )
        )}

      </nav>
    </>
  );
}


export default AppNavigation;