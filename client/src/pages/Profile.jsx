import {
  Check,
  LogOut,
  Pencil,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import {
  getMyProfile,
  getMyThoughts,
  updateMyProfile,
} from "../services/userService";

import ThoughtCard from "../components/ThoughtCard";
import ChangePasswordModal from "../components/ChangePasswordModal";


function Profile() {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();


  // ========================================
  // PROFILE
  // ========================================

  const [profile, setProfile] =
    useState(null);


  // ========================================
  // THOUGHTS
  // ========================================

  const [thoughts, setThoughts] =
    useState([]);


  // ========================================
  // LOADING
  // ========================================

  const [loading, setLoading] =
    useState(true);


  // ========================================
  // EDIT BIO
  // ========================================

  const [editing, setEditing] =
    useState(false);

  const [bio, setBio] =
    useState("");

  const [saving, setSaving] =
    useState(false);


  // ========================================
  // CHANGE PASSWORD MODAL
  // ========================================

  const [
    changePasswordOpen,
    setChangePasswordOpen,
  ] = useState(false);


  // ========================================
  // MESSAGES
  // ========================================

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");


  // ========================================
  // LOAD PROFILE
  // ========================================

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        profileData,
        thoughtsData,
      ] = await Promise.all([
        getMyProfile(),
        getMyThoughts(),
      ]);

      setProfile(
        profileData.user
      );

      setBio(
        profileData.user.bio || ""
      );

      setThoughts(
        thoughtsData.thoughts || []
      );

    } catch (error) {
      console.error(
        "Profile loading error:",
        error
      );

      setError(
        error.message ||
          "Unable to load profile"
      );
    } finally {
      setLoading(false);
    }
  };


  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    loadProfile();
  }, []);


  // ========================================
  // SAVE BIO
  // ========================================

  const handleSaveBio = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const data =
        await updateMyProfile(
          bio
        );

      setProfile(
        data.user
      );

      setBio(
        data.user.bio || ""
      );

      setEditing(false);

      setMessage(
        "Your space has been updated."
      );

    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      setError(
        error.message ||
          "Unable to update your profile"
      );
    } finally {
      setSaving(false);
    }
  };


  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = async () => {
    try {
      await logout();

      navigate(
        "/login",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  };


  // ========================================
  // DELETE THOUGHT FROM UI
  // ========================================

  const handleThoughtDeleted = (
    id
  ) => {
    setThoughts((current) =>
      current.filter(
        (thought) =>
          thought.id !== id
      )
    );

    setProfile((current) =>
      current
        ? {
            ...current,
            thoughtCount:
              Math.max(
                0,
                current.thoughtCount - 1
              ),
          }
        : current
    );
  };


  // ========================================
  // UPDATE THOUGHT IN UI
  // ========================================

  const handleThoughtUpdated = (
    updatedThought
  ) => {
    setThoughts((current) =>
      current.map((thought) =>
        thought.id ===
        updatedThought.id
          ? updatedThought
          : thought
      )
    );
  };


  // ========================================
  // LOADING SCREEN
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <div className="flex items-center gap-3 text-sm text-[#968c9c]">

          <div
            className="
              h-5
              w-5
              animate-spin
              rounded-full
              border-2
              border-[#ded6e2]
              border-t-[#8d79a1]

              dark:border-[#39323e]
              dark:border-t-[#c7b3d2]
            "
          />

          Loading your space...

        </div>

      </div>
    );
  }


  // ========================================
  // ERROR SCREEN
  // ========================================

  if (error && !profile) {
    return (
      <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">

        <p>
          {error}
        </p>

        <button
          type="button"
          onClick={loadProfile}
          className="mt-3 font-semibold underline"
        >
          Try again
        </button>

      </div>
    );
  }


  // ========================================
  // USER DATA
  // ========================================

  const username =
    profile?.username ||
    user?.username ||
    "user";


  const joinedDate =
    profile?.createdAt
      ? new Date(
          profile.createdAt
        ).toLocaleDateString(
          "en-US",
          {
            month: "short",
            year: "numeric",
          }
        )
      : "Recently";


  return (
    <div className="space-y-6">

      {/* ======================================
          PROFILE HEADER
      ====================================== */}

      <section
        className="
          overflow-hidden
          rounded-[28px]
          border
          border-[#e8e0eb]
          bg-white

          dark:border-[#2e2834]
          dark:bg-[#1b191f]
        "
      >

        {/* Cover */}

        <div
          className="
            h-28
            bg-gradient-to-br
            from-[#eee7f5]
            via-[#f5eef8]
            to-[#e5daf0]

            dark:from-[#292230]
            dark:via-[#241f2a]
            dark:to-[#30253a]
          "
        />


        <div className="px-6 pb-7 sm:px-7">

          {/* User + Actions */}

          <div className="-mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            {/* ==================================
                USER
            ================================== */}

            <div className="flex items-end gap-4">

              <div
                className="
                  grid
                  h-20
                  w-20
                  shrink-0
                  place-items-center
                  rounded-full
                  border-4
                  border-white
                  bg-[#2c2633]
                  text-xl
                  font-bold
                  uppercase
                  text-white
                  shadow-sm

                  dark:border-[#1b191f]
                  dark:bg-[#eee8ff]
                  dark:text-[#2c2633]
                "
              >
                {username.charAt(0)}
              </div>


              <div className="pb-1">

                <h1 className="text-xl font-semibold tracking-tight">
                  {username}
                </h1>

                <p className="mt-0.5 text-sm text-[#978d9d]">
                  @{username}
                </p>

              </div>

            </div>


            {/* ==================================
                ACTIONS
            ================================== */}

            <div className="flex flex-wrap gap-2">

              {!editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(true);
                    setMessage("");
                    setError("");
                  }}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    border
                    border-[#ddd3e1]
                    px-4
                    py-2.5
                    text-xs
                    font-semibold
                    text-[#4b4251]
                    transition
                    hover:bg-[#f7f3f8]

                    dark:border-[#43394a]
                    dark:text-[#ddd3e5]
                    dark:hover:bg-[#251f2a]
                  "
                >
                  <Pencil size={14} />
                  Edit space
                </button>
              )}


              <button
                type="button"
                onClick={() =>
                  setChangePasswordOpen(
                    true
                  )
                }
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-[#ddd3e1]
                  px-4
                  py-2.5
                  text-xs
                  font-semibold
                  text-[#4b4251]
                  transition
                  hover:bg-[#f7f3f8]

                  dark:border-[#43394a]
                  dark:text-[#ddd3e5]
                  dark:hover:bg-[#251f2a]
                "
              >
                Change password
              </button>


              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-red-200
                  px-4
                  py-2.5
                  text-xs
                  font-semibold
                  text-red-500
                  transition
                  hover:bg-red-50

                  dark:border-red-900/50
                  dark:hover:bg-red-950/30
                "
              >
                <LogOut size={14} />
                Log out
              </button>

            </div>

          </div>


          {/* ==================================
              BIO / EDIT BIO
          ================================== */}

          {editing ? (

            <div className="mt-6 max-w-xl">

              <textarea
                value={bio}
                onChange={(event) =>
                  setBio(
                    event.target.value
                  )
                }
                maxLength={160}
                rows={3}
                autoFocus
                placeholder="Write something about yourself..."
                className="
                  w-full
                  resize-none
                  rounded-2xl
                  border
                  border-[#ddd4e2]
                  bg-[#faf8fb]
                  p-4
                  text-sm
                  leading-6
                  outline-none
                  transition
                  focus:border-[#8d7b98]

                  dark:border-[#39323e]
                  dark:bg-[#151319]
                  dark:text-white
                "
              />

              <div className="mt-2 flex items-center justify-between">

                <span className="text-[11px] text-[#9b919f]">
                  {bio.length}/160
                </span>


                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);

                      setBio(
                        profile?.bio || ""
                      );

                      setError("");
                    }}
                    className="
                      flex
                      items-center
                      gap-1.5
                      rounded-full
                      px-3
                      py-2
                      text-xs
                      text-[#746a79]
                      hover:bg-[#f4eff5]

                      dark:text-[#aaa1b0]
                      dark:hover:bg-[#28222d]
                    "
                  >
                    <X size={14} />
                    Cancel
                  </button>


                  <button
                    type="button"
                    onClick={
                      handleSaveBio
                    }
                    disabled={saving}
                    className="
                      flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-[#302839]
                      px-4
                      py-2
                      text-xs
                      font-semibold
                      text-white
                      transition
                      disabled:cursor-not-allowed
                      disabled:opacity-50

                      dark:bg-[#eee8ff]
                      dark:text-[#302839]
                    "
                  >
                    <Check size={14} />

                    {saving
                      ? "Saving..."
                      : "Save"}
                  </button>

                </div>

              </div>

            </div>

          ) : (

            <p className="mt-6 max-w-lg text-sm leading-6 text-[#605766] dark:text-[#c3b9c9]">
              {profile?.bio ||
                "No bio yet. Tell people a little about the person behind the thoughts."}
            </p>

          )}

        </div>

      </section>


      {/* ======================================
          SUCCESS MESSAGE
      ====================================== */}

      {message && (
        <div
          className="
            rounded-2xl
            border
            border-emerald-200
            bg-emerald-50
            px-4
            py-3
            text-xs
            text-emerald-700

            dark:border-emerald-900/50
            dark:bg-emerald-950/30
            dark:text-emerald-400
          "
        >
          {message}
        </div>
      )}


      {/* ======================================
          ERROR MESSAGE
      ====================================== */}

      {error && profile && (
        <div
          className="
            rounded-2xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-xs
            text-red-600

            dark:border-red-900/50
            dark:bg-red-950/30
            dark:text-red-400
          "
        >
          {error}
        </div>
      )}


      {/* ======================================
          ACCOUNT STATS
      ====================================== */}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

        {/* Thoughts */}

        <div
          className="
            rounded-[24px]
            border
            border-[#e8e0eb]
            bg-white
            p-5

            dark:border-[#2e2834]
            dark:bg-[#1b191f]
          "
        >

          <p className="text-xs text-[#9b919f]">
            Thoughts
          </p>

          <p className="mt-2 text-2xl font-semibold">
            {profile?.thoughtCount || 0}
          </p>

        </div>


        {/* Joined */}

        <div
          className="
            rounded-[24px]
            border
            border-[#e8e0eb]
            bg-white
            p-5

            dark:border-[#2e2834]
            dark:bg-[#1b191f]
          "
        >

          <p className="text-xs text-[#9b919f]">
            Joined
          </p>

          <p className="mt-2 text-lg font-semibold">
            {joinedDate}
          </p>

        </div>


        {/* Identity */}

        <div
          className="
            rounded-[24px]
            border
            border-[#e8e0eb]
            bg-white
            p-5

            dark:border-[#2e2834]
            dark:bg-[#1b191f]
          "
        >

          <p className="text-xs text-[#9b919f]">
            Identity
          </p>

          <div className="mt-2 flex items-center gap-2">

            <ShieldCheck
              size={16}
              className="text-[#8d79a1]"
            />

            <span className="text-sm font-semibold">
              Pseudonymous
            </span>

          </div>

        </div>


        {/* Password */}

        <div
          className="
            rounded-[24px]
            border
            border-[#e8e0eb]
            bg-white
            p-5

            dark:border-[#2e2834]
            dark:bg-[#1b191f]
          "
        >

          <p className="text-xs text-[#9b919f]">
            Password
          </p>

          <div className="mt-2 flex items-center justify-between gap-3">

            <span className="text-sm font-semibold tracking-wider">
              ••••••••
            </span>

            <button
              type="button"
              onClick={() =>
                setChangePasswordOpen(
                  true
                )
              }
              className="
                text-xs
                font-semibold
                text-[#7d6c89]
                hover:underline

                dark:text-[#c8b8d2]
              "
            >
              Change
            </button>

          </div>

        </div>

      </section>


      {/* ======================================
          PRIVACY
      ====================================== */}

      <section
        className="
          rounded-[28px]
          border
          border-[#e8e0eb]
          bg-[#faf7fc]
          p-6

          dark:border-[#2e2834]
          dark:bg-[#19171d]
        "
      >

        <div className="flex items-center gap-2">

          <div
            className="
              grid
              h-8
              w-8
              place-items-center
              rounded-full
              bg-[#eee6f4]
              text-[#8d79a1]

              dark:bg-[#2a2330]
              dark:text-[#c6b4d1]
            "
          >
            <ShieldCheck size={16} />
          </div>

          <div>

            <span className="text-sm font-semibold text-[#6f617b] dark:text-[#bcafc5]">
              Identity kept minimal
            </span>

            <p className="mt-0.5 text-[11px] text-[#a39aa7]">
              Your account only needs a username.
            </p>

          </div>

        </div>

        <p className="mt-4 max-w-xl text-sm leading-6 text-[#928895]">
          Your space is built around what
          you say, not who you are offline.
          Unsaid doesn't require your real
          name, phone number, or public
          profile information.
        </p>

      </section>


      {/* ======================================
          MY THOUGHTS
      ====================================== */}

      <section>

        <div className="mb-4">

          <p className="text-sm font-semibold">
            Your thoughts
          </p>

          <p className="mt-1 text-xs text-[#a097a5]">
            Everything you've said here.
          </p>

        </div>


        {thoughts.length === 0 ? (

          <div
            className="
              rounded-[24px]
              border
              border-dashed
              border-[#ddd4e2]
              p-10
              text-center

              dark:border-[#39323e]
            "
          >

            <p className="text-sm font-medium">
              You haven't said anything yet.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              className="
                mt-3
                text-xs
                font-semibold
                text-[#7b6b86]
                underline
              "
            >
              Say something
            </button>

          </div>

        ) : (

          <div className="space-y-3">

            {thoughts.map(
              (thought) => (
                <ThoughtCard
                  key={thought.id}
                  thought={thought}
                  onDeleted={
                    handleThoughtDeleted
                  }
                  onUpdated={
                    handleThoughtUpdated
                  }
                />
              )
            )}

          </div>

        )}

      </section>


      {/* ======================================
          CHANGE PASSWORD MODAL
      ====================================== */}

      {changePasswordOpen && (
        <ChangePasswordModal
          onClose={() =>
            setChangePasswordOpen(
              false
            )
          }
        />
      )}

    </div>
  );
}

export default Profile;