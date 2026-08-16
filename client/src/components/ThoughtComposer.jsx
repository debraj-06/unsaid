import {
  Check,
  LoaderCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createThought,
} from "../services/thoughtService";

import {
  improveThought,
} from "../services/aiService";

import {
  searchMentionUsers,
} from "../services/searchService";


function ThoughtComposer({
  onCreated,
}) {
  const [
    content,
    setContent,
  ] = useState("");

  const [
    improving,
    setImproving,
  ] = useState(false);

  const [
    posting,
    setPosting,
  ] = useState(false);

  const [
    improvedText,
    setImprovedText,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");


  // ==========================================
  // MENTIONS
  // ==========================================

  const [
    mentionUsers,
    setMentionUsers,
  ] = useState([]);

  const [
    mentionLoading,
    setMentionLoading,
  ] = useState(false);

  const [
    mentionOpen,
    setMentionOpen,
  ] = useState(false);

  const [
    mentionQuery,
    setMentionQuery,
  ] = useState("");

  const [
    mentionStart,
    setMentionStart,
  ] = useState(-1);

  const textareaRef =
    useRef(null);


  // ==========================================
  // SEARCH MENTION USERS
  // ==========================================

  useEffect(() => {
    if (
      !mentionOpen
    ) {
      setMentionUsers([]);
      return;
    }

    if (
      mentionQuery.length ===
      0
    ) {
      setMentionUsers([]);
      return;
    }

    let cancelled =
      false;

    const timeout =
      setTimeout(
        async () => {
          try {
            setMentionLoading(
              true
            );

            const data =
              await searchMentionUsers(
                mentionQuery
              );

            if (
              cancelled
            ) {
              return;
            }

            setMentionUsers(
              Array.isArray(
                data?.users
              )
                ? data.users
                : []
            );
          } catch (error) {
            if (
              cancelled
            ) {
              return;
            }

            console.error(
              "Mention search error:",
              error
            );

            setMentionUsers([]);
          } finally {
            if (
              !cancelled
            ) {
              setMentionLoading(
                false
              );
            }
          }
        },
        150
      );

    return () => {
      cancelled =
        true;

      clearTimeout(
        timeout
      );
    };
  }, [
    mentionOpen,
    mentionQuery,
  ]);


  // ==========================================
  // DETECT @ MENTION
  // ==========================================

  const detectMention =
    (
      value,
      cursorPosition
    ) => {
      const beforeCursor =
        value.slice(
          0,
          cursorPosition
        );

      const match =
        beforeCursor.match(
          /(^|\s)@([a-zA-Z0-9_]*)$/
        );

      if (!match) {
        setMentionOpen(
          false
        );

        setMentionQuery(
          ""
        );

        setMentionStart(
          -1
        );

        return;
      }

      const usernamePart =
        match[2] || "";

      const start =
        cursorPosition -
        usernamePart.length -
        1;

      setMentionStart(
        start
      );

      setMentionQuery(
        usernamePart
      );

      setMentionOpen(
        true
      );
    };


  // ==========================================
  // CONTENT CHANGE
  // ==========================================

  const handleContentChange =
    (event) => {
      const value =
        event.target.value;

      const cursorPosition =
        event.target.selectionStart;

      setContent(
        value
      );

      if (
        improvedText
      ) {
        setImprovedText(
          ""
        );
      }

      if (
        error
      ) {
        setError(
          ""
        );
      }

      detectMention(
        value,
        cursorPosition
      );
    };


  // ==========================================
  // CURSOR CHANGE
  // ==========================================

  const handleCursorChange =
    () => {
      const textarea =
        textareaRef.current;

      if (!textarea) {
        return;
      }

      detectMention(
        textarea.value,
        textarea.selectionStart
      );
    };


  // ==========================================
  // INSERT MENTION
  // ==========================================

  const handleMentionSelect =
    (person) => {
      const textarea =
        textareaRef.current;

      if (
        !textarea ||
        mentionStart < 0
      ) {
        return;
      }

      const cursorPosition =
        textarea.selectionStart;

      const before =
        content.slice(
          0,
          mentionStart
        );

      const after =
        content.slice(
          cursorPosition
        );

      const mention =
        `@${person.username}`;

      const needsSpace =
        after.length ===
          0 ||
        !after.startsWith(
          " "
        );

      const nextContent =
        `${before}${mention}${needsSpace ? " " : ""}${after}`;

      const nextCursor =
        before.length +
        mention.length +
        (
          needsSpace
            ? 1
            : 0
        );

      setContent(
        nextContent
      );

      setMentionOpen(
        false
      );

      setMentionQuery(
        ""
      );

      setMentionUsers(
        []
      );

      setMentionStart(
        -1
      );

      requestAnimationFrame(
        () => {
          textarea.focus();

          textarea.setSelectionRange(
            nextCursor,
            nextCursor
          );
        }
      );
    };


  // ==========================================
  // CLOSE MENTION MENU
  // ==========================================

  const closeMentions =
    () => {
      setMentionOpen(
        false
      );

      setMentionQuery(
        ""
      );

      setMentionUsers(
        []
      );

      setMentionStart(
        -1
      );
    };


  // ==========================================
  // AI IMPROVEMENT
  // ==========================================

  const handleImprove =
    async () => {
      const cleanContent =
        content.trim();

      if (!cleanContent) {
        return;
      }

      if (
        cleanContent.length >
        1000
      ) {
        setError(
          "Thought cannot exceed 1000 characters"
        );

        return;
      }

      try {
        setImproving(
          true
        );

        setError("");

        setImprovedText(
          ""
        );

        const data =
          await improveThought(
            cleanContent
          );

        const improved =
          typeof data?.improved ===
          "string"
            ? data.improved.trim()
            : "";

        if (!improved) {
          throw new Error(
            "AI did not return an improved thought"
          );
        }

        setImprovedText(
          improved
        );
      } catch (error) {
        console.error(
          "Improve thought error:",
          error
        );

        setError(
          error.message ||
            "Unable to improve thought right now"
        );
      } finally {
        setImproving(
          false
        );
      }
    };


  // ==========================================
  // USE AI VERSION
  // ==========================================

  const handleUseImproved =
    () => {
      if (
        !improvedText
      ) {
        return;
      }

      setContent(
        improvedText
      );

      setImprovedText(
        ""
      );

      setError(
        ""
      );

      closeMentions();
    };


  // ==========================================
  // DISMISS AI VERSION
  // ==========================================

  const handleDismissImproved =
    () => {
      setImprovedText(
        ""
      );
    };


  // ==========================================
  // POST THOUGHT
  // ==========================================

  const handleSubmit =
    async () => {
      const cleanContent =
        content.trim();

      if (!cleanContent) {
        setError(
          "Thought cannot be empty"
        );

        return;
      }

      if (
        cleanContent.length >
        1000
      ) {
        setError(
          "Thought cannot exceed 1000 characters"
        );

        return;
      }

      try {
        setPosting(
          true
        );

        setError("");

        await createThought(
          cleanContent
        );

        setContent(
          ""
        );

        setImprovedText(
          ""
        );

        closeMentions();

        if (
          onCreated
        ) {
          await onCreated();
        }
      } catch (error) {
        console.error(
          "Create thought error:",
          error
        );

        setError(
          error.message ||
            "Unable to publish thought"
        );
      } finally {
        setPosting(
          false
        );
      }
    };


  // ==========================================
  // KEYBOARD
  // ==========================================

  const handleKeyDown =
    (event) => {
      if (
        mentionOpen &&
        mentionUsers.length >
          0
      ) {
        if (
          event.key ===
          "Escape"
        ) {
          event.preventDefault();

          closeMentions();

          return;
        }

        if (
          event.key ===
          "Enter"
        ) {
          event.preventDefault();

          handleMentionSelect(
            mentionUsers[0]
          );

          return;
        }
      }

      if (
        event.key ===
          "Enter" &&
        (event.ctrlKey ||
          event.metaKey)
      ) {
        event.preventDefault();

        handleSubmit();
      }
    };


  // ==========================================
  // CHARACTER DATA
  // ==========================================

  const characterCount =
    content.length;

  const remaining =
    1000 -
    characterCount;

  const nearLimit =
    remaining <= 100;

  const canImprove =
    content.trim().length >
      0 &&
    !improving &&
    !posting;

  const canPost =
    content.trim().length >
      0 &&
    !posting;


  return (
    <section
      className="
        rounded-[28px]
        border
        border-[#e4dce7]
        bg-white
        p-4
        shadow-sm
        transition-colors

        dark:border-[#352e3a]
        dark:bg-[#1b191f]

        sm:p-5
      "
    >

      {/* ======================================
          HEADER
      ====================================== */}

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
            bg-[#eee7f4]
            text-[#806d8f]

            dark:bg-[#2a2330]
            dark:text-[#c5b3d0]
          "
        >
          <Sparkles
            size={15}
            strokeWidth={1.8}
          />
        </div>


        <div
          className="
            min-w-0
          "
        >

          <p
            className="
              text-xs
              font-semibold
              text-[#403747]

              dark:text-[#eee7f2]
            "
          >
            Say it your way
          </p>


          <p
            className="
              mt-0.5
              text-[10px]
              text-[#9a909f]

              dark:text-[#817786]
            "
          >
            No identity needed.
          </p>

        </div>

      </div>


      {/* ======================================
          TEXTAREA + MENTION DROPDOWN
      ====================================== */}

      <div
        className="
          relative
          mt-5
        "
      >

        <textarea
          ref={
            textareaRef
          }
          value={
            content
          }
          onChange={
            handleContentChange
          }
          onSelect={
            handleCursorChange
          }
          onClick={
            handleCursorChange
          }
          onKeyUp={
            handleCursorChange
          }
          onKeyDown={
            handleKeyDown
          }
          onBlur={() => {
            setTimeout(
              () => {
                closeMentions();
              },
              150
            );
          }}
          rows={5}
          maxLength={1000}
          disabled={
            posting
          }
          placeholder="What's on your mind? Use @ to mention someone."
          className="
            min-h-[140px]
            w-full
            resize-none
            rounded-[20px]
            border
            border-[#e2dae5]
            bg-[#faf8fb]
            p-4
            text-sm
            leading-6
            text-[#403747]
            outline-none
            transition

            placeholder:text-[#aaa0ae]

            focus:border-[#a493ad]
            focus:ring-4
            focus:ring-[#eee6f0]

            disabled:cursor-not-allowed
            disabled:opacity-70

            dark:border-[#3a333f]
            dark:bg-[#151319]
            dark:text-[#eee7f2]
            dark:placeholder:text-[#817786]

            dark:focus:border-[#675274]
            dark:focus:ring-[#30253a]
          "
        />


        {mentionOpen && (
          <div
            className="
              absolute
              left-0
              right-0
              top-full
              z-50
              mt-2
              overflow-hidden
              rounded-[18px]
              border
              border-[#e2d9e5]
              bg-white
              shadow-xl

              dark:border-[#3b3242]
              dark:bg-[#1d1921]
            "
          >

            {mentionLoading ? (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-3
                  text-xs
                  text-[#948997]

                  dark:text-[#94899a]
                "
              >
                <LoaderCircle
                  size={14}
                  className="animate-spin"
                />

                Searching people...
              </div>
            ) : mentionUsers.length ===
              0 ? (
              <div
                className="
                  px-4
                  py-3
                  text-xs
                  text-[#948997]

                  dark:text-[#94899a]
                "
              >
                No users found.
              </div>
            ) : (
              <div
                className="
                  max-h-60
                  overflow-y-auto
                  p-1
                "
              >

                {mentionUsers.map(
                  (
                    person
                  ) => (
                    <button
                      key={
                        person.id
                      }
                      type="button"
                      onMouseDown={(
                        event
                      ) => {
                        event.preventDefault();

                        handleMentionSelect(
                          person
                        );
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-[14px]
                        px-3
                        py-2.5
                        text-left
                        transition
                        hover:bg-[#f6f1f7]

                        dark:hover:bg-[#29232f]
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
                          text-[#796788]

                          dark:bg-[#2b2431]
                          dark:text-[#c6b4d2]
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
                            text-[#403747]

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
                              text-[10px]
                              text-[#9b919f]

                              dark:text-[#8e8495]
                            "
                          >
                            {person.bio}
                          </p>
                        )}

                      </div>


                      <span
                        className="
                          shrink-0
                          text-[9px]
                          text-[#a198a6]

                          dark:text-[#746b78]
                        "
                      >
                        {Number(
                          person.followersCount ||
                            0
                        )}{" "}
                        followers
                      </span>

                    </button>
                  )
                )}

              </div>
            )}

          </div>
        )}

      </div>


      {/* ======================================
          AI SUGGESTION
      ====================================== */}

      {improvedText && (
        <div
          className="
            mt-4
            rounded-[20px]
            border
            border-[#dcd0e2]
            bg-[#f8f3fa]
            p-4

            dark:border-[#493a52]
            dark:bg-[#251e2a]
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >

            <div
              className="
                flex
                min-w-0
                items-center
                gap-2
              "
            >

              <Sparkles
                size={14}
                className="
                  shrink-0
                  text-[#806d8f]

                  dark:text-[#c5b3d0]
                "
              />


              <p
                className="
                  text-xs
                  font-semibold
                  text-[#514657]

                  dark:text-[#ddd2e2]
                "
              >
                Suggested version
              </p>

            </div>


            <button
              type="button"
              onClick={
                handleDismissImproved
              }
              className="
                grid
                h-7
                w-7
                shrink-0
                place-items-center
                rounded-full
                text-[#8e8492]
                transition
                hover:bg-black/5

                dark:hover:bg-white/5
              "
              aria-label="Dismiss AI suggestion"
              title="Dismiss"
            >
              <X
                size={14}
                strokeWidth={2}
              />
            </button>

          </div>


          <p
            className="
              mt-3
              whitespace-pre-wrap
              break-words
              text-sm
              leading-6
              text-[#433949]

              dark:text-[#e6dce9]
            "
          >
            {improvedText}
          </p>


          <div
            className="
              mt-4
              flex
              flex-col
              gap-2

              sm:flex-row
            "
          >

            <button
              type="button"
              onClick={
                handleUseImproved
              }
              disabled={
                posting
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#302839]
                px-4
                py-2.5
                text-[11px]
                font-semibold
                text-white
                transition

                hover:bg-[#40344a]

                disabled:cursor-not-allowed
                disabled:opacity-40

                dark:bg-[#eee8ff]
                dark:text-[#302839]
                dark:hover:bg-white
              "
            >

              <Check
                size={14}
                strokeWidth={2.2}
              />

              Use this version

            </button>


            <button
              type="button"
              onClick={
                handleDismissImproved
              }
              disabled={
                posting
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-[#dcd2e0]
                px-4
                py-2.5
                text-[11px]
                font-semibold
                text-[#665b6b]
                transition

                hover:bg-white

                disabled:cursor-not-allowed
                disabled:opacity-40

                dark:border-[#463b4c]
                dark:text-[#bdb1c5]
                dark:hover:bg-[#2d2632]
              "
            >
              Keep mine
            </button>

          </div>

        </div>
      )}


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div
          className="
            mt-3
            rounded-[14px]
            border
            border-red-100
            bg-red-50
            px-3
            py-2.5
            text-xs
            leading-5
            text-red-600

            dark:border-red-900/30
            dark:bg-red-950/20
            dark:text-red-400
          "
        >
          {error}
        </div>
      )}


      {/* ======================================
          FOOTER
      ====================================== */}

      <div
        className="
          mt-4
          flex
          flex-col
          gap-3

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
          "
        >

          <span
            className={
              `
              text-[10px] ${
                nearLimit
                  ? "font-semibold text-red-500"
                  : "text-[#9b919f]"
              }
              `
            }
          >
            {characterCount}/1000
          </span>


          <button
            type="button"
            onClick={
              handleImprove
            }
            disabled={
              !canImprove
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-1.5
              rounded-full
              border
              border-[#ddd2e3]
              bg-[#faf7fc]
              px-3
              py-2
              text-[10px]
              font-semibold
              text-[#776783]
              transition

              hover:bg-[#f2ebf5]
              hover:text-[#645570]

              disabled:cursor-not-allowed
              disabled:opacity-40

              dark:border-[#463a4d]
              dark:bg-[#211b25]
              dark:text-[#c0afc8]
              dark:hover:bg-[#2b2431]
            "
          >

            {improving ? (
              <>
                <LoaderCircle
                  size={13}
                  className="animate-spin"
                />

                Improving...
              </>
            ) : (
              <>
                <Sparkles
                  size={13}
                  strokeWidth={1.9}
                />

                Improve
              </>
            )}

          </button>

        </div>


        <button
          type="button"
          onClick={
            handleSubmit
          }
          disabled={
            !canPost
          }
          className="
            inline-flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-full
            bg-[#302839]
            px-5
            py-2.5
            text-xs
            font-semibold
            text-white
            transition

            hover:bg-[#40334a]

            disabled:cursor-not-allowed
            disabled:opacity-40

            dark:bg-[#eee8ff]
            dark:text-[#302839]
            dark:hover:bg-white

            sm:w-auto
          "
        >

          {posting ? (
            <>
              <LoaderCircle
                size={14}
                className="animate-spin"
              />

              Posting...
            </>
          ) : (
            <>
              <Send
                size={14}
                strokeWidth={1.9}
              />

              Post thought
            </>
          )}

        </button>

      </div>


      {/* ======================================
          KEYBOARD TIP
      ====================================== */}

      <p
        className="
          mt-3
          text-[9px]
          text-[#aaa0ad]

          dark:text-[#746a79]
        "
      >
        Tip: Type @ to mention someone.
        Ctrl + Enter (or Cmd + Enter)
        to post.
      </p>

    </section>
  );
}

export default ThoughtComposer;