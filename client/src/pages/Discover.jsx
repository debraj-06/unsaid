import {
  Compass,
  Flame,
  Hash,
  RefreshCw,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getExplore,
} from "../services/searchService";

import ThoughtCard from "../components/ThoughtCard";


function Discover() {
  const navigate =
    useNavigate();


  const [
    activeTab,
    setActiveTab,
  ] = useState("latest");


  const [
    thoughts,
    setThoughts,
  ] = useState([]);


  const [
    people,
    setPeople,
  ] = useState([]);


  const [
    trending,
    setTrending,
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
  // LOAD DISCOVER
  // ==========================================

  const loadExplore =
    async (
      sort = activeTab,
      refresh = false
    ) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const data =
          await getExplore(
            sort
          );


        setThoughts(
          Array.isArray(
            data.thoughts
          )
            ? data.thoughts
            : []
        );


        setPeople(
          Array.isArray(
            data.people
          )
            ? data.people
            : []
        );


        setTrending(
          Array.isArray(
            data.trending
          )
            ? data.trending
            : []
        );
      } catch (error) {
        console.error(
          "Discover error:",
          error
        );

        setError(
          error.message ||
            "Unable to load Discover"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };


  useEffect(() => {
    loadExplore(
      "latest"
    );
  }, []);


  const handleTabChange =
    (tab) => {
      setActiveTab(tab);

      loadExplore(
        tab
      );
    };


  const handleRefresh =
    () => {
      loadExplore(
        activeTab,
        true
      );
    };


  const handleTrendClick =
    (topic) => {
      navigate(
        `/search?q=${encodeURIComponent(
          `#${topic}`
        )}`
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
          HERO
      ====================================== */}

      <section
        className="
          overflow-hidden
          rounded-[28px]
          border
          border-[#e3dbe8]
          bg-white
          shadow-[0_10px_35px_rgba(55,42,67,0.04)]

          dark:border-[#38313f]
          dark:bg-[#1b191f]
          dark:shadow-none
        "
      >

        <div
          className="
            relative
            px-5
            py-7

            sm:px-7
            sm:py-8
          "
        >

          <div
            className="
              absolute
              right-0
              top-0
              h-32
              w-32
              rounded-full
              bg-[#eee8ff]
              opacity-60
              blur-3xl

              dark:bg-[#4a3454]
              dark:opacity-20
            "
          />


          <div
            className="
              relative
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                text-[10px]
                font-bold
                tracking-[0.16em]
                text-[#8f7c9c]
                uppercase

                dark:text-[#b7a5c1]
              "
            >
              <Compass
                size={14}
              />

              explore unsaid
            </div>


            <h1
              className="
                mt-3
                text-3xl
                font-semibold
                tracking-[-0.04em]
                text-[#302936]

                dark:text-[#f3edf6]

                sm:text-4xl
              "
            >
              Discover thoughts
            </h1>


            <p
              className="
                mt-2
                max-w-xl
                text-sm
                leading-6
                text-[#8f8595]

                dark:text-[#9b91a2]
              "
            >
              Find interesting conversations,
              people and topics across Unsaid.
            </p>

          </div>

        </div>


        {/* ====================================
            TABS
        ==================================== */}

        <div
          className="
            flex
            flex-col
            gap-3
            border-t
            border-[#eee8f0]
            px-4
            py-3

            dark:border-[#2c2731]

            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
          "
        >

          <div
            className="
              flex
              w-full
              rounded-full
              bg-[#f6f2f8]
              p-1

              dark:bg-[#241f29]

              sm:w-fit
            "
          >

            <button
              type="button"
              onClick={() =>
                handleTabChange(
                  "latest"
                )
              }
              className={`
                flex-1
                rounded-full
                px-5
                py-2.5
                text-[11px]
                font-semibold
                transition

                sm:flex-none

                ${
                  activeTab ===
                  "latest"
                    ? "bg-white text-[#302839] shadow-sm dark:bg-[#eee8ff] dark:text-[#302839]"
                    : "text-[#8f8495] hover:text-[#453b4b] dark:text-[#877c90] dark:hover:text-white"
                }
              `}
            >
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                "
              >
                <Sparkles
                  size={13}
                />

                Latest
              </span>
            </button>


            <button
              type="button"
              onClick={() =>
                handleTabChange(
                  "popular"
                )
              }
              className={`
                flex-1
                rounded-full
                px-5
                py-2.5
                text-[11px]
                font-semibold
                transition

                sm:flex-none

                ${
                  activeTab ===
                  "popular"
                    ? "bg-white text-[#302839] shadow-sm dark:bg-[#eee8ff] dark:text-[#302839]"
                    : "text-[#8f8495] hover:text-[#453b4b] dark:text-[#877c90] dark:hover:text-white"
                }
              `}
            >
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                "
              >
                <Flame
                  size={13}
                />

                Popular
              </span>
            </button>

          </div>


          <button
            type="button"
            onClick={
              handleRefresh
            }
            disabled={
              refreshing
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-[#ddd5e2]
              bg-white
              px-3.5
              py-2
              text-[10px]
              font-semibold
              text-[#71657a]
              transition
              hover:bg-[#f7f3f8]
              disabled:opacity-50

              dark:border-[#3a3340]
              dark:bg-[#201c24]
              dark:text-[#bdb1c5]
              dark:hover:bg-[#29242f]
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

            Refresh
          </button>

        </div>

      </section>


      {/* ======================================
          TRENDING
      ====================================== */}

      {!loading &&
        !error &&
        trending.length >
          0 && (
          <section
            className="
              rounded-[24px]
              border
              border-[#e5dde9]
              bg-white
              p-4

              dark:border-[#342e39]
              dark:bg-[#1b191f]

              sm:p-5
            "
          >

            <div
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
                  bg-[#f2e8f6]
                  text-[#80678f]

                  dark:bg-[#2d2532]
                  dark:text-[#c7afd1]
                "
              >
                <Hash
                  size={18}
                />
              </div>


              <div>

                <h2
                  className="
                    text-sm
                    font-semibold
                    text-[#3b3341]

                    dark:text-[#eee7f2]
                  "
                >
                  Trending topics
                </h2>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    text-[#948a99]

                    dark:text-[#8c8191]
                  "
                >
                  Popular hashtags from the last
                  14 days.
                </p>

              </div>

            </div>


            <div
              className="
                mt-4
                grid
                grid-cols-2
                gap-2

                sm:grid-cols-4
              "
            >

              {trending.map(
                (item) => (
                  <button
                    key={
                      item.topic
                    }
                    type="button"
                    onClick={() =>
                      handleTrendClick(
                        item.topic
                      )
                    }
                    className="
                      rounded-[18px]
                      border
                      border-[#eee8f0]
                      bg-[#fcfafc]
                      px-3
                      py-3
                      text-left
                      transition
                      hover:border-[#d9cde0]
                      hover:bg-[#f8f3fa]

                      dark:border-[#302a35]
                      dark:bg-[#211d25]
                      dark:hover:border-[#46394c]
                      dark:hover:bg-[#29232f]
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-1
                      "
                    >
                      <Hash
                        size={12}
                        className="
                          text-[#907b9c]
                          dark:text-[#b7a1c1]
                        "
                      />

                      <span
                        className="
                          truncate
                          text-xs
                          font-semibold
                          text-[#4b4052]

                          dark:text-[#e1d6e5]
                        "
                      >
                        {item.topic}
                      </span>
                    </div>


                    <p
                      className="
                        mt-1
                        text-[9px]
                        text-[#9b919f]

                        dark:text-[#827786]
                      "
                    >
                      {item.count}{" "}
                      {item.count === 1
                        ? "thought"
                        : "thoughts"}
                    </p>

                  </button>
                )
              )}

            </div>

          </section>
        )}


      {/* ======================================
          PEOPLE
      ====================================== */}

      {!loading &&
        !error &&
        people.length >
          0 && (
          <section
            className="
              rounded-[24px]
              border
              border-[#e5dde9]
              bg-white
              p-4

              dark:border-[#342e39]
              dark:bg-[#1b191f]

              sm:p-5
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
                gap-3
              "
            >

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
                    h-10
                    w-10
                    shrink-0
                    place-items-center
                    rounded-[13px]
                    bg-[#eee8ff]
                    text-[#655475]

                    dark:bg-[#2c2433]
                    dark:text-[#cdb8d8]
                  "
                >
                  <Users
                    size={18}
                  />
                </div>


                <div>
                  <h2
                    className="
                      text-sm
                      font-semibold
                      text-[#3b3341]

                      dark:text-[#eee7f2]
                    "
                  >
                    People to discover
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      text-[#948a99]

                      dark:text-[#8c8191]
                    "
                  >
                    Real people already on Unsaid.
                  </p>
                </div>

              </div>


              <Link
                to="/search"
                className="
                  inline-flex
                  shrink-0
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-[#ddd5e2]
                  px-2.5
                  py-1.5
                  text-[9px]
                  font-semibold
                  text-[#75697d]
                  hover:bg-[#f7f3f8]

                  dark:border-[#3a3340]
                  dark:text-[#afa2b4]
                  dark:hover:bg-[#2a2430]
                "
              >
                <Search
                  size={11}
                />
                Search
              </Link>

            </div>


            <div
              className="
                mt-4
                grid
                grid-cols-1
                gap-2

                sm:grid-cols-2
              "
            >

              {people.map(
                (person) => (
                  <Link
                    key={
                      person.id
                    }
                    to={`/user/${person.username}`}
                    className="
                      group
                      flex
                      min-w-0
                      items-center
                      gap-3
                      rounded-[18px]
                      border
                      border-[#eee8f0]
                      bg-[#fcfafc]
                      p-3
                      transition
                      hover:border-[#ddd2e2]
                      hover:bg-[#f8f4f9]

                      dark:border-[#302a35]
                      dark:bg-[#211d25]
                      dark:hover:border-[#453a4c]
                      dark:hover:bg-[#28222e]
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
                        bg-[#eee7f4]
                        text-xs
                        font-bold
                        uppercase
                        text-[#756681]

                        dark:bg-[#2a2330]
                        dark:text-[#c8b5d4]
                      "
                    >
                      {person.username?.charAt(
                        0
                      ) || "U"}
                    </div>


                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >

                      <p
                        className="
                          truncate
                          text-xs
                          font-semibold
                          text-[#453b4b]

                          dark:text-[#eee7f2]
                        "
                      >
                        @{person.username}
                      </p>


                      <p
                        className="
                          mt-1
                          text-[10px]
                          text-[#978d9d]

                          dark:text-[#897e91]
                        "
                      >
                        {person.followersCount || 0}{" "}
                        {person.followersCount ===
                        1
                          ? "follower"
                          : "followers"}
                      </p>


                      {person.bio && (
                        <p
                          className="
                            mt-0.5
                            truncate
                            text-[10px]
                            text-[#aaa0ad]

                            dark:text-[#7f7487]
                          "
                        >
                          {person.bio}
                        </p>
                      )}

                    </div>


                    <span
                      className="
                        shrink-0
                        rounded-full
                        bg-[#302839]
                        px-2.5
                        py-1.5
                        text-[9px]
                        font-semibold
                        text-white

                        dark:bg-[#eee8ff]
                        dark:text-[#302839]
                      "
                    >
                      View
                    </span>

                  </Link>
                )
              )}

            </div>

          </section>
        )}


      {/* ======================================
          POPULAR INFO
      ====================================== */}

      {!loading &&
        !error &&
        activeTab ===
          "popular" && (
          <div
            className="
              flex
              items-start
              gap-3
              rounded-[20px]
              border
              border-[#e3dce7]
              bg-[#faf7fc]
              px-4
              py-3.5

              dark:border-[#3b3341]
              dark:bg-[#211c25]
            "
          >

            <div
              className="
                mt-0.5
                grid
                h-8
                w-8
                shrink-0
                place-items-center
                rounded-full
                bg-[#f2e4ea]
                text-[#ad566b]

                dark:bg-[#38242c]
                dark:text-[#e08297]
              "
            >
              <Flame
                size={15}
              />
            </div>


            <div>

              <p
                className="
                  text-xs
                  font-semibold
                  text-[#4c4252]

                  dark:text-[#e0d5e4]
                "
              >
                Popularity is more than likes
              </p>


              <p
                className="
                  mt-1
                  text-[10px]
                  leading-5
                  text-[#958b99]

                  dark:text-[#8b8091]
                "
              >
                Popular thoughts are ranked using
                likes, conversation, and recency.
              </p>

            </div>

          </div>
        )}


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div
          className="
            rounded-[22px]
            border
            border-red-200
            bg-red-50
            p-5
            text-sm
            text-red-700

            dark:border-red-900/50
            dark:bg-red-950/20
            dark:text-red-400
          "
        >
          {error}

          <button
            type="button"
            onClick={() =>
              loadExplore(
                activeTab
              )
            }
            className="
              ml-2
              font-semibold
              underline
            "
          >
            Try again
          </button>
        </div>
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
            Loading Discover...
          </p>
        </div>
      )}


      {/* ======================================
          EMPTY
      ====================================== */}

      {!loading &&
        !error &&
        thoughts.length ===
          0 && (
          <div
            className="
              rounded-[28px]
              border
              border-dashed
              border-[#d8cfdf]
              bg-white
              px-6
              py-14
              text-center

              dark:border-[#3c3442]
              dark:bg-[#1b191f]
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
                bg-[#eee7f4]
                text-[#806d8f]

                dark:bg-[#292230]
                dark:text-[#bdabca]
              "
            >
              <Compass
                size={22}
              />
            </div>


            <p
              className="
                mt-5
                text-sm
                font-semibold

                dark:text-[#eee7f2]
              "
            >
              Nothing to explore yet
            </p>


            <p
              className="
                mt-2
                text-xs
                text-[#9d949f]

                dark:text-[#898090]
              "
            >
              Be the first person to say
              something.
            </p>
          </div>
        )}


      {/* ======================================
          THOUGHTS
      ====================================== */}

      {!loading &&
        !error &&
        thoughts.length >
          0 && (
          <section>

            <div
              className="
                mb-4
                flex
                items-start
                justify-between
                gap-4
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#39313f]

                    dark:text-[#eee7f2]
                  "
                >
                  {activeTab ===
                  "popular"
                    ? "Popular conversations"
                    : "Latest thoughts"}
                </p>


                <p
                  className="
                    mt-1
                    text-[10px]
                    leading-5
                    text-[#9b919f]

                    dark:text-[#817786]
                  "
                >
                  {activeTab ===
                  "popular"
                    ? "What people are engaging with most."
                    : "Fresh thoughts from across Unsaid."}
                </p>

              </div>


              <div
                className="
                  hidden
                  shrink-0
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-[#e2dae7]
                  bg-white
                  px-2.5
                  py-1.5
                  text-[9px]
                  font-semibold
                  text-[#877b8e]

                  dark:border-[#39323f]
                  dark:bg-[#1f1b23]
                  dark:text-[#9c91a3]

                  sm:flex
                "
              >

                {activeTab ===
                "popular" ? (
                  <>
                    <Flame
                      size={11}
                    />
                    ranked
                  </>
                ) : (
                  <>
                    <Sparkles
                      size={11}
                    />
                    newest
                  </>
                )}

              </div>

            </div>


            <div
              className="
                space-y-3

                sm:space-y-4
              "
            >

              {thoughts.map(
                (thought) => (
                  <ThoughtCard
                    key={
                      thought.id
                    }
                    thought={
                      thought
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


export default Discover;