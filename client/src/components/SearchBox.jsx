import {
  Clock,
  MessageSquareText,
  Search,
  UserRound,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  searchEverything,
} from "../services/searchService";


function SearchBox() {
  const navigate =
    useNavigate();

  const containerRef =
    useRef(null);

  const inputRef =
    useRef(null);


  const [
    query,
    setQuery,
  ] = useState("");


  const [
    results,
    setResults,
  ] = useState({
    users: [],
    thoughts: [],
  });


  const [
    focused,
    setFocused,
  ] = useState(false);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    recentSearches,
    setRecentSearches,
  ] = useState(() => {
    try {
      const saved =
        localStorage.getItem(
          "unsaid_recent_searches"
        );

      return saved
        ? JSON.parse(saved)
        : [];
    } catch {
      return [];
    }
  });


  // ==========================================
  // SAVE RECENT
  // ==========================================

  const saveRecentSearch =
    (value) => {
      const clean =
        value.trim();

      if (!clean) {
        return;
      }

      setRecentSearches(
        (current) => {
          const next = [
            clean,
            ...current.filter(
              (item) =>
                item.toLowerCase() !==
                clean.toLowerCase()
            ),
          ].slice(0, 5);

          localStorage.setItem(
            "unsaid_recent_searches",
            JSON.stringify(next)
          );

          return next;
        }
      );
    };


  // ==========================================
  // LIVE SEARCH
  // ==========================================

  useEffect(() => {
    const cleanQuery =
      query.trim();

    if (!cleanQuery) {
      setResults({
        users: [],
        thoughts: [],
      });

      setError("");
      setLoading(false);

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
                cleanQuery
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
  // CLOSE OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleOutside =
      (event) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(
            event.target
          )
        ) {
          setFocused(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
    };
  }, []);


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

      saveRecentSearch(
        clean
      );

      setFocused(false);

      navigate(
        `/search?q=${encodeURIComponent(
          clean
        )}`
      );
    };


  // ==========================================
  // CLEAR
  // ==========================================

  const handleClear =
    () => {
      setQuery("");

      setResults({
        users: [],
        thoughts: [],
      });

      setError("");

      inputRef.current?.focus();
    };


  const showDropdown =
    focused &&
    (
      query.trim() ||
      recentSearches.length > 0
    );


  return (
    <div
      ref={containerRef}
      className="
        relative
        w-full
        max-w-[430px]
      "
    >

      {/* ======================================
          INPUT
      ====================================== */}

      <form
        onSubmit={
          handleSubmit
        }
        className="
          relative
          flex
          items-center
        "
      >

        <Search
          size={16}
          className="
            pointer-events-none
            absolute
            left-4
            text-[#978d9f]

            dark:text-[#8f8496]
          "
        />


        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) =>
            setQuery(
              event.target.value
            )
          }
          onFocus={() =>
            setFocused(true)
          }
          placeholder="Search Unsaid..."
          className="
            h-11
            w-full
            rounded-full
            border
            border-[#e1d9e4]
            bg-white
            pl-11
            pr-10
            text-sm
            text-[#3d3542]
            outline-none
            transition

            placeholder:text-[#aaa0ae]

            focus:border-[#ad9ab8]
            focus:ring-4
            focus:ring-[#e9e0ed]

            dark:border-[#39323e]
            dark:bg-[#1d1921]
            dark:text-[#eee7f2]
            dark:placeholder:text-[#817786]

            dark:focus:border-[#685374]
            dark:focus:ring-[#3b2d43]
          "
        />


        {query && (
          <button
            type="button"
            onClick={
              handleClear
            }
            className="
              absolute
              right-2
              grid
              h-8
              w-8
              place-items-center
              rounded-full
              text-[#968b9c]
              hover:bg-[#f2edf4]

              dark:hover:bg-[#2a2330]
            "
          >
            <X size={14} />
          </button>
        )}

      </form>


      {/* ======================================
          DROPDOWN
      ====================================== */}

      {showDropdown && (
        <div
          className="
            absolute
            left-0
            right-0
            top-[50px]
            z-[200]
            max-h-[520px]
            overflow-y-auto
            rounded-[22px]
            border
            border-[#e1d9e5]
            bg-white
            p-2
            shadow-[0_22px_55px_rgba(52,40,63,0.14)]

            dark:border-[#3b3341]
            dark:bg-[#1d1921]
            dark:shadow-[0_22px_55px_rgba(0,0,0,0.35)]
          "
        >

          {/* RECENT */}

          {!query.trim() &&
            recentSearches.length >
              0 && (
              <div>

                <div
                  className="
                    px-3
                    py-2
                    text-[10px]
                    font-bold
                    tracking-[0.15em]
                    text-[#9b909f]
                    uppercase

                    dark:text-[#817686]
                  "
                >
                  Recent
                </div>


                {recentSearches.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setQuery(
                          item
                        )
                      }
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-left
                        hover:bg-[#f6f2f7]

                        dark:hover:bg-[#28222e]
                      "
                    >

                      <Clock
                        size={15}
                        className="
                          text-[#9a909f]

                          dark:text-[#817786]
                        "
                      />

                      <span
                        className="
                          truncate
                          text-sm
                          text-[#554a5b]

                          dark:text-[#d0c5d4]
                        "
                      >
                        {item}
                      </span>

                    </button>
                  )
                )}

              </div>
            )}


          {/* LOADING */}

          {query.trim() &&
            loading && (
              <div
                className="
                  px-4
                  py-8
                  text-center
                "
              >

                <div
                  className="
                    mx-auto
                    h-5
                    w-5
                    animate-spin
                    rounded-full
                    border-2
                    border-[#ddd3e2]
                    border-t-[#806d8f]

                    dark:border-[#3b3341]
                    dark:border-t-[#c8b3d4]
                  "
                />

                <p
                  className="
                    mt-3
                    text-xs
                    text-[#9b919f]

                    dark:text-[#8c8191]
                  "
                >
                  Searching...
                </p>

              </div>
            )}


          {/* ERROR */}

          {query.trim() &&
            !loading &&
            error && (
              <div
                className="
                  rounded-xl
                  bg-red-50
                  px-4
                  py-3
                  text-xs
                  text-red-600

                  dark:bg-red-950/20
                  dark:text-red-400
                "
              >
                {error}
              </div>
            )}


          {/* RESULTS */}

          {query.trim() &&
            !loading &&
            !error && (
              <>

                {/* PEOPLE */}

                {results.users.length >
                  0 && (
                  <div>

                    <div
                      className="
                        px-3
                        py-2
                        text-[10px]
                        font-bold
                        tracking-[0.15em]
                        text-[#9b909f]
                        uppercase

                        dark:text-[#817686]
                      "
                    >
                      People
                    </div>


                    {results.users.map(
                      (person) => (
                        <Link
                          key={
                            person.id
                          }
                          to={`/user/${person.username}`}
                          onClick={() =>
                            setFocused(
                              false
                            )
                          }
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-3
                            hover:bg-[#f6f2f7]

                            dark:hover:bg-[#28222e]
                          "
                        >

                          <div
                            className="
                              grid
                              h-9
                              w-9
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
                                truncate
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
                                  text-[#9a909f]

                                  dark:text-[#877c90]
                                "
                              >
                                {person.bio}
                              </p>
                            )}

                          </div>

                        </Link>
                      )
                    )}

                  </div>
                )}


                {/* DIVIDER */}

                {results.users.length >
                  0 &&
                  results.thoughts.length >
                    0 && (
                    <div
                      className="
                        my-2
                        border-t
                        border-[#eee8f0]

                        dark:border-[#302a35]
                      "
                    />
                  )}


                {/* THOUGHTS */}

                {results.thoughts.length >
                  0 && (
                  <div>

                    <div
                      className="
                        px-3
                        py-2
                        text-[10px]
                        font-bold
                        tracking-[0.15em]
                        text-[#9b909f]
                        uppercase

                        dark:text-[#817686]
                      "
                    >
                      Thoughts
                    </div>


                    {results.thoughts.map(
                      (thought) => (
                        <Link
                          key={
                            thought.id
                          }
                          to={`/?thought=${thought.id}&conversation=1`}
                          onClick={() => {
                            saveRecentSearch(
                              query
                            );

                            setFocused(
                              false
                            );
                          }}
                          className="
                            block
                            rounded-xl
                            px-3
                            py-3
                            hover:bg-[#f6f2f7]

                            dark:hover:bg-[#28222e]
                          "
                        >

                          <div
                            className="
                              flex
                              items-start
                              gap-3
                            "
                          >

                            <div
                              className="
                                grid
                                h-9
                                w-9
                                shrink-0
                                place-items-center
                                rounded-full
                                bg-[#eee7f4]
                                text-[#806d8f]

                                dark:bg-[#2a2330]
                                dark:text-[#c5b3d0]
                              "
                            >
                              <MessageSquareText
                                size={15}
                              />
                            </div>


                            <div className="min-w-0">

                              <p
                                className="
                                  text-xs
                                  font-semibold
                                  text-[#5f5465]

                                  dark:text-[#d0c5d4]
                                "
                              >
                                @{thought.username}
                              </p>

                              <p
                                className="
                                  mt-1
                                  line-clamp-2
                                  text-sm
                                  leading-5
                                  text-[#403747]

                                  dark:text-[#eee7f2]
                                "
                              >
                                {thought.content}
                              </p>


                              <div
                                className="
                                  mt-1.5
                                  text-[9px]
                                  text-[#9b919f]

                                  dark:text-[#817786]
                                "
                              >
                                ♥{" "}
                                {
                                  thought.likesCount
                                }{" "}
                                · 💬{" "}
                                {
                                  thought.commentCount
                                }
                              </div>

                            </div>

                          </div>

                        </Link>
                      )
                    )}

                  </div>
                )}


                {/* EMPTY */}

                {results.users.length ===
                  0 &&
                  results.thoughts.length ===
                    0 && (
                    <div
                      className="
                        px-4
                        py-10
                        text-center
                      "
                    >

                      <div
                        className="
                          mx-auto
                          grid
                          h-10
                          w-10
                          place-items-center
                          rounded-full
                          bg-[#f0eaf4]
                          text-[#8c7c96]

                          dark:bg-[#29232f]
                          dark:text-[#b8a6c3]
                        "
                      >
                        <Search
                          size={17}
                        />
                      </div>

                      <p
                        className="
                          mt-3
                          text-sm
                          font-semibold
                          text-[#53495a]

                          dark:text-[#ddd3e2]
                        "
                      >
                        No results
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          text-[#9c929f]

                          dark:text-[#817786]
                        "
                      >
                        Try another username
                        or phrase.
                      </p>

                    </div>
                  )}

              </>
            )}

        </div>
      )}

    </div>
  );
}

export default SearchBox;