import {
  Bookmark,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import ThoughtCard from "../components/ThoughtCard";

import {
  getMyBookmarks,
} from "../services/userService";


function Saved() {
  const [
    thoughts,
    setThoughts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  // ==========================================
  // LOAD SAVED THOUGHTS
  // ==========================================

  const loadSavedThoughts =
    async (
      showRefresh = false
    ) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const data =
          await getMyBookmarks();

        setThoughts(
          Array.isArray(
            data.thoughts
          )
            ? data.thoughts
            : []
        );
      } catch (error) {
        console.error(
          "Load saved thoughts error:",
          error
        );

        setError(
          error.message ||
            "Unable to load saved thoughts"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadSavedThoughts();
  }, []);


  // ==========================================
  // REMOVE FROM SAVED
  // ==========================================

  const handleUpdated =
    (updatedThought) => {
      setThoughts(
        (current) =>
          current.map(
            (thought) =>
              thought.id ===
              updatedThought.id
                ? updatedThought
                : thought
          )
      );
    };


  const handleDeleted =
    (id) => {
      setThoughts(
        (current) =>
          current.filter(
            (thought) =>
              thought.id !== id
          )
      );
    };


  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[900px]
        space-y-6
      "
    >

      {/* ======================================
          HEADER
      ====================================== */}

      <section
        className="
          overflow-hidden
          rounded-[26px]
          border
          border-[#e4dce8]
          bg-white
          shadow-[0_8px_28px_rgba(55,42,67,0.04)]

          dark:border-[#352f3b]
          dark:bg-[#1b191f]
          dark:shadow-none
        "
      >

        <div
          className="
            px-4
            py-5

            sm:px-6
            sm:py-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-4

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            {/* TITLE */}

            <div
              className="
                flex
                min-w-0
                items-center
                gap-3
              "
            >

              <div
                className="
                  grid
                  h-11
                  w-11
                  shrink-0
                  place-items-center
                  rounded-[15px]
                  bg-[#eee8ff]
                  text-[#5c4b68]

                  dark:bg-[#2e2636]
                  dark:text-[#d1bfdd]
                "
              >
                <Bookmark
                  size={20}
                  fill="currentColor"
                />
              </div>


              <div className="min-w-0">

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <Sparkles
                    size={12}
                    className="
                      shrink-0
                      text-[#927da0]

                      dark:text-[#b8a2c2]
                    "
                  />

                  <p
                    className="
                      text-[10px]
                      font-bold
                      tracking-[0.16em]
                      text-[#948899]
                      uppercase

                      dark:text-[#8f8395]
                    "
                  >
                    saved for later
                  </p>

                </div>


                <h1
                  className="
                    mt-1
                    truncate
                    text-2xl
                    font-semibold
                    tracking-[-0.03em]
                    text-[#302936]

                    dark:text-[#f2ebf5]

                    sm:text-3xl
                  "
                >
                  Saved thoughts
                </h1>


                <p
                  className="
                    mt-1.5
                    text-xs
                    leading-5
                    text-[#958b99]

                    dark:text-[#8b8191]
                  "
                >
                  Thoughts you want to
                  come back to.
                </p>

              </div>

            </div>


            {/* REFRESH */}

            <button
              type="button"
              onClick={() =>
                loadSavedThoughts(
                  true
                )
              }
              disabled={refreshing}
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-[#ddd5e2]
                bg-white
                px-3.5
                py-2
                text-[11px]
                font-semibold
                text-[#6f6279]
                transition
                hover:bg-[#f7f3f8]
                disabled:cursor-not-allowed
                disabled:opacity-50

                dark:border-[#3b3442]
                dark:bg-[#211d25]
                dark:text-[#bcb0c5]
                dark:hover:bg-[#2b2530]
              "
            >

              <RefreshCw
                size={13}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing"
                : "Refresh"}

            </button>

          </div>

        </div>


        {/* TOP COUNT STRIP */}

        {!loading &&
          !error && (
            <div
              className="
                border-t
                border-[#eee8f0]
                bg-[#fbf9fc]
                px-4
                py-3

                dark:border-[#2c2731]
                dark:bg-[#19171d]

                sm:px-6
              "
            >

              <p
                className="
                  text-[11px]
                  text-[#938999]

                  dark:text-[#847989]
                "
              >
                {thoughts.length}{" "}
                {thoughts.length === 1
                  ? "saved thought"
                  : "saved thoughts"}
              </p>

            </div>
          )}

      </section>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <section
          className="
            rounded-[24px]
            border
            border-red-200
            bg-red-50
            p-5

            dark:border-red-900/50
            dark:bg-red-950/20
          "
        >

          <p
            className="
              text-sm
              font-medium
              text-red-700

              dark:text-red-400
            "
          >
            {error}
          </p>


          <button
            type="button"
            onClick={() =>
              loadSavedThoughts()
            }
            className="
              mt-3
              text-xs
              font-semibold
              text-red-700
              underline

              dark:text-red-400
            "
          >
            Try again
          </button>

        </section>
      )}


      {/* ======================================
          LOADING
      ====================================== */}

      {loading && (
        <div
          className="
            rounded-[26px]
            border
            border-[#e5dde9]
            bg-white
            p-10
            text-center

            dark:border-[#332d39]
            dark:bg-[#1b191f]
          "
        >

          <div
            className="
              mx-auto
              h-7
              w-7
              animate-spin
              rounded-full
              border-2
              border-[#ddd4e2]
              border-t-[#806d8f]

              dark:border-[#3b3341]
              dark:border-t-[#cbb6d5]
            "
          />

          <p
            className="
              mt-4
              text-sm
              text-[#8f8595]

              dark:text-[#9b91a2]
            "
          >
            Loading saved thoughts...
          </p>

        </div>
      )}


      {/* ======================================
          EMPTY
      ====================================== */}

      {!loading &&
        !error &&
        thoughts.length === 0 && (
          <section
            className="
              rounded-[28px]
              border
              border-dashed
              border-[#d8cfdf]
              bg-white
              px-5
              py-14
              text-center

              dark:border-[#3c3442]
              dark:bg-[#1b191f]

              sm:px-6
              sm:py-16
            "
          >

            <div
              className="
                mx-auto
                grid
                h-14
                w-14
                place-items-center
                rounded-full
                bg-[#eee8ff]
                text-[#806d8f]

                dark:bg-[#2a2330]
                dark:text-[#c5b3d0]
              "
            >
              <Bookmark
                size={23}
              />
            </div>


            <h2
              className="
                mt-5
                text-sm
                font-semibold
                text-[#403747]

                dark:text-[#eee7f2]
              "
            >
              Nothing saved yet
            </h2>


            <p
              className="
                mx-auto
                mt-2
                max-w-sm
                text-xs
                leading-5
                text-[#9d949f]

                dark:text-[#898090]
              "
            >
              When a thought stays with you,
              save it and find it here later.
            </p>

          </section>
        )}


      {/* ======================================
          THOUGHT LIST
      ====================================== */}

      {!loading &&
        !error &&
        thoughts.length > 0 && (
          <section>

            <div className="space-y-3 sm:space-y-4">

              {thoughts.map(
                (thought) => (
                  <ThoughtCard
                    key={thought.id}
                    thought={
                      thought
                    }
                    onUpdated={
                      handleUpdated
                    }
                    onDeleted={
                      handleDeleted
                    }
                  />
                )
              )}

            </div>

          </section>
        )}

    </div>
  );
}

export default Saved;