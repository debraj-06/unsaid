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
        min-h-screen
        overflow-x-hidden
        bg-[#faf8fa]
        text-[#302936]
        transition-colors
        duration-200

        dark:bg-[#121016]
        dark:text-[#f3edf7]
      "
    >
      {/* ======================================
          TOPBAR
      ====================================== */}

      <Topbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />


      {/* ======================================
          MAIN APP AREA
      ====================================== */}

      <div
        className="
          min-h-[calc(100vh-72px)]
          bg-[#faf8fa]

          dark:bg-[#121016]
        "
      >
        <div
          className="
            mx-auto
            grid
            w-full
            max-w-[1280px]
            grid-cols-1
            gap-6
            px-3
            pb-24
            pt-4

            sm:px-5
            sm:pt-6

            lg:grid-cols-[200px_minmax(0,1fr)]
            lg:gap-7
            lg:px-8
            lg:pb-10
          "
        >
          {/* ==================================
              DESKTOP SIDEBAR
          ================================== */}

          <aside
            className="
              hidden
              lg:block
            "
          >
            <div
              className="
                sticky
                top-[96px]
              "
            >
              <AppNavigation />
            </div>
          </aside>


          {/* ==================================
              PAGE CONTENT
          ================================== */}

          <main
            className="
              min-w-0
              w-full
              text-[#302936]

              dark:text-[#f3edf7]
            "
          >
            <Outlet />
          </main>
        </div>
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
          z-40
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