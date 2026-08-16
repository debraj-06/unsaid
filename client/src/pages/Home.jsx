import {
  Compass,
  Sparkles,
  Zap,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import ThoughtComposer from "../components/ThoughtComposer";
import ThoughtCard from "../components/ThoughtCard";
import ConversationPanel from "../components/ConversationPanel";

import {
  getFollowingFeed,
} from "../services/userService";

import {
  getThoughts,
  getNewThoughts,
  getThoughtById,
} from "../services/thoughtService";


const FEED_LIMIT = 10;

const NEW_THOUGHT_POLL_MS = 15000;


function Home() {
  // ==========================================
  // URL
  // ==========================================

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  // ==========================================
  // FOR YOU
  // ==========================================

  const [
    thoughts,
    setThoughts,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false);

  const [
    hasMore,
    setHasMore,
  ] = useState(true);

  const [
    nextCursor,
    setNextCursor,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState("");


  // ==========================================
  // NEW THOUGHT BUFFER
  // ==========================================

  const [
    newThoughts,
    setNewThoughts,
  ] = useState([]);

  const [
    checkingForNew,
    setCheckingForNew,
  ] = useState(false);


  // ==========================================
  // FOLLOWING
  // ==========================================

  const [
    followingThoughts,
    setFollowingThoughts,
  ] = useState([]);

  const [
    followingLoading,
    setFollowingLoading,
  ] = useState(false);

  const [
    followingLoadingMore,
    setFollowingLoadingMore,
  ] = useState(false);

  const [
    followingHasMore,
    setFollowingHasMore,
  ] = useState(true);

  const [
    followingCursor,
    setFollowingCursor,
  ] = useState(null);

  const [
    followingError,
    setFollowingError,
  ] = useState("");


  // ==========================================
  // FEED MODE
  // ==========================================

  const [
    feedMode,
    setFeedMode,
  ] = useState("forYou");


  // ==========================================
  // INFINITE SCROLL SENTINEL
  // ==========================================

  const loadMoreRef =
    useRef(null);


  // ==========================================
  // DEEP LINK
  // ==========================================

  const [
    openedThoughtId,
    setOpenedThoughtId,
  ] = useState(null);

  const [
    openedThought,
    setOpenedThought,
  ] = useState(null);

  const [
    deepLinkLoading,
    setDeepLinkLoading,
  ] = useState(false);

  const [
    deepLinkError,
    setDeepLinkError,
  ] = useState("");


  // ==========================================
  // INITIAL FOR YOU
  // ==========================================

  const loadInitialThoughts =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getThoughts({
              limit:
                FEED_LIMIT,
            });

          setThoughts(
            data.thoughts || []
          );

          setNextCursor(
            data.nextCursor ||
              null
          );

          setHasMore(
            Boolean(
              data.hasMore
            )
          );
        } catch (error) {
          console.error(
            "Initial thoughts error:",
            error
          );

          setError(
            error.message ||
              "Unable to load thoughts"
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );


  // ==========================================
  // LOAD MORE FOR YOU
  // ==========================================

  const loadMoreThoughts =
    useCallback(
      async () => {
        if (
          loading ||
          loadingMore ||
          !hasMore ||
          !nextCursor
        ) {
          return;
        }

        try {
          setLoadingMore(true);

          const data =
            await getThoughts({
              cursor:
                nextCursor,

              limit:
                FEED_LIMIT,
            });

          setThoughts(
            (current) => [
              ...current,
              ...(data.thoughts || []),
            ]
          );

          setNextCursor(
            data.nextCursor ||
              null
          );

          setHasMore(
            Boolean(
              data.hasMore
            )
          );
        } catch (error) {
          console.error(
            "Load more thoughts error:",
            error
          );

          setError(
            error.message ||
              "Unable to load more thoughts"
          );
        } finally {
          setLoadingMore(false);
        }
      },
      [
        loading,
        loadingMore,
        hasMore,
        nextCursor,
      ]
    );


  // ==========================================
  // INITIAL FOLLOWING
  // ==========================================

  const loadInitialFollowing =
    useCallback(
      async () => {
        try {
          setFollowingLoading(
            true
          );

          setFollowingError("");

          const data =
            await getFollowingFeed({
              limit:
                FEED_LIMIT,
            });

          setFollowingThoughts(
            data.thoughts || []
          );

          setFollowingCursor(
            data.nextCursor ||
              null
          );

          setFollowingHasMore(
            Boolean(
              data.hasMore
            )
          );
        } catch (error) {
          console.error(
            "Initial following error:",
            error
          );

          setFollowingError(
            error.message ||
              "Unable to load following feed"
          );
        } finally {
          setFollowingLoading(
            false
          );
        }
      },
      []
    );


  // ==========================================
  // LOAD MORE FOLLOWING
  // ==========================================

  const loadMoreFollowing =
    useCallback(
      async () => {
        if (
          followingLoading ||
          followingLoadingMore ||
          !followingHasMore ||
          !followingCursor
        ) {
          return;
        }

        try {
          setFollowingLoadingMore(
            true
          );

          const data =
            await getFollowingFeed({
              cursor:
                followingCursor,

              limit:
                FEED_LIMIT,
            });

          setFollowingThoughts(
            (current) => [
              ...current,
              ...(data.thoughts || []),
            ]
          );

          setFollowingCursor(
            data.nextCursor ||
              null
          );

          setFollowingHasMore(
            Boolean(
              data.hasMore
            )
          );
        } catch (error) {
          console.error(
            "Load more following error:",
            error
          );

          setFollowingError(
            error.message ||
              "Unable to load more thoughts"
          );
        } finally {
          setFollowingLoadingMore(
            false
          );
        }
      },
      [
        followingLoading,
        followingLoadingMore,
        followingHasMore,
        followingCursor,
      ]
    );


  // ==========================================
  // FIRST LOAD
  // ==========================================

  useEffect(() => {
    loadInitialThoughts();
  }, [
    loadInitialThoughts,
  ]);


  // ==========================================
  // ACTIVE FEED
  // ==========================================

  const activeThoughts =
    feedMode === "forYou"
      ? thoughts
      : followingThoughts;

  const activeLoading =
    feedMode === "forYou"
      ? loading
      : followingLoading;

  const activeLoadingMore =
    feedMode === "forYou"
      ? loadingMore
      : followingLoadingMore;

  const activeHasMore =
    feedMode === "forYou"
      ? hasMore
      : followingHasMore;


  // ==========================================
  // INFINITE SCROLL
  // ==========================================

  useEffect(() => {
    const element =
      loadMoreRef.current;

    if (!element) {
      return;
    }

    if (!activeHasMore) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry =
            entries[0];

          if (
            !entry?.isIntersecting
          ) {
            return;
          }

          if (
            feedMode === "forYou"
          ) {
            loadMoreThoughts();
          } else {
            loadMoreFollowing();
          }
        },
        {
          root: null,
          rootMargin:
            "600px 0px",
          threshold: 0,
        }
      );

    observer.observe(
      element
    );

    return () => {
      observer.disconnect();
    };
  }, [
    feedMode,
    activeHasMore,
    loadMoreThoughts,
    loadMoreFollowing,
  ]);


  // ==========================================
  // CHECK FOR NEW THOUGHTS
  // ==========================================

  const checkForNewThoughts =
    useCallback(
      async () => {
        if (
          feedMode !==
          "forYou"
        ) {
          return;
        }

        if (
          thoughts.length ===
          0
        ) {
          return;
        }

        if (checkingForNew) {
          return;
        }

        try {
          setCheckingForNew(
            true
          );

          // First thought is newest
          // because API sorts newest first.
          const newestThought =
            thoughts[0];

          const newestCursor =
            typeof Buffer !==
              "undefined"
              ? Buffer.from(
                  JSON.stringify({
                    createdAt:
                      newestThought.createdAt,

                    id:
                      newestThought.id,
                  })
                ).toString(
                  "base64"
                )
              : btoa(
                  JSON.stringify({
                    createdAt:
                      newestThought.createdAt,

                    id:
                      newestThought.id,
                  })
                );

          const data =
            await getNewThoughts(
              newestCursor
            );

          if (
            data.thoughts?.length
          ) {
            setNewThoughts(
              (current) => {
                const existingIds =
                  new Set(
                    current.map(
                      (item) =>
                        item.id
                    )
                  );

                const incoming =
                  data.thoughts.filter(
                    (item) =>
                      !existingIds.has(
                        item.id
                      ) &&
                      !thoughts.some(
                        (existing) =>
                          existing.id ===
                          item.id
                      )
                  );

                return [
                  ...incoming,
                  ...current,
                ];
              }
            );
          }
        } catch (error) {
          console.error(
            "Check new thoughts error:",
            error
          );
        } finally {
          setCheckingForNew(
            false
          );
        }
      },
      [
        feedMode,
        thoughts,
        checkingForNew,
      ]
    );


  // ==========================================
  // POLL
  // ==========================================

  useEffect(() => {
    if (
      feedMode !==
      "forYou"
    ) {
      return;
    }

    const interval =
      setInterval(
        checkForNewThoughts,
        NEW_THOUGHT_POLL_MS
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, [
    feedMode,
    checkForNewThoughts,
  ]);


  // ==========================================
  // SHOW BUFFER
  // ==========================================

  const showNewThoughtBar =
    feedMode ===
      "forYou" &&
    newThoughts.length >
      0;


  // ==========================================
  // APPLY NEW THOUGHTS
  // ==========================================

  const handleShowNewThoughts =
    () => {
      if (
        newThoughts.length ===
        0
      ) {
        return;
      }

      const previousHeight =
        document.documentElement
          .scrollHeight;

      const previousScrollY =
        window.scrollY;

      const incoming =
        newThoughts;

      setThoughts(
        (current) => [
          ...incoming,
          ...current,
        ]
      );

      setNewThoughts([]);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const newHeight =
            document.documentElement
              .scrollHeight;

          const heightDifference =
            newHeight -
            previousHeight;

          window.scrollTo({
            top:
              previousScrollY +
              heightDifference,

            behavior:
              "auto",
          });
        });
      });
    };


  // ==========================================
  // DEEP LINK
  // ==========================================

  useEffect(() => {
    const thoughtId =
      searchParams.get(
        "thought"
      );

    const conversation =
      searchParams.get(
        "conversation"
      );

    if (
      !thoughtId ||
      conversation !==
        "1"
    ) {
      setOpenedThoughtId(
        null
      );

      setOpenedThought(
        null
      );

      setDeepLinkError(
        ""
      );

      return;
    }

    setOpenedThoughtId(
      thoughtId
    );

    const existingThought =
      thoughts.find(
        (thought) =>
          thought.id ===
          thoughtId
      ) ||
      followingThoughts.find(
        (thought) =>
          thought.id ===
          thoughtId
      );

    if (
      existingThought
    ) {
      setOpenedThought(
        existingThought
      );

      return;
    }

    const loadExactThought =
      async () => {
        try {
          setDeepLinkLoading(
            true
          );

          setDeepLinkError(
            ""
          );

          const data =
            await getThoughtById(
              thoughtId
            );

          if (
            data?.thought
          ) {
            setOpenedThought(
              data.thought
            );
          } else {
            setDeepLinkError(
              "Thought could not be found."
            );
          }
        } catch (error) {
          console.error(
            "Deep link error:",
            error
          );

          setDeepLinkError(
            error.message ||
              "Unable to open this thought."
          );
        } finally {
          setDeepLinkLoading(
            false
          );
        }
      };

    loadExactThought();
  }, [
    searchParams,
    thoughts,
    followingThoughts,
  ]);


  // ==========================================
  // CREATE
  // ==========================================

  const handleThoughtCreated =
    async () => {
      await loadInitialThoughts();

      setNewThoughts([]);

      if (
        feedMode ===
        "following"
      ) {
        await loadInitialFollowing();
      }
    };


  // ==========================================
  // DELETE
  // ==========================================

  const handleDeleted =
    (id) => {
      setThoughts(
        (current) =>
          current.filter(
            (thought) =>
              thought.id !==
              id
          )
      );

      setFollowingThoughts(
        (current) =>
          current.filter(
            (thought) =>
              thought.id !==
              id
          )
      );

      setNewThoughts(
        (current) =>
          current.filter(
            (thought) =>
              thought.id !==
              id
          )
      );

      if (
        openedThoughtId ===
        id
      ) {
        setOpenedThoughtId(
          null
        );

        setOpenedThought(
          null
        );
      }
    };


  // ==========================================
  // UPDATE
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

      setFollowingThoughts(
        (current) =>
          current.map(
            (thought) =>
              thought.id ===
              updatedThought.id
                ? updatedThought
                : thought
          )
      );

      setNewThoughts(
        (current) =>
          current.map(
            (thought) =>
              thought.id ===
              updatedThought.id
                ? updatedThought
                : thought
          )
      );

      if (
        openedThoughtId ===
        updatedThought.id
      ) {
        setOpenedThought(
          updatedThought
        );
      }
    };


  // ==========================================
  // CHANGE FEED
  // ==========================================

  const handleFeedChange =
    async (mode) => {
      setFeedMode(mode);

      if (
        mode ===
          "following" &&
        followingThoughts.length ===
          0
      ) {
        await loadInitialFollowing();
      }
    };


  // ==========================================
  // CLOSE CONVERSATION
  // ==========================================

  const handleCloseConversation =
    () => {
      setOpenedThoughtId(
        null
      );

      setOpenedThought(
        null
      );

      setDeepLinkError(
        ""
      );

      setSearchParams({});
    };


  // ==========================================
  // RENDER
  // ==========================================

  return (
    <>
      <div
        className="
          mx-auto
          w-full
          max-w-[900px]
          space-y-8
        "
      >

        {/* ====================================
            HERO
        ==================================== */}

        <section
          className="
            pt-1
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
              text-[10px]
              font-bold
              tracking-[0.18em]
              uppercase
              text-[#96899f]

              dark:text-[#a296ab]
            "
          >

            <Sparkles
              size={13}
            />

            a place for thoughts

          </div>


          <h1
            className="
              mt-3
              max-w-[720px]
              text-4xl
              font-semibold
              tracking-[-0.05em]
              text-[#2f2935]

              dark:text-[#f4edf7]

              sm:text-5xl
            "
          >
            What's worth saying today?
          </h1>


          <p
            className="
              mt-3
              max-w-[620px]
              text-sm
              leading-6
              text-[#8f8595]

              dark:text-[#9c92a3]
            "
          >
            No real identity required.
            Just bring the thought.
          </p>

        </section>


        {/* ====================================
            COMPOSER
        ==================================== */}

        <ThoughtComposer
          onCreated={
            handleThoughtCreated
          }
        />


        {/* ====================================
            FEED HEADER
        ==================================== */}

        <section>

          <div
            className="
              mb-5
              flex
              flex-col
              gap-4

              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-[#362f3d]

                  dark:text-[#eee7f2]
                "
              >
                Thoughts
              </p>


              <p
                className="
                  mt-1
                  text-xs
                  text-[#9a90a0]

                  dark:text-[#817786]
                "
              >
                Keep scrolling. The stream
                continues automatically.
              </p>

            </div>


            {/* FEED SWITCHER */}

            <div
              className="
                flex
                w-fit
                rounded-full
                border
                border-[#ddd4e2]
                bg-white
                p-1
                shadow-sm

                dark:border-[#3a3340]
                dark:bg-[#1d1921]
              "
            >

              <button
                type="button"
                onClick={() =>
                  handleFeedChange(
                    "forYou"
                  )
                }
                className={`
                  rounded-full
                  px-4
                  py-2
                  text-[11px]
                  font-semibold
                  transition

                  ${
                    feedMode ===
                    "forYou"
                      ? "bg-[#302839] text-white dark:bg-[#eee8ff] dark:text-[#302839]"
                      : "text-[#8f8496] hover:text-[#4e4357] dark:hover:text-white"
                  }
                `}
              >
                For you
              </button>


              <button
                type="button"
                onClick={() =>
                  handleFeedChange(
                    "following"
                  )
                }
                className={`
                  rounded-full
                  px-4
                  py-2
                  text-[11px]
                  font-semibold
                  transition

                  ${
                    feedMode ===
                    "following"
                      ? "bg-[#302839] text-white dark:bg-[#eee8ff] dark:text-[#302839]"
                      : "text-[#8f8496] hover:text-[#4e4357] dark:hover:text-white"
                  }
                `}
              >
                Following
              </button>

            </div>

          </div>


          {/* ====================================
              NEW THOUGHT BAR
          ==================================== */}

          {showNewThoughtBar && (
            <button
              type="button"
              onClick={
                handleShowNewThoughts
              }
              className="
                mb-5
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-[18px]
                border
                border-[#d8cae0]
                bg-[#f4eef7]
                px-4
                py-3
                text-xs
                font-semibold
                text-[#675675]
                shadow-sm
                transition
                hover:bg-[#ede4f1]

                dark:border-[#493a52]
                dark:bg-[#29212f]
                dark:text-[#d8c8df]
                dark:hover:bg-[#332938]
              "
            >

              <Zap
                size={15}
                className="
                  fill-current
                "
              />

              {newThoughts.length ===
              1
                ? "1 new thought"
                : `${newThoughts.length} new thoughts`}

              <span
                className="
                  opacity-60
                "
              >
                · tap to reveal
              </span>

            </button>
          )}


          {/* ====================================
              ERRORS
          ==================================== */}

          {feedMode ===
            "forYou" &&
            error && (
              <div
                className="
                  mb-4
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
              </div>
            )}


          {feedMode ===
            "following" &&
            followingError && (
              <div
                className="
                  mb-4
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
                {followingError}
              </div>
            )}


          {/* ====================================
              INITIAL LOADING
          ==================================== */}

          {activeLoading && (
            <div
              className="
                rounded-[26px]
                border
                border-[#e5dde9]
                bg-white
                p-8
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
                Loading thoughts...
              </p>

            </div>
          )}


          {/* ====================================
              STREAM
          ==================================== */}

          {!activeLoading &&
            activeThoughts.length >
              0 && (
              <div
                className="
                  space-y-4
                "
              >

                {activeThoughts.map(
                  (thought) => (
                    <ThoughtCard
                      key={
                        thought.id
                      }
                      thought={
                        thought
                      }
                      onDeleted={
                        handleDeleted
                      }
                      onUpdated={
                        handleUpdated
                      }
                    />
                  )
                )}

              </div>
            )}


          {/* ====================================
              EMPTY STATE
          ==================================== */}

          {!activeLoading &&
            activeThoughts.length ===
              0 &&
            !activeError && (
              <div
                className="
                  rounded-[26px]
                  border
                  border-dashed
                  border-[#ded5e3]
                  bg-white
                  p-10
                  text-center

                  dark:border-[#39313f]
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
                    dark:text-[#c5b3d1]
                  "
                >
                  <Compass
                    size={20}
                  />
                </div>


                <p
                  className="
                    mt-4
                    text-sm
                    font-semibold
                    text-[#403747]

                    dark:text-[#eee7f2]
                  "
                >
                  {feedMode ===
                  "following"
                    ? "You're not following anyone yet."
                    : "No thoughts to show right now."}
                </p>

              </div>
            )}


          {/* ====================================
              AUTO LOAD SENTINEL
          ==================================== */}

          {activeHasMore && (
            <div
              ref={
                loadMoreRef
              }
              className="
                flex
                min-h-[110px]
                items-center
                justify-center
              "
            >

              {activeLoadingMore ? (
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    text-[#9b919f]

                    dark:text-[#898090]
                  "
                >

                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-[#d8cfdf]
                      border-t-[#806d8f]

                      dark:border-[#3b3341]
                      dark:border-t-[#cbb6d5]
                    "
                  />

                  Finding more thoughts...

                </div>
              ) : (
                <span
                  className="
                    text-[10px]
                    text-[#aaa0ad]

                    dark:text-[#746a79]
                  "
                >
                  Loading more...
                </span>
              )}

            </div>
          )}


          {/* ====================================
              END
          ==================================== */}

          {!activeHasMore &&
            activeThoughts.length >
              0 && (
              <div
                className="
                  py-10
                  text-center
                "
              >

                <span
                  className="
                    text-[10px]
                    font-medium
                    text-[#aaa0ad]

                    dark:text-[#746a79]
                  "
                >
                  You've reached the quieter end
                  of the stream.
                </span>

              </div>
            )}

        </section>

      </div>


      {/* ======================================
          DEEP LINK LOADING
      ====================================== */}

      {deepLinkLoading && (
        <div
          className="
            fixed
            inset-0
            z-[150]
            grid
            place-items-center
            bg-black/25
            px-4
            backdrop-blur-sm
          "
        >

          <div
            className="
              rounded-2xl
              border
              border-[#e5dde9]
              bg-white
              px-5
              py-4
              text-xs
              font-medium
              text-[#71657a]
              shadow-xl

              dark:border-[#39323e]
              dark:bg-[#1b191f]
              dark:text-[#bdb1c5]
            "
          >
            Opening conversation...
          </div>

        </div>
      )}


      {/* ======================================
          DEEP LINK ERROR
      ====================================== */}

      {deepLinkError && (
        <div
          className="
            fixed
            bottom-5
            left-1/2
            z-[160]
            w-[min(90vw,420px)]
            -translate-x-1/2
            rounded-2xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-xs
            text-red-700
            shadow-xl

            dark:border-red-900/50
            dark:bg-red-950/30
            dark:text-red-400
          "
        >

          {deepLinkError}


          <button
            type="button"
            onClick={() => {
              setDeepLinkError(
                ""
              );

              setSearchParams({});
            }}
            className="
              ml-2
              font-semibold
              underline
            "
          >
            Close
          </button>

        </div>
      )}


      {/* ======================================
          CONVERSATION
      ====================================== */}

      {openedThought && (
        <ConversationPanel
          thought={
            openedThought
          }
          onClose={
            handleCloseConversation
          }
        />
      )}

    </>
  );
}


export default Home;