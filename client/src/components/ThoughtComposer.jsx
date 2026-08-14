import {
  Check,
  LoaderCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  createThought,
} from "../services/thoughtService";

import {
  improveThought,
} from "../services/aiService";


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
  // IMPROVE
  // ==========================================

  const handleImprove = async () => {
    const cleanContent =
      content.trim();

    if (!cleanContent) {
      return;
    }

    try {
      setImproving(true);
      setError("");
      setImprovedText("");

      const data =
        await improveThought(
          cleanContent
        );

      const improved =
        data?.improved?.trim();

      if (!improved) {
        throw new Error(
          "AI did not return an improved thought"
        );
      }

      setImprovedText(improved);
    } catch (error) {
      console.error(
        "Improve thought error:",
        error
      );

      setError(
        error.message ||
          "Unable to improve thought"
      );
    } finally {
      setImproving(false);
    }
  };


  // ==========================================
  // USE AI VERSION
  // ==========================================

  const handleUseImproved = () => {
    if (!improvedText) {
      return;
    }

    setContent(improvedText);
    setImprovedText("");
    setError("");
  };


  // ==========================================
  // DISMISS AI VERSION
  // ==========================================

  const handleDismissImproved = () => {
    setImprovedText("");
  };


  // ==========================================
  // POST
  // ==========================================

  const handleSubmit = async () => {
    const cleanContent =
      content.trim();

    if (!cleanContent) {
      return;
    }

    try {
      setPosting(true);
      setError("");

      await createThought(
        cleanContent
      );

      setContent("");
      setImprovedText("");

      if (onCreated) {
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
      setPosting(false);
    }
  };


  // ==========================================
  // KEYBOARD
  // ==========================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      (event.ctrlKey ||
        event.metaKey)
    ) {
      event.preventDefault();

      handleSubmit();
    }
  };


  // ==========================================
  // TEXT CHANGE
  // ==========================================

  const handleContentChange = (
    event
  ) => {
    setContent(
      event.target.value
    );

    if (improvedText) {
      setImprovedText("");
    }

    if (error) {
      setError("");
    }
  };


  return (
    <section
      className="
        rounded-[28px]
        border
        border-[#e4dce7]
        bg-white
        p-4
        shadow-sm

        dark:border-[#352e3a]
        dark:bg-[#1b191f]

        sm:p-5
      "
    >

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex items-center gap-2">

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
          <Sparkles size={15} />
        </div>


        <div>
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
          TEXTAREA
      ====================================== */}

      <textarea
        value={content}
        onChange={
          handleContentChange
        }
        onKeyDown={handleKeyDown}
        rows={5}
        maxLength={1000}
        disabled={posting}
        placeholder="What's on your mind?"
        className="
          mt-5
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
              aria-label="Dismiss suggestion"
            >
              <X size={14} />
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

                dark:bg-[#eee8ff]
                dark:text-[#302839]
                dark:hover:bg-white
              "
            >
              <Check size={14} />

              Use this version
            </button>


            <button
              type="button"
              onClick={
                handleDismissImproved
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
            bg-red-50
            px-3
            py-2.5
            text-xs
            text-red-600

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
            items-center
            gap-3
          "
        >

          <span
            className={`
              text-[10px]
              ${
                content.length >= 900
                  ? "text-red-500"
                  : "text-[#9b919f]"
              }

              dark:text-[#898090]
            `}
          >
            {content.length}/1000
          </span>


          {/* AI BUTTON */}

          <button
            type="button"
            onClick={
              handleImprove
            }
            disabled={
              improving ||
              posting ||
              !content.trim()
            }
            className="
              inline-flex
              items-center
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
                />

                Improve
              </>
            )}

          </button>

        </div>


        {/* POST BUTTON */}

        <button
          type="button"
          onClick={
            handleSubmit
          }
          disabled={
            posting ||
            !content.trim()
          }
          className="
            inline-flex
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
              <Send size={14} />

              Post thought
            </>
          )}

        </button>

      </div>


      <p
        className="
          mt-3
          text-[9px]
          text-[#aaa0ad]

          dark:text-[#746a79]
        "
      >
        Tip: Ctrl + Enter
        (or Cmd + Enter)
        to post.
      </p>

    </section>
  );
}

export default ThoughtComposer;