import {
  ArrowLeft,
  MessageCircle,
  RefreshCw,
  Send,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createComment,
  getComments,
} from "../services/commentService";

import CommentItem from "./CommentItem";


function ConversationPanel({
  thought,
  onClose,
}) {
  // ==========================================
  // COMMENTS
  // ==========================================

  const [
    comments,
    setComments,
  ] = useState([]);


  // ==========================================
  // LOADING
  // ==========================================

  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    posting,
    setPosting,
  ] = useState(false);


  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  // ==========================================
  // ERROR
  // ==========================================

  const [
    error,
    setError,
  ] = useState("");


  // ==========================================
  // INPUT
  // ==========================================

  const [
    content,
    setContent,
  ] = useState("");


  // ==========================================
  // REPLY
  // ==========================================

  const [
    replyTo,
    setReplyTo,
  ] = useState(null);


  // ==========================================
  // LOAD COMMENTS
  // ==========================================

  const loadComments =
    async (
      showRefresh = false
    ) => {
      if (!thought?.id) {
        return;
      }

      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const data =
          await getComments(
            thought.id
          );

        setComments(
          Array.isArray(
            data.comments
          )
            ? data.comments
            : []
        );
      } catch (error) {
        console.error(
          "Load comments error:",
          error
        );

        setError(
          error.message ||
            "Unable to load comments."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };


  // ==========================================
  // LOAD WHEN OPEN
  // ==========================================

  useEffect(() => {
    loadComments();
  }, [
    thought?.id,
  ]);


  // ==========================================
  // ROOT COMMENTS
  // ==========================================

  const rootComments =
    useMemo(
      () =>
        comments.filter(
          (comment) =>
            !comment.parentComment
        ),
      [comments]
    );


  // ==========================================
  // REPLIES
  // ==========================================

  const getReplies =
    (commentId) => {
      return comments.filter(
        (comment) =>
          comment.parentComment ===
          commentId
      );
    };


  // ==========================================
  // POST COMMENT
  // ==========================================

  const handleSubmit =
    async () => {
      const cleanContent =
        content.trim();

      if (!cleanContent) {
        return;
      }

      if (
        cleanContent.length >
        500
      ) {
        setError(
          "Comment cannot exceed 500 characters."
        );

        return;
      }

      try {
        setPosting(true);
        setError("");

        const data =
          await createComment(
            thought.id,
            cleanContent,
            replyTo?.id ||
              null
          );

        if (
          !data?.comment
        ) {
          throw new Error(
            "Comment was not returned by the server."
          );
        }

        setComments(
          (current) => [
            ...current,
            data.comment,
          ]
        );

        setContent("");

        setReplyTo(null);
      } catch (error) {
        console.error(
          "Create comment error:",
          error
        );

        setError(
          error.message ||
            "Unable to post comment."
        );
      } finally {
        setPosting(false);
      }
    };


  // ==========================================
  // UPDATE COMMENT
  // ==========================================

  const handleUpdated =
    (updatedComment) => {
      setComments(
        (current) =>
          current.map(
            (comment) =>
              comment.id ===
              updatedComment.id
                ? updatedComment
                : comment
          )
      );
    };


  // ==========================================
  // DELETE COMMENT
  // ==========================================

  const handleDeleted =
    (commentId) => {
      setComments(
        (current) =>
          current.filter(
            (comment) =>
              comment.id !==
                commentId &&
              comment.parentComment !==
                commentId
          )
      );
    };


  // ==========================================
  // CLOSE ERROR
  // ==========================================

  const clearError =
    () => {
      setError("");
    };


  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        bg-black/40
        backdrop-blur-sm
      "
    >

      <div
        className="
          absolute
          right-0
          top-0
          flex
          h-full
          w-full
          flex-col
          bg-[#faf8fa]
          shadow-2xl

          dark:bg-[#151319]

          sm:max-w-[520px]
        "
      >

        {/* ==================================
            HEADER
        ================================== */}

        <header
          className="
            flex
            shrink-0
            items-center
            gap-3
            border-b
            border-[#e8e2e9]
            px-4
            py-4

            dark:border-[#2c2731]

            sm:px-5
          "
        >

          <button
            type="button"
            onClick={
              onClose
            }
            className="
              grid
              h-9
              w-9
              shrink-0
              place-items-center
              rounded-full
              text-[#7f7685]
              hover:bg-[#f1edf2]

              dark:text-[#a59aa9]
              dark:hover:bg-[#28222d]
            "
            aria-label="Close conversation"
          >
            <ArrowLeft
              size={18}
            />
          </button>


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

              <MessageCircle
                size={16}
                className="
                  shrink-0
                  text-[#8d79a1]
                "
              />

              <h2
                className="
                  truncate
                  text-sm
                  font-semibold
                  text-[#302936]

                  dark:text-[#f0e9f3]
                "
              >
                Conversation
              </h2>

            </div>


            <p
              className="
                mt-0.5
                truncate
                text-[11px]
                text-[#99909e]

                dark:text-[#88808c]
              "
            >
              @{thought.username}'s thought
            </p>

          </div>


          <div
            className="
              ml-auto
              flex
              items-center
              gap-1
            "
          >

            <button
              type="button"
              onClick={() =>
                loadComments(
                  true
                )
              }
              disabled={
                refreshing
              }
              className="
                grid
                h-9
                w-9
                place-items-center
                rounded-full
                text-[#817785]
                hover:bg-[#f1edf2]
                disabled:opacity-50

                dark:text-[#a59aa9]
                dark:hover:bg-[#28222d]
              "
              aria-label="Refresh comments"
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>


            <button
              type="button"
              onClick={
                onClose
              }
              className="
                grid
                h-9
                w-9
                place-items-center
                rounded-full
                text-[#7f7685]
                hover:bg-[#f1edf2]

                dark:text-[#a59aa9]
                dark:hover:bg-[#28222d]
              "
              aria-label="Close"
            >
              <X size={17} />
            </button>

          </div>

        </header>


        {/* ==================================
            THOUGHT
        ================================== */}

        <div
          className="
            shrink-0
            border-b
            border-[#e8e2e9]
            bg-white
            px-5
            py-4

            dark:border-[#2c2731]
            dark:bg-[#1b191f]
          "
        >

          <p
            className="
              text-xs
              font-semibold
              text-[#413747]

              dark:text-[#eee7f2]
            "
          >
            @{thought.username}
          </p>


          <p
            className="
              mt-2
              break-words
              whitespace-pre-wrap
              text-sm
              leading-7
              text-[#4d4553]

              dark:text-[#d4cad8]
            "
          >
            {thought.content}
          </p>

        </div>


        {/* ==================================
            COMMENTS AREA
        ================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-4
            py-5

            sm:px-5
          "
        >

          {/* ERROR */}

          {error && (
            <div
              className="
                mb-4
                flex
                items-start
                gap-3
                rounded-[16px]
                border
                border-red-200
                bg-red-50
                px-3
                py-3

                dark:border-red-900/50
                dark:bg-red-950/20
              "
            >

              <p
                className="
                  min-w-0
                  flex-1
                  break-words
                  text-xs
                  leading-5
                  text-red-700

                  dark:text-red-400
                "
              >
                {error}
              </p>


              <button
                type="button"
                onClick={
                  clearError
                }
                className="
                  shrink-0
                  text-red-500
                "
                aria-label="Dismiss error"
              >
                <X size={14} />
              </button>

            </div>
          )}


          {/* LOADING */}

          {loading && (
            <div
              className="
                py-12
                text-center
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

                  dark:text-[#887d8e]
                "
              >
                Loading conversation...
              </p>

            </div>
          )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            rootComments.length ===
              0 && (
              <div
                className="
                  py-14
                  text-center
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
                    text-[#8d79a1]

                    dark:bg-[#292230]
                    dark:text-[#bdabca]
                  "
                >
                  <MessageCircle
                    size={21}
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
                  No replies yet
                </p>


                <p
                  className="
                    mt-1
                    text-xs
                    text-[#9d949f]

                    dark:text-[#898090]
                  "
                >
                  Start the conversation below.
                </p>

              </div>
            )}


          {/* COMMENTS */}

          {!loading &&
            rootComments.length >
              0 && (
              <div
                className="
                  space-y-6
                "
              >

                {rootComments.map(
                  (comment) => {
                    const replies =
                      getReplies(
                        comment.id
                      );

                    return (
                      <div
                        key={
                          comment.id
                        }
                        className="
                          space-y-4
                        "
                      >

                        <CommentItem
                          comment={
                            comment
                          }
                          onReply={
                            setReplyTo
                          }
                          onDeleted={
                            handleDeleted
                          }
                          onUpdated={
                            handleUpdated
                          }
                        />


                        {replies.length >
                          0 && (
                          <div
                            className="
                              ml-5
                              space-y-4
                              border-l-2
                              border-[#ebe4ee]
                              pl-4

                              dark:border-[#342d3a]
                            "
                          >

                            {replies.map(
                              (
                                reply
                              ) => (
                                <CommentItem
                                  key={
                                    reply.id
                                  }
                                  comment={
                                    reply
                                  }
                                  onReply={
                                    setReplyTo
                                  }
                                  onDeleted={
                                    handleDeleted
                                  }
                                  onUpdated={
                                    handleUpdated
                                  }
                                  isReply
                                />
                              )
                            )}

                          </div>
                        )}

                      </div>
                    );
                  }
                )}

              </div>
            )}

        </div>


        {/* ==================================
            COMMENT COMPOSER
        ================================== */}

        <div
          className="
            shrink-0
            border-t
            border-[#e8e2e9]
            bg-white
            p-4

            dark:border-[#2c2731]
            dark:bg-[#1b191f]
          "
        >

          {/* REPLYING TO */}

          {replyTo && (
            <div
              className="
                mb-3
                flex
                items-center
                justify-between
                gap-3
                rounded-[14px]
                bg-[#f5f0f7]
                px-3
                py-2.5

                dark:bg-[#28222d]
              "
            >

              <div
                className="
                  min-w-0
                "
              >

                <p
                  className="
                    text-[10px]
                    text-[#958b9b]

                    dark:text-[#887d8e]
                  "
                >
                  Replying to
                </p>


                <p
                  className="
                    mt-0.5
                    truncate
                    text-xs
                    font-semibold
                    text-[#423847]

                    dark:text-[#eee7f2]
                  "
                >
                  @{replyTo.username}
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setReplyTo(
                    null
                  )
                }
                className="
                  grid
                  h-7
                  w-7
                  shrink-0
                  place-items-center
                  rounded-full
                  text-[#8d8491]
                  hover:bg-white/70

                  dark:hover:bg-[#342d3a]
                "
                aria-label="Cancel reply"
              >
                <X size={14} />
              </button>

            </div>
          )}


          {/* INPUT */}

          <div
            className="
              flex
              items-end
              gap-2
            "
          >

            <textarea
              value={
                content
              }
              onChange={(
                event
              ) =>
                setContent(
                  event.target.value
                )
              }
              onKeyDown={(
                event
              ) => {
                if (
                  event.key ===
                    "Enter" &&
                  (event.ctrlKey ||
                    event.metaKey)
                ) {
                  event.preventDefault();

                  handleSubmit();
                }
              }}
              rows={2}
              maxLength={
                500
              }
              disabled={
                posting
              }
              placeholder={
                replyTo
                  ? `Reply to @${replyTo.username}...`
                  : "Join the conversation..."
              }
              className="
                min-w-0
                flex-1
                resize-none
                rounded-[18px]
                border
                border-[#e0d8e3]
                bg-[#faf8fb]
                p-3
                text-sm
                leading-6
                text-[#3e3544]
                outline-none
                transition

                placeholder:text-[#a39aa7]

                focus:border-[#8d7b98]
                focus:ring-2
                focus:ring-[#ece3ef]

                dark:border-[#39323e]
                dark:bg-[#151319]
                dark:text-[#eee7f2]
                dark:placeholder:text-[#7f7487]
              "
              aria-label="Write a comment"
            />


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
                grid
                h-11
                w-11
                shrink-0
                place-items-center
                rounded-full
                bg-[#302839]
                text-white
                transition
                hover:bg-[#43364d]
                disabled:cursor-not-allowed
                disabled:opacity-40

                dark:bg-[#eee8ff]
                dark:text-[#302839]
                dark:hover:bg-white
              "
              aria-label="Send comment"
            >

              {posting ? (
                <span
                  className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-current
                    border-r-transparent
                  "
                />
              ) : (
                <Send
                  size={16}
                />
              )}

            </button>

          </div>


          {/* FOOTER */}

          <div
            className="
              mt-2
              flex
              items-center
              justify-between
            "
          >

            <span
              className="
                text-[9px]
                text-[#9b919f]

                dark:text-[#817786]
              "
            >
              {content.length}/500
            </span>


            <span
              className="
                text-[9px]
                text-[#9b919f]

                dark:text-[#817786]
              "
            >
              Ctrl + Enter to send
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}


export default ConversationPanel;