import {
  ArrowLeft,
  Search as SearchIcon,
  UserRound,
  MessageSquareText,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  searchEverything,
} from "../services/searchService";

import ThoughtCard from "../components/ThoughtCard";


function Search() {
  const navigate =
    useNavigate();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  const [
    query,
    setQuery,
  ] = useState(
    searchParams.get("q") || ""
  );


  const [
    results,
    setResults,
  ] = useState({
    users: [],
    thoughts: [],
  });


  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // LIVE SEARCH
  // ==========================================

  useEffect(() => {
    const clean =
      query.trim();

    if (!clean) {
      setResults({
        users: [],
        thoughts: [],
      });

      setLoading(false);
      setError("");

      return;
    }


    const timeout =
      setTimeout(
        async () => {
          try {
            setLoading(true);
            setError("");

            const data =
              await searchEverything(
                clean
              );

            setResults({
              users:
                data.users || [],

              thoughts:
                data.thoughts || [],
            });

          } catch (error) {
            console.error(
              "Search error:",
              error
            );

            setError(
              error.message ||
                "Unable to search"
            );
          } finally {
            setLoading(false);
          }
        },
        250
      );


    return () =>
      clearTimeout(
        timeout
      );
  }, [query]);


  // ==========================================
  // QUERY FROM URL
  // ==========================================

  useEffect(() => {
    const urlQuery =
      searchParams.get("q") || "";

    if (
      urlQuery !== query
    ) {
      setQuery(
        urlQuery
      );
    }
  }, [
    searchParams,
  ]);


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit =
    (event) => {
      event.preventDefault();

      const clean =
        query.trim();

      if (!clean) {
        return;
      }

      setSearchParams({
        q: clean,
      });
    };


  // ==========================================
  // BACK
  // ==========================================

  const handleBack = () => {
    navigate(-1);
  };


  return (
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
          w-full
          max-w-[900px]
          px-3
          py-4

          sm:px-5
          sm:py-6
        "
      >

        {/* ====================================
            SEARCH BAR
        ==================================== */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <button
            type="button"
            onClick={
              handleBack
            }
            className="
              grid
              h-10
              w-10
              shrink-0
              place-items-center
              rounded-full
              text-[#756b7d]
              hover:bg-[#f0ebf2]

              dark:text-[#b8adbf]
              dark:hover:bg-[#28222d]
            "
          >
            <ArrowLeft
              size={18}
            />
          </button>


          <form
            onSubmit={
              handleSubmit
            }
            className="
              relative
              flex-1
            "
          >

            <SearchIcon
              size={17}
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[#978d9d]

                dark:text-[#8c8191]
              "
            />


            <input
              autoFocus
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value
                )
              }
              placeholder="Search Unsaid..."
              className="
                h-11
                w-full
                rounded-full
                border
                border-[#ded6e1]
                bg-white
                pl-11
                pr-4
                text-sm
                text-[#3d3542]
                outline-none

                focus:border-[#aa98b5]
                focus:ring-4
                focus:ring-[#ebe3ee]

                dark:border-[#39323e]
                dark:bg-[#1d1921]
                dark:text-[#eee7f2]
                dark:focus:border-[#65506f]
                dark:focus:ring-[#33273a]
              "
            />

          </form>

        </div>


        {/* ====================================
            CONTENT
        ==================================== */}

        <div className="mt-6">

          {/* LOADING */}

          {loading && (
            <div
              className="
                rounded-[24px]
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
                  h-6
                  w-6
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
                  mt-3
                  text-xs
                  text-[#9b919f]

                  dark:text-[#8b8091]
                "
              >
                Searching...
              </p>

            </div>
          )}


          {/* ERROR */}

          {!loading &&
            error && (
              <div
                className="
                  rounded-[24px]
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
              </div>
            )}


          {/* INITIAL */}

          {!loading &&
            !error &&
            !query.trim() && (
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
                    h-12
                    w-12
                    place-items-center
                    rounded-full
                    bg-[#eee7f4]
                    text-[#806d8f]

                    dark:bg-[#292230]
                    dark:text-[#bdabca]
                  "
                >
                  <SearchIcon
                    size={20}
                  />
                </div>


                <p
                  className="
                    mt-4
                    text-sm
                    font-semibold

                    dark:text-[#eee7f2]
                  "
                >
                  Search Unsaid
                </p>


                <p
                  className="
                    mt-1
                    text-xs
                    text-[#9d949f]

                    dark:text-[#898090]
                  "
                >
                  Search people and thoughts
                  together.
                </p>

              </div>
            )}


          {/* ==================================
              PEOPLE
          ================================== */}

          {!loading &&
            !error &&
            results.users.length >
              0 && (
              <section>

                <div className="mb-3">

                  <p
                    className="
                      text-[10px]
                      font-bold
                      tracking-[0.15em]
                      text-[#968b9b]
                      uppercase

                      dark:text-[#817786]
                    "
                  >
                    People
                  </p>

                </div>


                <div
                  className="
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-[#e5dde9]
                    bg-white

                    dark:border-[#342e39]
                    dark:bg-[#1b191f]
                  "
                >

                  {results.users.map(
                    (person) => (
                      <Link
                        key={
                          person.id
                        }
                        to={`/user/${person.username}`}
                        className="
                          flex
                          items-center
                          gap-3
                          border-b
                          border-[#eee8f0]
                          px-4
                          py-4
                          last:border-b-0
                          hover:bg-[#f7f3f8]

                          dark:border-[#2c2731]
                          dark:hover:bg-[#25202b]
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
                          {person.username.charAt(
                            0
                          )}
                        </div>


                        <div className="min-w-0">

                          <p
                            className="
                              text-sm
                              font-semibold
                              text-[#453b4b]

                              dark:text-[#eee7f2]
                            "
                          >
                            @{person.username}
                          </p>

                          {person.bio && (
                            <p
                              className="
                                mt-0.5
                                truncate
                                text-[11px]
                                text-[#988d9f]

                                dark:text-[#8c8191]
                              "
                            >
                              {person.bio}
                            </p>
                          )}

                        </div>


                        <UserRound
                          size={15}
                          className="
                            ml-auto
                            shrink-0
                            text-[#a097a4]

                            dark:text-[#756b7d]
                          "
                        />

                      </Link>
                    )
                  )}

                </div>

              </section>
            )}


          {/* ==================================
              THOUGHTS
          ================================== */}

          {!loading &&
            !error &&
            results.thoughts.length >
              0 && (
              <section
                className={
                  results.users.length >
                  0
                    ? "mt-7"
                    : ""
                }
              >

                <div className="mb-3">

                  <p
                    className="
                      text-[10px]
                      font-bold
                      tracking-[0.15em]
                      text-[#968b9b]
                      uppercase

                      dark:text-[#817786]
                    "
                  >
                    Thoughts
                  </p>

                </div>


                <div className="space-y-3">

                  {results.thoughts.map(
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


          {/* ==================================
              NO RESULTS
          ================================== */}

          {!loading &&
            !error &&
            query.trim() &&
            results.users.length ===
              0 &&
            results.thoughts.length ===
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
                    h-12
                    w-12
                    place-items-center
                    rounded-full
                    bg-[#eee7f4]
                    text-[#806d8f]

                    dark:bg-[#292230]
                    dark:text-[#bdabca]
                  "
                >
                  <SearchIcon
                    size={20}
                  />
                </div>


                <p
                  className="
                    mt-4
                    text-sm
                    font-semibold

                    dark:text-[#eee7f2]
                  "
                >
                  No results for "{query}"
                </p>


                <p
                  className="
                    mt-1
                    text-xs
                    text-[#9d949f]

                    dark:text-[#898090]
                  "
                >
                  Try another username,
                  topic, or phrase.
                </p>

              </div>
            )}

        </div>

      </div>

    </div>
  );
}

export default Search;