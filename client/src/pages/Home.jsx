import {
  Bell,
  Bookmark,
  ChevronRight,
  Compass,
  Heart,
  MessageCircle,
  Sparkles,
  UserRound,
  Users,
  Zap,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
  useNavigate,
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

const NEW_THOUGHT_POLL_MS =
  15000;


// ==========================================
// QUICK CARD
// ==========================================

function QuickCard({
  icon: Icon,
  title,
  description,
  value,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        min-w-0
        w-full
        items-center
        gap-3
        rounded-[20px]
        border
        border-[#e6dee9]
        bg-white
        p-4
        text-left
        transition-all
        duration-200

        hover:-translate-y-[1px]
        hover:border-[#d6c9dc]
        hover:shadow-[0_10px_30px_rgba(48,41,54,0.05)]

        dark:border-[#342d39]
        dark:bg-[#1b191f]
        dark:hover:border-[#453a4c]
        dark:hover:bg-[#1f1b23]
      "
    >
      <div
        className="
          grid
          h-10
          w-10
          shrink-0
          place-items-center
          rounded-[14px]
          bg-[#f0eaf4]
          text-[#75657f]

          dark:bg-[#2a2330]
          dark:text-[#c6b4d0]
        "
      >
        <Icon
          size={18}
          strokeWidth={1.8}
        />
      </div>

      <div
        className="
          min-w-0
          flex-1
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-2
          "
        >
          <p
            className="
              truncate
              text-xs
              font-semibold
              text-[#413747]

              dark:text-[#eee7f2]
            "
          >
            {title}
          </p>

          {value !== undefined && (
            <span
              className="
                shrink-0
                text-[10px]
                font-semibold
                text-[#8d8095]

                dark:text-[#928699]
              "
            >
              {value}
            </span>
          )}
        </div>

        <p
          className="
            mt-1
            truncate
            text-[10px]
            leading-4
            text-[#9b919f]

            dark:text-[#817786]
          "
        >
          {description}
        </p>
      </div>

      <ChevronRight
        size={15}
        className="
          shrink-0
          text-[#9b909f]
          transition-transform
          duration-200
          group-hover:translate-x-0.5
          dark:text-[#7c7182]
        "
      />
    </button>
  );
}


// ==========================================
// EMPTY FEED CARD
// ==========================================

function EmptyFeed({
  following,
}) {
  return (
    <div
      className="
        rounded-[24px]
        border
        border-[#e5dde9]
        bg-white
        px-6
        py-12
        text-center

        dark:border-[#332d39]
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
          rounded-[16px]
          bg-[#f0eaf4]
          text-[#776780]

          dark:bg-[#2a2330]
          dark:text-[#c6b4d0]
        "
      >
        {following ? (
          <Users
            size={20}
          />
        ) : (
          <Sparkles
            size={20}
          />
        )}
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
        {following
          ? "Your following feed is quiet."
          : "Nothing new yet."}
      </p>

      <p
        className="
          mx-auto
          mt-2
          max-w-[360px]
          text-xs
          leading-5
          text-[#9a90a0]

          dark:text-[#817786]
        "
      >
        {following
          ? "Follow a few people and their thoughts will appear here."
          : "Be the first to put something into the stream."}
      </p>
    </div>
  );
}


// ==========================================
// HOME
// ==========================================

function Home() {
  const navigate =
    useNavigate();

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
  // NEW THOUGHTS
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
  // LOAD FOR YOU
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
              ...(data.thoughts ||
                []),
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
  // LOAD FOLLOWING
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
              ...(data.thoughts ||
                []),
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
  // ACTIVE DATA
  // ==========================================

  const activeThoughts =
    feedMode ===
    "forYou"
      ? thoughts
      : followingThoughts;

  const activeLoading =
    feedMode ===
    "forYou"
      ? loading
      : followingLoading;

  const activeLoadingMore =
    feedMode ===
    "forYou"
      ? loadingMore
      : followingLoadingMore;

  const activeHasMore =
    feedMode ===
    "forYou"
      ? hasMore
      : followingHasMore;


  // ==========================================
  // NEW THOUGHT POLLING
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

        if (
          checkingForNew
        ) {
          return;
        }

        try {
          setCheckingForNew(
            true
          );

          const newestThought =
            thoughts[0];

          const newestCursor =
            btoa(
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
                        (
                          existing
                        ) =>
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
  // WINDOW INFINITE SCROLL
  // ==========================================

  useEffect(() => {
    const handleScroll =
      () => {
        const scrollTop =
          window.scrollY;

        const viewportHeight =
          window.innerHeight;

        const documentHeight =
          document.documentElement
            .scrollHeight;

        const distanceFromBottom =
          documentHeight -
          (scrollTop +
            viewportHeight);

        if (
          distanceFromBottom <
          600
        ) {
          if (
            feedMode ===
            "forYou"
          ) {
            loadMoreThoughts();
          } else {
            loadMoreFollowing();
          }
        }
      };

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [
    feedMode,
    loadMoreThoughts,
    loadMoreFollowing,
  ]);


  // ==========================================
  // NEW THOUGHT BAR
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

      requestAnimationFrame(
        () => {
          requestAnimationFrame(
            () => {
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
                  "instant",
              });
            }
          );
        }
      );
    };


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
  // FEED CHANGE
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
      conversation !== "1"
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
  // LOADING
  // ==========================================

  if (
    loading &&
    feedMode ===
      "forYou"
  ) {
    return (
      <div
        className="
          mx-auto
          flex
          min-h-[500px]
          w-full
          max-w-[1200px]
          items-center
          justify-center
          px-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            text-sm
            text-[#968c9c]

            dark:text-[#817786]
          "
        >
          <span
            className="
              h-5
              w-5
              animate-spin
              rounded-full
              border-2
              border-[#ddd4e2]
              border-t-[#806d8f]

              dark:border-[#39323e]
              dark:border-t-[#c7b3d2]
            "
          />

          Loading your space...
        </div>
      </div>
    );
  }


  return (
    <>
      {/* ======================================
          MAIN PAGE
      ====================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-[1200px]

          space-y-5

          px-1

          sm:space-y-6
        "
      >

        {/* ====================================
            HERO
        ==================================== */}

        <section
          className="
            rounded-[28px]
            border
            border-[#e6dee9]
            bg-white
            p-5

            dark:border-[#342d39]
            dark:bg-[#1b191f]

            sm:p-7
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              text-[9px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-[#96899f]

              dark:text-[#a296ab]
            "
          >
            <Sparkles
              size={13}
            />

            a place for thoughts
          </div>


          <div
            className="
              mt-3

              flex
              flex-col
              gap-5

              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >
            <div>
              <h1
                className="
                  max-w-[760px]
                  text-3xl
                  font-semibold
                  tracking-[-0.05em]
                  text-[#2f2935]

                  dark:text-[#f4edf7]

                  sm:text-4xl

                  xl:text-5xl
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
            </div>


            {/* COMPACT STATS */}

            <div
              className="
                grid
                grid-cols-2
                gap-2

                sm:grid-cols-3

                lg:min-w-[300px]
              "
            >
              <div
                className="
                  rounded-[16px]
                  border
                  border-[#ece5ee]
                  bg-[#faf8fb]
                  px-3
                  py-2.5

                  dark:border-[#302a34]
                  dark:bg-[#151319]
                "
              >
                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.12em]
                    text-[#9d92a2]
                  "
                >
                  Feed
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-[#403747]

                    dark:text-[#eee7f2]
                  "
                >
                  {activeThoughts.length}
                </p>
              </div>


              <div
                className="
                  rounded-[16px]
                  border
                  border-[#ece5ee]
                  bg-[#faf8fb]
                  px-3
                  py-2.5

                  dark:border-[#302a34]
                  dark:bg-[#151319]
                "
              >
                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.12em]
                    text-[#9d92a2]
                  "
                >
                  Mode
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-[#403747]

                    dark:text-[#eee7f2]
                  "
                >
                  {feedMode ===
                  "forYou"
                    ? "For you"
                    : "Following"}
                </p>
              </div>


              <div
                className="
                  hidden
                  rounded-[16px]
                  border
                  border-[#ece5ee]
                  bg-[#faf8fb]
                  px-3
                  py-2.5

                  dark:border-[#302a34]
                  dark:bg-[#151319]

                  sm:block
                "
              >
                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.12em]
                    text-[#9d92a2]
                  "
                >
                  Stream
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-[#403747]

                    dark:text-[#eee7f2]
                  "
                >
                  Live
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* ====================================
            COMPOSER
        ==================================== */}

        <section>
          <ThoughtComposer
            onCreated={
              handleThoughtCreated
            }
          />
        </section>


        {/* ====================================
            QUICK CARDS
        ==================================== */}

        <section
          className="
            grid
            grid-cols-1
            gap-3

            sm:grid-cols-2

            xl:grid-cols-4
          "
        >
          <QuickCard
            icon={
              Compass
            }
            title="Discover"
            description="Find new people and ideas."
            onClick={() =>
              navigate(
                "/discover"
              )
            }
          />

          <QuickCard
            icon={
              Bookmark
            }
            title="Saved"
            description="Keep the thoughts you want nearby."
            onClick={() =>
              navigate(
                "/saved"
              )
            }
          />

          <QuickCard
            icon={
              Bell
            }
            title="Notifications"
            description="See mentions, follows, and activity."
            onClick={() =>
              navigate(
                "/notifications"
              )
            }
          />

          <QuickCard
            icon={
              UserRound
            }
            title="My space"
            description="Your thoughts, profile, and followers."
            onClick={() =>
              navigate(
                "/space"
              )
            }
          />
        </section>


        {/* ====================================
            THOUGHT FEED CARD
        ==================================== */}

        <section
          className="
            rounded-[28px]
            border
            border-[#e6dee9]
            bg-white
            p-4

            dark:border-[#342d39]
            dark:bg-[#1b191f]

            sm:p-5
          "
        >

          {/* FEED HEADER */}

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

            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <Sparkles
                  size={15}
                  className="
                    text-[#806d8f]

                    dark:text-[#c6b4d0]
                  "
                />

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
              </div>

              <p
                className="
                  mt-1
                  text-[10px]
                  text-[#9a90a0]

                  dark:text-[#817786]
                "
              >
                A quieter stream of things worth saying.
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
                bg-[#faf8fb]
                p-1

                dark:border-[#3a3340]
                dark:bg-[#151319]
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
                  text-[10px]
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
                  text-[10px]
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


          {/* NEW THOUGHT CARD */}

          {showNewThoughtBar && (
            <button
              type="button"
              onClick={
                handleShowNewThoughts
              }
              className="
                mt-4
                flex
                w-full
                items-center
                justify-between
                gap-3
                rounded-[18px]
                border
                border-[#d8cae0]
                bg-[#f5eff8]
                px-4
                py-3
                text-left
                text-xs
                font-semibold
                text-[#675675]
                transition

                hover:bg-[#ede4f1]

                dark:border-[#493a52]
                dark:bg-[#29212f]
                dark:text-[#d8c8df]
                dark:hover:bg-[#332938]
              "
            >
              <span
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <Zap
                  size={14}
                  className="fill-current"
                />

                {newThoughts.length ===
                1
                  ? "1 new thought"
                  : `${newThoughts.length} new thoughts`}
              </span>

              <span
                className="
                  text-[9px]
                  font-medium
                  opacity-60
                "
              >
                Tap to reveal
              </span>
            </button>
          )}


          {/* ERROR */}

          {feedMode ===
            "forYou" &&
            error && (
              <div
                className="
                  mt-4
                  rounded-[18px]
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-xs
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
                  mt-4
                  rounded-[18px]
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-xs
                  text-red-700

                  dark:border-red-900/50
                  dark:bg-red-950/20
                  dark:text-red-400
                "
              >
                {followingError}
              </div>
            )}


          {/* FEED */}

          <div
            className="
              mt-4
            "
          >
            {activeLoading ? (
              <div
                className="
                  rounded-[22px]
                  border
                  border-[#ece5ee]
                  bg-[#faf8fb]
                  px-6
                  py-12
                  text-center

                  dark:border-[#302a34]
                  dark:bg-[#151319]
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
                    text-xs
                    text-[#8f8595]

                    dark:text-[#817786]
                  "
                >
                  Loading thoughts...
                </p>
              </div>
            ) : activeThoughts.length >
              0 ? (
              <div
                className="
                  space-y-4
                "
              >
                {activeThoughts.map(
                  (
                    thought
                  ) => (
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
            ) : (
              <EmptyFeed
                following={
                  feedMode ===
                  "following"
                }
              />
            )}
          </div>


          {/* LOAD MORE */}

          {activeHasMore && (
            <div
              className="
                mt-4
                flex
                min-h-[72px]
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
                    rounded-full
                    border
                    border-[#ece5ee]
                    bg-[#faf8fb]
                    px-4
                    py-2
                    text-[9px]
                    font-medium
                    text-[#978c9e]

                    dark:border-[#302a34]
                    dark:bg-[#151319]
                    dark:text-[#746a79]
                  "
                >
                  Keep scrolling
                </span>
              )}
            </div>
          )}


          {/* END */}

          {!activeHasMore &&
            activeThoughts.length >
              0 && (
              <div
                className="
                  mt-4
                  flex
                  items-center
                  justify-center
                  border-t
                  border-[#eee8f0]
                  pt-6

                  dark:border-[#2d2731]
                "
              >
                <span
                  className="
                    text-[9px]
                    font-medium
                    text-[#aaa0ad]

                    dark:text-[#746a79]
                  "
                >
                  You've reached the quieter end of the stream.
                </span>
              </div>
            )}

        </section>


        {/* ====================================
            SMALL DISCOVERY CARD
        ==================================== */}

        <section
          className="
            grid
            grid-cols-1
            gap-3

            md:grid-cols-3
          "
        >

          <button
            type="button"
            onClick={() =>
              navigate(
                "/discover"
              )
            }
            className="
              group
              rounded-[22px]
              border
              border-[#e6dee9]
              bg-gradient-to-br
              from-[#f7f1fa]
              to-white
              p-5
              text-left
              transition

              hover:-translate-y-[1px]
              hover:shadow-[0_10px_30px_rgba(48,41,54,0.05)]

              dark:border-[#342d39]
              dark:from-[#251f2a]
              dark:to-[#1b191f]
            "
          >
            <Compass
              size={18}
              className="
                text-[#806d8f]

                dark:text-[#c6b4d0]
              "
            />

            <p
              className="
                mt-4
                text-sm
                font-semibold
                text-[#403747]

                dark:text-[#eee7f2]
              "
            >
              Find something unexpected.
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
              Explore people, thoughts, and ideas outside your usual feed.
            </p>
          </button>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/saved"
              )
            }
            className="
              group
              rounded-[22px]
              border
              border-[#e6dee9]
              bg-white
              p-5
              text-left
              transition

              hover:-translate-y-[1px]
              hover:border-[#d6c9dc]
              hover:shadow-[0_10px_30px_rgba(48,41,54,0.05)]

              dark:border-[#342d39]
              dark:bg-[#1b191f]
            "
          >
            <Bookmark
              size={18}
              className="
                text-[#806d8f]

                dark:text-[#c6b4d0]
              "
            />

            <p
              className="
                mt-4
                text-sm
                font-semibold
                text-[#403747]

                dark:text-[#eee7f2]
              "
            >
              Keep what stays with you.
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
              Your saved thoughts are only one tap away.
            </p>
          </button>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/space"
              )
            }
            className="
              group
              rounded-[22px]
              border
              border-[#e6dee9]
              bg-white
              p-5
              text-left
              transition

              hover:-translate-y-[1px]
              hover:border-[#d6c9dc]
              hover:shadow-[0_10px_30px_rgba(48,41,54,0.05)]

              dark:border-[#342d39]
              dark:bg-[#1b191f]
            "
          >
            <UserRound
              size={18}
              className="
                text-[#806d8f]

                dark:text-[#c6b4d0]
              "
            />

            <p
              className="
                mt-4
                text-sm
                font-semibold
                text-[#403747]

                dark:text-[#eee7f2]
              "
            >
              Your space, your words.
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
              Manage your thoughts, followers, and profile.
            </p>
          </button>

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