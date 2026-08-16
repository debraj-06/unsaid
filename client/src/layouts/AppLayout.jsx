import { Outlet } from "react-router-dom";

import Topbar from "../components/Topbar";
import AppNavigation from "../components/AppNavigation";

function AppLayout({
  darkMode,
  setDarkMode,
}) {
  return (
    <div
      className="
        h-screen
        overflow-hidden
        bg-[#faf8fa]
        text-[#302936]
        transition-colors
        duration-200

        dark:bg-[#121016]
        dark:text-[#f3edf7]
      "
    >
      {/* ======================================
          FIXED TOPBAR
      ====================================== */}

      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          h-[72px]
        "
      >
        <Topbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </header>


      {/* ======================================
          APP BODY
      ====================================== */}

      <div
        className="
          h-screen
          overflow-hidden
          pt-[72px]
        "
      >

        {/* ====================================
            DESKTOP SIDEBAR
        ==================================== */}

        <aside
          className="
            fixed
            bottom-0
            left-0
            top-[72px]
            z-40
            hidden
            w-[220px]
            border-r
            border-[#e8e2e9]
            bg-[#faf8fa]
            dark:border-[#2d2732]
            dark:bg-[#121016]
            lg:block
          "
        >
          <div
            className="
              h-full
              overflow-y-auto
              px-4
              py-6
            "
          >
            <AppNavigation />
          </div>
        </aside>


        {/* ====================================
            MAIN CONTENT AREA
        ==================================== */}

        <main
          className="
            h-full
            min-w-0
            overflow-y-auto
            overflow-x-hidden

            bg-[#faf8fa]
            text-[#302936]

            dark:bg-[#121016]
            dark:text-[#f3edf7]

            lg:ml-[220px]
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1280px]
              px-3
              pb-24
              pt-4

              sm:px-5
              sm:pt-6

              lg:px-8
              lg:pb-10
            "
          >
            <Outlet />
          </div>
        </main>

      </div>


      {/* ======================================
          MOBILE NAVIGATION
      ====================================== */}

      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          border-t
          border-[#e8e2e9]
          bg-white/95
          px-2
          py-2
          pb-[max(8px,env(safe-area-inset-bottom))]
          backdrop-blur-xl

          dark:border-[#2d2732]
          dark:bg-[#17151b]/95

          lg:hidden
        "
      >
        <AppNavigation />
      </div>
    </div>
  );
}

export default AppLayout;