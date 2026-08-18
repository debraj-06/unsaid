import {
  Bookmark,
  Check,
  Heart,
  HeartHandshake,
  LoaderCircle,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import {
  deleteThought,
  toggleThoughtBookmark,
  toggleThoughtLike,
  updateThought,
} from "../services/thoughtService";

import {
  getExperienceMatches,
} from "../services/experienceService";

import ConversationPanel from "./ConversationPanel";
import MentionText from "./MentionText";


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(
  date
) {
  if (!date) {
    return "";
  }


  const created =
    new Date(
      date
    ).getTime();


  if (
    Number.isNaN(
      created
    )
  ) {
    return "";
  }


  const difference =
    Date.now() -
    created;


  const minutes =
    Math.floor(
      difference /
        60000
    );


  if (
    minutes < 1
  ) {
    return "just now";
  }


  if (
    minutes < 60
  ) {
    return `${minutes}m`;
  }


  const hours =
    Math.floor(
      minutes / 60
    );


  if (
    hours < 24
  ) {
    return `${hours}h`;
  }


  const days =
    Math.floor(
      hours / 24
    );


  if (
    days < 7
  ) {
    return `${days}d`;
  }


  return new Date(
    date
  ).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",

      year:
        new Date(
          date
        ).getFullYear() !==
        new Date().getFullYear()
          ? "numeric"
          : undefined,
    }
  );
}


// ==========================================
// THOUGHT CARD
// ==========================================

