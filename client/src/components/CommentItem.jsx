import {
  Check,
  Heart,
  MoreHorizontal,
  Pencil,
  Reply,
  Trash2,
  X,
} from "lucide-react";

import { useState } from "react";

import {
  deleteComment,
  toggleCommentLike,
  updateComment,
} from "../services/commentService";

import { useAuth } from "../context/AuthContext";


function formatCommentTime(date) {
  const diff =
    Date.now() -
    new Date(date).getTime();

  const minutes = Math.floor(
    diff / 60000
  );

  if (minutes < 1) {
    return "just now";
  }

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours}h`;
  }

  const days = Math.floor(
    hours / 24
  );

  return `${days}d`;
}


function CommentItem({
  comment,
  onReply,
  onDeleted,
  onUpdated,
  isReply = false,
}) {
  const { user } = useAuth();

  const isOwner =
    user?.username ===
    comment.username;


  // ========================================
  // LIKE STATE
  // ========================================

  const [liked, setLiked] =
    useState(
      comment.likedByMe || false
    );

  const [likes, setLikes] =
    useState(
      comment.likesCount || 0
    );

  const [likeLoading, setLikeLoading] =
    useState(false);


  // ========================================
  // MENU
  // ========================================

  const [menuOpen, setMenuOpen] =
    useState(false);


  // ========================================
  // EDIT
  // ========================================

  const [editing, setEditing] =
    useState(false);

  const [content, setContent] =
    useState(comment.content);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ========================================
  // LIKE
  // ========================================

  const handleLike = async () => {
    if (likeLoading) {
      return;
    }

    try {
      setLikeLoading(true);
      setError("");

      const data =
        await toggleCommentLike(
          comment.id
        );

      setLiked(data.liked);
      setLikes(data.likesCount);
    } catch (error) {
      setError(error.message);
    } finally {
      setLikeLoading(false);
    }
  };


  // ========================================
  // UPDATE
  // ========================================

  const handleUpdate = async () => {
    if (!content.trim()) {
      return;
    }

    try {
      setError("");
      setLoading(true);

      const data =
        await updateComment(
          comment.id,
          content
        );

      setEditing(false);
      setMenuOpen(false);

      onUpdated(data.comment);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  // ========================================
  // DELETE
  // ========================================

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        "Delete this comment?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setLoading(true);

      await deleteComment(
        comment.id
      );

      onDeleted(comment.id);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className={
        isReply
          ? "ml-8"
          : ""
      }
    >

      <div className="flex gap-3">

        {/* Avatar */}

        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#eee8f4] text-xs font-bold uppercase text-[#75677e] dark:bg-[#2b2430] dark:text-[#cabbca]">
          {comment.username.charAt(0)}
        </div>


        <div className="min-w-0 flex-1">

          {/* Header */}

          <div className="flex items-start justify-between">

            <div>

              <div className="flex items-center gap-2">

                <span className="text-xs font-semibold">
                  {comment.username}
                </span>

                <span className="text-[10px] text-[#aaa1ad]">
                  {formatCommentTime(
                    comment.createdAt
                  )}
                </span>

                {comment.updatedAt !==
                  comment.createdAt && (
                  <span className="text-[10px] text-[#aaa1ad]">
                    edited
                  </span>
                )}

              </div>

            </div>


            {/* Owner menu */}

            {isOwner && (
              <div className="relative">

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
                    h-7
                    w-7
                    place-items-center
                    rounded-full
                    text-[#aaa1ad]
                    hover:bg-[#f5f1f6]

                    dark:hover:bg-[#28222d]
                  "
                >
                  <MoreHorizontal
                    size={15}
                  />
                </button>


                {menuOpen && (
                  <div className="
                    absolute
                    right-0
                    top-8
                    z-30
                    w-36
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#e7e0e9]
                    bg-white
                    p-1
                    shadow-lg

                    dark:border-[#39313e]
                    dark:bg-[#211d25]
                  ">

                    <button
                      type="button"
                      onClick={() => {
                        setEditing(true);
                        setMenuOpen(false);
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-2
                        rounded-lg
                        px-3
                        py-2
                        text-xs

                        hover:bg-[#f6f2f7]
                        dark:hover:bg-[#2a2430]
                      "
                    >
                      <Pencil size={13} />
                      Edit
                    </button>


                    <button
                      type="button"
                      onClick={
                        handleDelete
                      }
                      disabled={loading}
                      className="
                        flex
                        w-full
                        items-center
                        gap-2
                        rounded-lg
                        px-3
                        py-2
                        text-xs
                        text-red-500

                        hover:bg-red-50
                        dark:hover:bg-red-950/30
                      "
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>

                  </div>
                )}

              </div>
            )}

          </div>


          {/* Error */}

          {error && (
            <p className="mt-2 text-xs text-red-500">
              {error}
            </p>
          )}


          {/* ==================================
              EDIT MODE
          ================================== */}

          {editing ? (

            <div className="mt-2">

              <textarea
                value={content}
                onChange={(event) =>
                  setContent(
                    event.target.value
                  )
                }
                maxLength={500}
                rows={3}
                autoFocus
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-[#ddd4e2]
                  bg-[#faf8fb]
                  p-3
                  text-sm
                  outline-none

                  dark:border-[#3a3341]
                  dark:bg-[#151319]
                  dark:text-white
                "
              />

              <div className="mt-2 flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setContent(
                      comment.content
                    );
                  }}
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-full
                    px-3
                    py-1.5
                    text-xs
                    text-[#817888]
                    hover:bg-[#f4eff5]

                    dark:hover:bg-[#28222d]
                  "
                >
                  <X size={13} />
                  Cancel
                </button>


                <button
                  type="button"
                  onClick={
                    handleUpdate
                  }
                  disabled={
                    loading ||
                    !content.trim()
                  }
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-full
                    bg-[#302839]
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-white
                    disabled:opacity-50

                    dark:bg-[#eee8ff]
                    dark:text-[#302839]
                  "
                >
                  <Check size={13} />
                  Save
                </button>

              </div>

            </div>

          ) : (

            <>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#57505d] dark:text-[#c9c0cf]">
                {comment.content}
              </p>


              {/* ==============================
                  COMMENT ACTIONS
              ============================== */}

              <div className="mt-2 flex items-center gap-4">

                {/* Like */}

                <button
                  type="button"
                  onClick={
                    handleLike
                  }
                  disabled={likeLoading}
                  className={`
                    flex
                    items-center
                    gap-1
                    text-[11px]
                    transition

                    ${
                      liked
                        ? "text-rose-500"
                        : "text-[#968c9c] hover:text-rose-500"
                    }
                  `}
                >
                  <Heart
                    size={14}
                    fill={
                      liked
                        ? "currentColor"
                        : "none"
                    }
                  />

                  {likes}
                </button>


                {/* Reply */}

                <button
                  type="button"
                  onClick={() =>
                    onReply(comment)
                  }
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-[11px]
                    font-medium
                    text-[#968c9c]
                    hover:text-[#4d4055]

                    dark:hover:text-white
                  "
                >
                  <Reply size={13} />
                  Reply
                </button>

              </div>
            </>

          )}

        </div>

      </div>

    </div>
  );
}

export default CommentItem;