function ThoughtCard({
  thought,
  onUpdated,
  onDeleted,
}) {
  const {
    user,
  } = useAuth();


  // ==========================================
  // STATE
  // ==========================================

  const [
    liked,
    setLiked,
  ] = useState(
    Boolean(
      thought.likedByMe
    )
  );


  const [
    likesCount,
    setLikesCount,
  ] = useState(
    Number(
      thought.likesCount ||
        0
    )
  );


  const [
    bookmarked,
    setBookmarked,
  ] = useState(
    Boolean(
      thought.bookmarkedByMe
    )
  );


  const [
    commentCount,
    setCommentCount,
  ] = useState(
    Number(
      thought.commentCount ||
        0
    )
  );


  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);


  const [
    editing,
    setEditing,
  ] = useState(false);


  const [
    editContent,
    setEditContent,
  ] = useState(
    thought.content ||
      ""
  );


  const [
    savingEdit,
    setSavingEdit,
  ] = useState(false);


  const [
    likeLoading,
    setLikeLoading,
  ] = useState(false);


  const [
    bookmarkLoading,
    setBookmarkLoading,
  ] = useState(false);


  const [
    deleteLoading,
    setDeleteLoading,
  ] = useState(false);


  const [
    conversationOpen,
    setConversationOpen,
  ] = useState(false);


  // ==========================================
  // RESONANCE STATE
  // ==========================================

  const [
    resonanceOpen,
    setResonanceOpen,
  ] = useState(false);


  const [
    resonanceLoading,
    setResonanceLoading,
  ] = useState(false);


  const [
    resonanceLoaded,
    setResonanceLoaded,
  ] = useState(false);


  const [
    resonanceExperiences,
    setResonanceExperiences,
  ] = useState([]);


  const [
    resonanceError,
    setResonanceError,
  ] = useState("");


  // ==========================================
  // OWNER
  // ==========================================

  const isOwner =
    Boolean(
      user?.username &&
        thought?.username &&
        user.username
          .toLowerCase() ===
          thought.username
            .toLowerCase()
    );


  // ==========================================
  // SYNC PROPS
  // ==========================================

  useEffect(() => {
    setLiked(
      Boolean(
        thought.likedByMe
      )
    );


    setLikesCount(
      Number(
        thought.likesCount ||
          0
      )
    );


    setBookmarked(
      Boolean(
        thought.bookmarkedByMe
      )
    );


    setCommentCount(
      Number(
        thought.commentCount ||
          0
      )
    );


    setEditContent(
      thought.content ||
        ""
    );


    // Reset resonance when
    // the thought itself changes.
    setResonanceOpen(
      false
    );

    setResonanceLoaded(
      false
    );

    setResonanceExperiences(
      []
    );

    setResonanceError(
      ""
    );
  }, [
    thought.id,
    thought.likedByMe,
    thought.likesCount,
    thought.bookmarkedByMe,
    thought.commentCount,
    thought.content,
  ]);


  // ==========================================
  // LIKE
  // ==========================================

  const handleLike =
    async () => {
      if (
        likeLoading
      ) {
        return;
      }


      const previousLiked =
        liked;


      const previousCount =
        likesCount;


      const nextLiked =
        !liked;


      setLiked(
        nextLiked
      );


      setLikesCount(
        nextLiked
          ? likesCount + 1
          : Math.max(
              0,
              likesCount - 1
            )
      );


      try {
        setLikeLoading(
          true
        );


        const data =
          await toggleThoughtLike(
            thought.id
          );


        setLiked(
          Boolean(
            data.liked
          )
        );


        setLikesCount(
          Number(
            data.likesCount ||
              0
          )
        );
      } catch (error) {
        setLiked(
          previousLiked
        );


        setLikesCount(
          previousCount
        );


        console.error(
          "Like error:",
          error
        );
      } finally {
        setLikeLoading(
          false
        );
      }
    };


  // ==========================================
  // BOOKMARK
  // ==========================================

  const handleBookmark =
    async () => {
      if (
        bookmarkLoading
      ) {
        return;
      }


      const previous =
        bookmarked;


      setBookmarked(
        !bookmarked
      );


      try {
        setBookmarkLoading(
          true
        );


        const data =
          await toggleThoughtBookmark(
            thought.id
          );


        setBookmarked(
          Boolean(
            data.bookmarked
          )
        );
      } catch (error) {
        setBookmarked(
          previous
        );


        console.error(
          "Bookmark error:",
          error
        );
      } finally {
        setBookmarkLoading(
          false
        );
      }
    };


  // ==========================================
  // SAVE EDIT
  // ==========================================

  const handleSaveEdit =
    async () => {
      const cleanContent =
        editContent.trim();


      if (
        !cleanContent
      ) {
        return;
      }


      if (
        cleanContent.length >
        1000
      ) {
        return;
      }


      try {
        setSavingEdit(
          true
        );


        const data =
          await updateThought(
            thought.id,
            cleanContent
          );


        if (
          data?.thought
        ) {
          onUpdated?.(
            data.thought
          );
        }


        setEditing(
          false
        );


        setMenuOpen(
          false
        );
      } catch (error) {
        console.error(
          "Update thought error:",
          error
        );
      } finally {
        setSavingEdit(
          false
        );
      }
    };


  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete =
    async () => {
      const confirmed =
        window.confirm(
          "Delete this thought? This cannot be undone."
        );


      if (
        !confirmed
      ) {
        return;
      }


      try {
        setDeleteLoading(
          true
        );


        await deleteThought(
          thought.id
        );


        setMenuOpen(
          false
        );


        onDeleted?.(
          thought.id
        );
      } catch (error) {
        console.error(
          "Delete thought error:",
          error
        );
      } finally {
        setDeleteLoading(
          false
        );
      }
    };


  // ==========================================
  // OPEN CONVERSATION
  // ==========================================

  const handleOpenConversation =
    () => {
      setConversationOpen(
        true
      );
    };


  // ==========================================
  // CONVERSATION CLOSED
  // ==========================================

  const handleConversationClose =
    () => {
      setConversationOpen(
        false
      );
    };


  // ==========================================
  // LOAD RESONANCE
  // ==========================================

  const handleResonance =
    async () => {
      if (
        resonanceLoading
      ) {
        return;
      }


      // ----------------------------------------
      // CLOSE PANEL
      // ----------------------------------------

      if (
        resonanceOpen
      ) {
        setResonanceOpen(
          false
        );

        return;
      }


      // ----------------------------------------
      // REOPEN ALREADY LOADED
      // ----------------------------------------

      if (
        resonanceLoaded
      ) {
        setResonanceOpen(
          true
        );

        return;
      }


      // ----------------------------------------
      // LOAD FROM SERVER
      // ----------------------------------------

      try {
        setResonanceOpen(
          true
        );


        setResonanceLoading(
          true
        );


        setResonanceError(
          ""
        );


        const data =
          await getExperienceMatches(
            thought.id
          );


        const experiences =
          Array.isArray(
            data?.experiences
          )
            ? data.experiences
            : [];


        setResonanceExperiences(
          experiences
        );


        setResonanceLoaded(
          true
        );
      } catch (error) {
        console.error(
          "Resonance error:",
          error
        );


        setResonanceError(
          error.message ||
            "Unable to find similar experiences right now."
        );
      } finally {
        setResonanceLoading(
          false
        );
      }
    };


  return (
    <>
      <article
        className="
          w-full
          min-w-0
          overflow-hidden

          rounded-[24px]

          border
          border-[#e5dde9]

          bg-white

          shadow-[0_8px_26px_rgba(55,42,67,0.035)]

          dark:border-[#342e39]
          dark:bg-[#1b191f]
          dark:shadow-none

          sm:rounded-[26px]
        "
      >

        {/* ====================================
            MAIN CONTENT
        ==================================== */}

        <div
          className="
            p-4
            sm:p-5
          "
        >

          {/* ====================================
              HEADER
          ==================================== */}

          <div
            className="
              flex
              min-w-0
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

              <Link
                to={`/user/${thought.username}`}
                className="
                  grid
                  h-9
                  w-9
                  shrink-0
                  place-items-center
                  rounded-full

                  bg-[#eee7f4]

                  text-[11px]
                  font-bold
                  uppercase
                  text-[#756681]

                  dark:bg-[#2a2330]
                  dark:text-[#c8b5d4]
                "
                aria-label={`Open @${thought.username}'s profile`}
              >
                {thought.username?.charAt(
                  0
                ) || "U"}
              </Link>


              <div
                className="
                  min-w-0
                "
              >

                <Link
                  to={`/user/${thought.username}`}
                  className="
                    block
                    max-w-full
                    truncate

                    text-xs
                    font-semibold

                    text-[#43394a]

                    hover:underline

                    dark:text-[#eee7f2]
                  "
                >
                  @{thought.username}
                </Link>


                <div
                  className="
                    mt-0.5
                    flex
                    items-center
                    gap-1.5
                  "
                >

                  <span
                    className="
                      text-[10px]
                      text-[#9a909f]

                      dark:text-[#827786]
                    "
                  >
                    {formatTime(
                      thought.createdAt
                    )}
                  </span>


                  {thought.updatedAt &&
                    thought.createdAt &&
                    new Date(
                      thought.updatedAt
                    ).getTime() !==
                      new Date(
                        thought.createdAt
                      ).getTime() && (
                      <>
                        <span
                          className="
                            text-[9px]
                            text-[#c2bac6]

                            dark:text-[#59505f]
                          "
                        >
                          ·
                        </span>

                        <span
                          className="
                            text-[10px]
                            text-[#9a909f]

                            dark:text-[#827786]
                          "
                        >
                          edited
                        </span>
                      </>
                    )}

                </div>

              </div>

            </div>


            {/* ==================================
                OWNER MENU
            ================================== */}

            {isOwner && (
              <div
                className="
                  relative
                  shrink-0
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setMenuOpen(
                      (current) =>
                        !current
                    )
                  }
                  className="
                    grid
                    h-8
                    w-8
                    place-items-center
                    rounded-full

                    text-[#8f8595]

                    hover:bg-[#f2edf4]

                    dark:text-[#8a7f90]
                    dark:hover:bg-[#2a2430]
                  "
                  aria-label="Thought options"
                  aria-expanded={
                    menuOpen
                  }
                >
                  <MoreHorizontal
                    size={17}
                  />
                </button>


                {menuOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      top-9
                      z-30
                      w-40
                      overflow-hidden
                      rounded-[16px]

                      border
                      border-[#e4dde7]

                      bg-white

                      p-1

                      shadow-[0_14px_35px_rgba(40,30,50,0.14)]

                      dark:border-[#3b3341]
                      dark:bg-[#211d25]
                    "
                  >

                    <button
                      type="button"
                      onClick={() => {
                        setEditContent(
                          thought.content ||
                            ""
                        );

                        setEditing(
                          true
                        );

                        setMenuOpen(
                          false
                        );
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-2
                        rounded-xl
                        px-3
                        py-2.5

                        text-left
                        text-xs
                        font-medium
                        text-[#4d4352]

                        hover:bg-[#f6f2f7]

                        dark:text-[#d8cedd]
                        dark:hover:bg-[#2b2530]
                      "
                    >
                      <Pencil
                        size={13}
                      />

                      Edit
                    </button>


                    <button
                      type="button"
                      onClick={
                        handleDelete
                      }
                      disabled={
                        deleteLoading
                      }
                      className="
                        flex
                        w-full
                        items-center
                        gap-2
                        rounded-xl
                        px-3
                        py-2.5

                        text-left
                        text-xs
                        font-medium
                        text-red-500

                        hover:bg-red-50

                        disabled:opacity-50

                        dark:hover:bg-red-950/20
                      "
                    >
                      <Trash2
                        size={13}
                      />

                      {deleteLoading
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>
                )}

              </div>
            )}

          </div>


          {/* ====================================
              EDITOR
          ==================================== */}

          {editing ? (
            <div
              className="
                mt-4
                space-y-3
              "
            >

              <textarea
                value={
                  editContent
                }
                onChange={(
                  event
                ) =>
                  setEditContent(
                    event.target.value
                  )
                }
                maxLength={
                  1000
                }
                rows={5}
                autoFocus
                className="
                  block
                  min-h-[140px]
                  w-full
                  resize-y
                  rounded-[18px]

                  border
                  border-[#ddd5e1]

                  bg-[#faf8fb]

                  p-3

                  text-sm
                  leading-6
                  text-[#403747]

                  outline-none

                  focus:border-[#907c9c]
                  focus:ring-2
                  focus:ring-[#ece3ef]

                  dark:border-[#39323e]
                  dark:bg-[#151319]
                  dark:text-[#eee7f2]
                "
              />


              <div
                className="
                  flex
                  flex-col
                  gap-2

                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                <span
                  className="
                    text-[10px]
                    text-[#9d949f]

                    dark:text-[#817786]
                  "
                >
                  {editContent.length}/1000
                </span>


                <div
                  className="
                    flex
                    justify-end
                    gap-2
                  "
                >

                  <button
                    type="button"
                    onClick={() => {
                      setEditing(
                        false
                      );

                      setEditContent(
                        thought.content ||
                          ""
                      );
                    }}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full

                      border
                      border-[#ddd4e2]

                      px-3.5
                      py-2

                      text-xs
                      font-semibold
                      text-[#71657a]

                      dark:border-[#3b3441]
                      dark:text-[#bdb1c5]
                    "
                  >
                    <X
                      size={13}
                    />

                    Cancel
                  </button>


                  <button
                    type="button"
                    onClick={
                      handleSaveEdit
                    }
                    disabled={
                      savingEdit ||
                      !editContent.trim()
                    }
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full

                      bg-[#302839]

                      px-4
                      py-2

                      text-xs
                      font-semibold
                      text-white

                      disabled:opacity-40

                      dark:bg-[#eee8ff]
                      dark:text-[#302839]
                    "
                  >
                    <Check
                      size={13}
                    />

                    {savingEdit
                      ? "Saving..."
                      : "Save"}
                  </button>

                </div>

              </div>

            </div>
          ) : (
            <>
              {/* =================================
                  THOUGHT CONTENT
              ================================= */}

              <p
                className="
                  mt-4
                  break-words

                  text-[14px]
                  leading-7

                  text-[#463d4c]

                  dark:text-[#d8cfdd]

                  sm:text-[15px]
                "
              >
                <MentionText
                  content={
                    thought.content
                  }
                />
              </p>
            </>
          )}

        </div>


        {/* ====================================
            ACTION BAR
        ==================================== */}

        <div
          className="
            flex
            min-w-0
            items-center
            justify-between
            gap-2

            border-t
            border-[#eee8f0]

            px-3
            py-2.5

            dark:border-[#2c2731]

            sm:px-4
          "
        >

          {/* ==================================
              LEFT ACTIONS
          ================================== */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-1
            "
          >

            {/* ==================================
                LIKE
            ================================== */}

            <button
              type="button"
              onClick={
                handleLike
              }
              disabled={
                likeLoading
              }
              className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full

                px-2.5
                py-2

                text-[11px]
                font-semibold

                transition

                ${
                  liked
                    ? `
                      bg-[#f9e8ed]
                      text-[#b94e67]

                      dark:bg-[#36232b]
                      dark:text-[#e8879c]
                    `
                    : `
                      text-[#827785]

                      hover:bg-[#f5f0f6]
                      hover:text-[#b94e67]

                      dark:text-[#938796]
                      dark:hover:bg-[#29232f]
                    `
                }
              `}
              aria-label={
                liked
                  ? "Unlike thought"
                  : "Like thought"
              }
            >

              <Heart
                size={15}
                fill={
                  liked
                    ? "currentColor"
                    : "none"
                }
              />

              <span>
                {likesCount}
              </span>

            </button>


            {/* ==================================
                COMMENTS
            ================================== */}

            <button
              type="button"
              onClick={
                handleOpenConversation
              }
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full

                px-2.5
                py-2

                text-[11px]
                font-semibold

                text-[#827785]

                transition

                hover:bg-[#f5f0f6]
                hover:text-[#5f5367]

                dark:text-[#938796]
                dark:hover:bg-[#29232f]
                dark:hover:text-[#d7cbdc]
              "
              aria-label="Open conversation"
            >

              <MessageCircle
                size={15}
              />

              <span>
                {commentCount}
              </span>

            </button>


            {/* ==================================
                RESONANCE
            ================================== */}

            <button
              type="button"
              onClick={
                handleResonance
              }
              disabled={
                resonanceLoading
              }
              className={`
                inline-flex
                items-center
                gap-1.5

                rounded-full

                px-2.5
                py-2

                text-[11px]
                font-semibold

                transition

                ${
                  resonanceOpen
                    ? `
                      bg-[#eee8f2]
                      text-[#665475]

                      dark:bg-[#30283b]
                      dark:text-[#d2bde0]
                    `
                    : `
                      text-[#827785]

                      hover:bg-[#f5f0f6]
                      hover:text-[#665475]

                      dark:text-[#938796]
                      dark:hover:bg-[#29232f]
                      dark:hover:text-[#d7cbdc]
                    `
                }
              `}
              aria-label="Find similar experiences"
              aria-expanded={
                resonanceOpen
              }
            >

              {resonanceLoading ? (
                <LoaderCircle
                  size={15}
                  className="
                    animate-spin
                  "
                />
              ) : (
                <HeartHandshake
                  size={15}
                  strokeWidth={1.8}
                />
              )}

              <span
                className="
                  hidden
                  sm:inline
                "
              >
                Resonance
              </span>

            </button>

          </div>


          {/* ==================================
              BOOKMARK
          ================================== */}

          <button
            type="button"
            onClick={
              handleBookmark
            }
            disabled={
              bookmarkLoading
            }
            className={`
              grid
              h-9
              w-9

              shrink-0
              place-items-center
              rounded-full

              transition

              ${
                bookmarked
                  ? `
                    bg-[#eee8ff]
                    text-[#665475]

                    dark:bg-[#30283b]
                    dark:text-[#d2bde0]
                  `
                  : `
                    text-[#827785]

                    hover:bg-[#f5f0f6]

                    dark:text-[#938796]
                    dark:hover:bg-[#29232f]
                  `
              }
            `}
            aria-label={
              bookmarked
                ? "Remove bookmark"
                : "Save thought"
            }
          >

            <Bookmark
              size={16}
              fill={
                bookmarked
                  ? "currentColor"
                  : "none"
              }
            />

          </button>

        </div>


        {/* ====================================
            RESONANCE PANEL
        ==================================== */}

        {resonanceOpen && (
          <div
            className="
              border-t
              border-[#eee8f0]

              bg-[#faf8fb]

              dark:border-[#2c2731]
              dark:bg-[#17141b]
            "
          >

            {/* PANEL HEADER */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-4

                px-4
                py-4

                sm:px-5
              "
            >

              <div
                className="
                  min-w-0
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <div
                    className="
                      grid
                      h-8
                      w-8
                      shrink-0
                      place-items-center
                      rounded-full

                      bg-[#eee8f2]

                      text-[#806d8f]

                      dark:bg-[#2a2330]
                      dark:text-[#c6b4d0]
                    "
                  >
                    <Sparkles
                      size={14}
                      strokeWidth={1.8}
                    />
                  </div>


                  <div>
                    <p
                      className="
                        text-[11px]
                        font-semibold

                        text-[#44394b]

                        dark:text-[#eee7f2]
                      "
                    >
                      Resonance
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[9px]

                        text-[#9b919f]

                        dark:text-[#817786]
                      "
                    >
                      Anonymous experiences that may feel familiar.
                    </p>
                  </div>

                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  setResonanceOpen(
                    false
                  )
                }
                className="
                  grid
                  h-7
                  w-7
                  shrink-0
                  place-items-center
                  rounded-full

                  text-[#908593]

                  transition

                  hover:bg-black/5
                  hover:text-[#55495c]

                  dark:hover:bg-white/5
                  dark:hover:text-[#e6dce9]
                "
                aria-label="Close resonance"
              >
                <X
                  size={14}
                />
              </button>

            </div>


            {/* ==================================
                LOADING
            ================================== */}

            {resonanceLoading && (
              <div
                className="
                  flex
                  items-center
                  justify-center

                  border-t
                  border-[#eee8f0]

                  px-5
                  py-8

                  dark:border-[#2c2731]
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2

                    text-[10px]

                    text-[#958a99]

                    dark:text-[#817786]
                  "
                >

                  <LoaderCircle
                    size={15}
                    className="
                      animate-spin
                    "
                  />

                  Looking through anonymous experiences...
                </div>

              </div>
            )}


            {/* ==================================
                ERROR
            ================================== */}

            {!resonanceLoading &&
              resonanceError && (
                <div
                  className="
                    border-t
                    border-[#eee8f0]

                    px-4
                    py-4

                    dark:border-[#2c2731]
                  "
                >

                  <div
                    className="
                      rounded-[14px]

                      border
                      border-red-200

                      bg-red-50

                      px-3
                      py-3

                      text-[10px]
                      leading-5

                      text-red-600

                      dark:border-red-900/40
                      dark:bg-red-950/20
                      dark:text-red-400
                    "
                  >
                    {resonanceError}
                  </div>

                </div>
              )}


            {/* ==================================
                NO MATCHES
            ================================== */}

            {!resonanceLoading &&
              !resonanceError &&
              resonanceExperiences.length ===
                0 && (
                <div
                  className="
                    border-t
                    border-[#eee8f0]

                    px-5
                    py-8

                    text-center

                    dark:border-[#2c2731]
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

                      bg-[#eee8f2]

                      text-[#806d8f]

                      dark:bg-[#29222f]
                      dark:text-[#c6b4d0]
                    "
                  >

                    <HeartHandshake
                      size={17}
                      strokeWidth={1.8}
                    />

                  </div>


                  <p
                    className="
                      mt-3

                      text-[11px]
                      font-semibold

                      text-[#4a3f50]

                      dark:text-[#eee7f2]
                    "
                  >
                    No close resonance yet.
                  </p>


                  <p
                    className="
                      mx-auto
                      mt-1
                      max-w-[340px]

                      text-[9px]
                      leading-4

                      text-[#9b919f]

                      dark:text-[#817786]
                    "
                  >
                    As more people share thoughts,
                    Unsaid will find experiences
                    that feel closer to yours.
                  </p>

                </div>
              )}


            {/* ==================================
                MATCHES
            ================================== */}

            {!resonanceLoading &&
              !resonanceError &&
              resonanceExperiences.length >
                0 && (
                <div
                  className="
                    border-t
                    border-[#eee8f0]

                    dark:border-[#2c2731]
                  "
                >

                  {/* MATCH COUNT */}

                  <div
                    className="
                      px-4
                      pt-4

                      sm:px-5
                    "
                  >

                    <p
                      className="
                        text-[10px]
                        font-medium

                        text-[#8f8495]

                        dark:text-[#817786]
                      "
                    >
                      {resonanceExperiences.length ===
                      1
                        ? "1 person expressed something similar."
                        : `${resonanceExperiences.length} people expressed something similar.`}
                    </p>

                  </div>


                  {/* EXPERIENCE LIST */}

                  <div
                    className="
                      mt-2
                      divide-y
                      divide-[#eee8f0]

                      dark:divide-[#2c2731]
                    "
                  >

                    {resonanceExperiences.map(
                      (
                        experience,
                        index
                      ) => (
                        <div
                          key={
                            `${experience.createdAt || "experience"}-${index}`
                          }
                          className="
                            px-4
                            py-4

                            sm:px-5
                          "
                        >

                          <div
                            className="
                              flex
                              gap-3
                            "
                          >

                            <span
                              className="
                                mt-2
                                h-2
                                w-2
                                shrink-0
                                rounded-full

                                bg-[#b9a6c2]

                                dark:bg-[#806d8f]
                              "
                            />


                            <p
                              className="
                                whitespace-pre-wrap
                                break-words

                                text-[11px]
                                leading-5

                                text-[#4e4355]

                                dark:text-[#d8cddc]
                              "
                            >
                              {experience.content}
                            </p>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

          </div>
        )}

      </article>


      {/* ======================================
          CONVERSATION PANEL
      ====================================== */}

      {conversationOpen && (
        <ConversationPanel
          thought={{
            ...thought,
            commentCount,
          }}
          onClose={
            handleConversationClose
          }
        />
      )}

    </>
  );
}


export default ThoughtCard;