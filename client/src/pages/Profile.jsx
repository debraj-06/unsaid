import {
  Check,
  ChevronRight,
  LogOut,
  Pencil,
  ShieldCheck,
  UserPlus,
  Users,
  UserRound,
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
  getMyFollowers,
  getMyFollowing,
  getMyProfile,
  getMyThoughts,
  toggleFollow,
  updateMyProfile,
} from "../services/userService";

import ThoughtCard from "../components/ThoughtCard";
import ChangePasswordModal from "../components/ChangePasswordModal";


function Profile() {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();


  // ==========================================
  // PROFILE
  // ==========================================

  const [
    profile,
    setProfile,
  ] = useState(null);


  // ==========================================
  // THOUGHTS
  // ==========================================

  const [
    thoughts,
    setThoughts,
  ] = useState([]);


  // ==========================================
  // FOLLOWERS
  // ==========================================

  const [
    followers,
    setFollowers,
  ] = useState([]);


  // ==========================================
  // FOLLOWING
  // ==========================================

  const [
    following,
    setFollowing,
  ] = useState([]);


  // ==========================================
  // FOLLOW LIST MODAL
  // ==========================================

  const [
    peopleModal,
    setPeopleModal,
  ] = useState(null);


  const [
    peopleLoading,
    setPeopleLoading,
  ] = useState(false);


  const [
    followActionId,
    setFollowActionId,
  ] = useState(null);


  // ==========================================
  // LOADING
  // ==========================================

  const [
    loading,
    setLoading,
  ] = useState(true);


  // ==========================================
  // EDIT BIO
  // ==========================================

  const [
    editing,
    setEditing,
  ] = useState(false);


  const [
    bio,
    setBio,
  ] = useState("");


  const [
    saving,
    setSaving,
  ] = useState(false);


  // ==========================================
  // PASSWORD
  // ==========================================

  const [
    changePasswordOpen,
    setChangePasswordOpen,
  ] = useState(false);


  // ==========================================
  // MESSAGES
  // ==========================================

  const [
    error,
    setError,
  ] = useState("");


  const [
    message,
    setMessage,
  ] = useState("");


  // ==========================================
  // LOAD PROFILE DATA
  // ==========================================

  const loadProfile =
    async () => {
      try {
        setLoading(true);
        setError("");

        const [
          profileData,
          thoughtsData,
          followersData,
          followingData,
        ] = await Promise.all([
          getMyProfile(),
          getMyThoughts(),
          getMyFollowers(),
          getMyFollowing(),
        ]);


        setProfile(
          profileData.user
        );


        setBio(
          profileData.user.bio ||
            ""
        );


        setThoughts(
          thoughtsData.thoughts ||
            []
        );


        setFollowers(
          followersData.people ||
            []
        );


        setFollowing(
          followingData.people ||
            []
        );
      } catch (error) {
        console.error(
          "Profile loading error:",
          error
        );


        setError(
          error.message ||
            "Unable to load your space"
        );
      } finally {
        setLoading(false);
      }
    };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadProfile();
  }, []);


  // ==========================================
  // SAVE BIO
  // ==========================================

  const handleSaveBio =
    async () => {
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
          data.user.bio ||
            ""
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


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout =
    async () => {
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


  // ==========================================
  // DELETE THOUGHT FROM UI
  // ==========================================

  const handleThoughtDeleted =
    (id) => {
      setThoughts(
        (current) =>
          current.filter(
            (thought) =>
              thought.id !== id
          )
      );


      setProfile(
        (current) =>
          current
            ? {
                ...current,

                thoughtCount:
                  Math.max(
                    0,
                    Number(
                      current.thoughtCount ||
                        0
                    ) - 1
                  ),
              }
            : current
      );
    };


  // ==========================================
  // UPDATE THOUGHT IN UI
  // ==========================================

  const handleThoughtUpdated =
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
    };


  // ==========================================
  // OPEN PEOPLE MODAL
  // ==========================================

  const openPeopleModal =
    (type) => {
      setPeopleModal(
        type
      );
    };


  // ==========================================
  // CLOSE PEOPLE MODAL
  // ==========================================

  const closePeopleModal =
    () => {
      setPeopleModal(
        null
      );
    };


  // ==========================================
  // FOLLOW / UNFOLLOW PERSON
  // ==========================================

  const handlePersonFollow =
    async (person) => {
      const personId =
        person.id;


      if (
        !person.username ||
        followActionId === personId
      ) {
        return;
      }


      try {
        setFollowActionId(
          personId
        );


        const data =
          await toggleFollow(
            person.username
          );


        const nextFollowing =
          Boolean(
            data.following
          );


        const nextFollowersCount =
          Number(
            data.followersCount ??
              person.followersCount ??
              0
          );


        // --------------------------------------
        // UPDATE FOLLOWERS LIST
        // --------------------------------------

        setFollowers(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                personId
                  ? {
                      ...item,

                      isFollowing:
                        nextFollowing,

                      followersCount:
                        nextFollowersCount,
                    }
                  : item
            )
        );


        // --------------------------------------
        // UPDATE FOLLOWING LIST
        // --------------------------------------

        setFollowing(
          (current) => {
            if (nextFollowing) {
              const exists =
                current.some(
                  (item) =>
                    item.id ===
                    personId
                );


              if (exists) {
                return current.map(
                  (item) =>
                    item.id ===
                    personId
                      ? {
                          ...item,

                          isFollowing:
                            true,

                          followersCount:
                            nextFollowersCount,
                        }
                      : item
                );
              }


              return [
                ...current,

                {
                  ...person,

                  isFollowing:
                    true,

                  followersCount:
                    nextFollowersCount,
                },
              ];
            }


            return current.filter(
              (item) =>
                item.id !==
                personId
            );
          }
        );


        // --------------------------------------
        // UPDATE COUNTS ON MY PROFILE
        // --------------------------------------

        setProfile(
          (current) =>
            current
              ? {
                  ...current,

                  followingCount:
                    Number(
                      data.followingCount ??
                        current.followingCount ??
                        0
                    ),
                }
              : current
        );


        // --------------------------------------
        // REFRESH LIST COUNTS
        // --------------------------------------

        if (
          peopleModal ===
          "following"
        ) {
          setFollowers(
            (current) =>
              current.map(
                (item) =>
                  item.id ===
                  personId
                    ? {
                        ...item,

                        isFollowing:
                          nextFollowing,

                        followersCount:
                          nextFollowersCount,
                      }
                    : item
              )
          );
        }
      } catch (error) {
        console.error(
          "Follow/unfollow error:",
          error
        );


        setError(
          error.message ||
            "Unable to update follow"
        );
      } finally {
        setFollowActionId(
          null
        );
      }
    };


  // ==========================================
  // GET DISPLAYED PEOPLE
  // ==========================================

  const displayedPeople =
    peopleModal ===
    "following"
      ? following
      : followers;


  // ==========================================
  // MODAL TITLE
  // ==========================================

  const peopleModalTitle =
    peopleModal ===
    "following"
      ? "Following"
      : "Followers";


  // ==========================================
  // FOLLOW BUTTON LABEL
  // ==========================================

  const getFollowLabel =
    (person) => {
      if (
        person.isFollowing
      ) {
        return "Following";
      }


      if (
        person.followsMe
      ) {
        return "Follow back";
      }


      return "Follow";
    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-[400px]
          items-center
          justify-center
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
            text-sm
            text-[#968c9c]
          "
        >

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


  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (
    error &&
    !profile
  ) {
    return (
      <div
        className="
          rounded-[24px]
          border
          border-red-200
          bg-red-50
          p-6
          text-sm
          text-red-600

          dark:border-red-900/50
          dark:bg-red-950/30
          dark:text-red-400
        "
      >

        <p>
          {error}
        </p>


        <button
          type="button"
          onClick={
            loadProfile
          }
          className="
            mt-3
            font-semibold
            underline
          "
        >
          Try again
        </button>

      </div>
    );
  }


  // ==========================================
  // USER DATA
  // ==========================================

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
            month:
              "short",
            year:
              "numeric",
          }
        )
      : "Recently";


  const followersCount =
    Number(
      profile?.followersCount ||
        followers.length ||
        0
    );


  const followingCount =
    Number(
      profile?.followingCount ||
        following.length ||
        0
    );


  return (
    <>
      <div
        className="
          space-y-6
        "
      >

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


          <div
            className="
              px-6
              pb-7

              sm:px-7
            "
          >

            <div
              className="
                -mt-10
                flex
                flex-col
                gap-5

                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >

              <div
                className="
                  flex
                  items-end
                  gap-4
                "
              >

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
                  {username.charAt(
                    0
                  )}
                </div>


                <div
                  className="
                    pb-1
                  "
                >

                  <h1
                    className="
                      text-xl
                      font-semibold
                      tracking-tight
                    "
                  >
                    {username}
                  </h1>


                  <p
                    className="
                      mt-0.5
                      text-sm
                      text-[#978d9d]
                    "
                  >
                    @{username}
                  </p>

                </div>

              </div>


              <div
                className="
                  flex
                  flex-wrap
                  gap-2
                "
              >

                {!editing && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(
                        true
                      );

                      setMessage(
                        ""
                      );

                      setError(
                        ""
                      );
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

                    <Pencil
                      size={14}
                    />

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
                  onClick={
                    handleLogout
                  }
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

                  <LogOut
                    size={14}
                  />

                  Log out

                </button>

              </div>

            </div>


            {/* ==================================
                BIO
            ================================== */}

            {editing ? (
              <div
                className="
                  mt-6
                  max-w-xl
                "
              >

                <textarea
                  value={bio}
                  onChange={(
                    event
                  ) =>
                    setBio(
                      event.target
                        .value
                    )
                  }
                  maxLength={
                    160
                  }
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
                      text-[11px]
                      text-[#9b919f]
                    "
                  >
                    {bio.length}/160
                  </span>


                  <div
                    className="
                      flex
                      gap-2
                    "
                  >

                    <button
                      type="button"
                      onClick={() => {
                        setEditing(
                          false
                        );

                        setBio(
                          profile?.bio ||
                            ""
                        );

                        setError(
                          ""
                        );
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

                      <X
                        size={14}
                      />

                      Cancel

                    </button>


                    <button
                      type="button"
                      onClick={
                        handleSaveBio
                      }
                      disabled={
                        saving
                      }
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

                      <Check
                        size={14}
                      />

                      {saving
                        ? "Saving..."
                        : "Save"}

                    </button>

                  </div>

                </div>

              </div>
            ) : (
              <p
                className="
                  mt-6
                  max-w-lg
                  text-sm
                  leading-6
                  text-[#605766]

                  dark:text-[#c3b9c9]
                "
              >
                {profile?.bio ||
                  "No bio yet. Tell people a little about the person behind the thoughts."}
              </p>
            )}

          </div>

        </section>


        {/* ======================================
            MESSAGES
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

        <section
          className="
            grid
            gap-3
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >

          {/* THOUGHTS */}

          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: document.body
                  .scrollHeight,
                behavior:
                  "smooth",
              })
            }
            className="
              rounded-[24px]
              border
              border-[#e8e0eb]
              bg-white
              p-5
              text-left
              transition
              hover:border-[#d9cde0]
              hover:bg-[#fcfafc]

              dark:border-[#2e2834]
              dark:bg-[#1b191f]
              dark:hover:border-[#403547]
            "
          >

            <p
              className="
                text-xs
                text-[#9b919f]
              "
            >
              Thoughts
            </p>


            <p
              className="
                mt-2
                text-2xl
                font-semibold
              "
            >
              {profile?.thoughtCount ||
                0}
            </p>

          </button>


          {/* FOLLOWERS */}

          <button
            type="button"
            onClick={() =>
              openPeopleModal(
                "followers"
              )
            }
            className="
              rounded-[24px]
              border
              border-[#e8e0eb]
              bg-white
              p-5
              text-left
              transition
              hover:border-[#d9cde0]
              hover:bg-[#fcfafc]

              dark:border-[#2e2834]
              dark:bg-[#1b191f]
              dark:hover:border-[#403547]
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

              <p
                className="
                  text-xs
                  text-[#9b919f]
                "
              >
                Followers
              </p>


              <Users
                size={15}
                className="
                  text-[#8d79a1]
                "
              />

            </div>


            <p
              className="
                mt-2
                text-2xl
                font-semibold
              "
            >
              {followersCount}
            </p>


            <p
              className="
                mt-1
                text-[10px]
                text-[#a39aa7]
              "
            >
              People following you
            </p>

          </button>


          {/* FOLLOWING */}

          <button
            type="button"
            onClick={() =>
              openPeopleModal(
                "following"
              )
            }
            className="
              rounded-[24px]
              border
              border-[#e8e0eb]
              bg-white
              p-5
              text-left
              transition
              hover:border-[#d9cde0]
              hover:bg-[#fcfafc]

              dark:border-[#2e2834]
              dark:bg-[#1b191f]
              dark:hover:border-[#403547]
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

              <p
                className="
                  text-xs
                  text-[#9b919f]
                "
              >
                Following
              </p>


              <UserRound
                size={15}
                className="
                  text-[#8d79a1]
                "
              />

            </div>


            <p
              className="
                mt-2
                text-2xl
                font-semibold
              "
            >
              {followingCount}
            </p>


            <p
              className="
                mt-1
                text-[10px]
                text-[#a39aa7]
              "
            >
              People you follow
            </p>

          </button>


          {/* JOINED */}

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

            <p
              className="
                text-xs
                text-[#9b919f]
              "
            >
              Joined
            </p>


            <p
              className="
                mt-2
                text-lg
                font-semibold
              "
            >
              {joinedDate}
            </p>

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
                place-items-center
                rounded-full
                bg-[#eee6f4]
                text-[#8d79a1]

                dark:bg-[#2a2330]
                dark:text-[#c6b4d1]
              "
            >

              <ShieldCheck
                size={16}
              />

            </div>


            <div>

              <span
                className="
                  text-sm
                  font-semibold
                  text-[#6f617b]

                  dark:text-[#bcafc5]
                "
              >
                Identity kept minimal
              </span>


              <p
                className="
                  mt-0.5
                  text-[11px]
                  text-[#a39aa7]
                "
              >
                Your account only needs a username.
              </p>

            </div>

          </div>


          <p
            className="
              mt-4
              max-w-xl
              text-sm
              leading-6
              text-[#928895]
            "
          >
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

          <div
            className="
              mb-4
            "
          >

            <p
              className="
                text-sm
                font-semibold
              "
            >
              Your thoughts
            </p>


            <p
              className="
                mt-1
                text-xs
                text-[#a097a5]
              "
            >
              Everything you've said here.
            </p>

          </div>


          {thoughts.length ===
          0 ? (
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

              <p
                className="
                  text-sm
                  font-medium
                "
              >
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
            <div
              className="
                space-y-3
              "
            >

              {thoughts.map(
                (thought) => (
                  <ThoughtCard
                    key={
                      thought.id
                    }
                    thought={
                      thought
                    }
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

      </div>


      {/* ========================================
          FOLLOWERS / FOLLOWING MODAL
      ======================================== */}

      {peopleModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-end
            justify-center
            bg-black/40
            p-0
            backdrop-blur-sm

            sm:items-center
            sm:p-5
          "
          onClick={
            closePeopleModal
          }
        >

          <div
            className="
              flex
              max-h-[82vh]
              w-full
              flex-col
              overflow-hidden
              rounded-t-[28px]
              border
              border-[#e4dde7]
              bg-white
              shadow-2xl

              dark:border-[#39323f]
              dark:bg-[#1b191f]

              sm:max-w-[520px]
              sm:rounded-[28px]
            "
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-[#eee8f0]
                px-5
                py-4

                dark:border-[#2c2731]
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    grid
                    h-9
                    w-9
                    place-items-center
                    rounded-full
                    bg-[#eee7f4]
                    text-[#806d8f]

                    dark:bg-[#2a2330]
                    dark:text-[#c7b5d2]
                  "
                >
                  <Users
                    size={16}
                  />
                </div>


                <div>

                  <h2
                    className="
                      text-sm
                      font-semibold
                      text-[#3a3140]

                      dark:text-[#eee7f2]
                    "
                  >
                    {peopleModalTitle}
                  </h2>


                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      text-[#9b919f]
                    "
                  >
                    {displayedPeople.length}{" "}
                    {displayedPeople.length ===
                    1
                      ? "person"
                      : "people"}
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={
                  closePeopleModal
                }
                className="
                  grid
                  h-9
                  w-9
                  place-items-center
                  rounded-full
                  text-[#8c8290]
                  hover:bg-[#f2edf4]

                  dark:hover:bg-[#29232f]
                "
                aria-label="Close"
              >
                <X size={17} />
              </button>

            </div>


            {/* MODAL CONTENT */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                p-4
              "
            >

              {displayedPeople.length ===
              0 ? (
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
                      text-[#806d8f]

                      dark:bg-[#292230]
                      dark:text-[#bdabca]
                    "
                  >
                    <Users
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
                    {peopleModal ===
                    "following"
                      ? "You're not following anyone yet."
                      : "You don't have any followers yet."}
                  </p>

                </div>
              ) : (
                <div
                  className="
                    space-y-2
                  "
                >

                  {displayedPeople.map(
                    (person) => {
                      const personId =
                        person.id;

                      const loadingThisPerson =
                        followActionId ===
                        personId;


                      return (
                        <div
                          key={
                            personId
                          }
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-[18px]
                            border
                            border-[#eee8f0]
                            bg-[#fcfafc]
                            p-3

                            dark:border-[#302a35]
                            dark:bg-[#211d25]
                          "
                        >

                          {/* AVATAR */}

                          <button
                            type="button"
                            onClick={() => {
                              closePeopleModal();

                              navigate(
                                `/user/${person.username}`
                              );
                            }}
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
                            {person.username?.charAt(
                              0
                            ) || "U"}
                          </button>


                          {/* USER */}

                          <button
                            type="button"
                            onClick={() => {
                              closePeopleModal();

                              navigate(
                                `/user/${person.username}`
                              );
                            }}
                            className="
                              min-w-0
                              flex-1
                              text-left
                            "
                          >

                            <p
                              className="
                                truncate
                                text-xs
                                font-semibold
                                text-[#403647]

                                dark:text-[#eee7f2]
                              "
                            >
                              @{person.username}
                            </p>


                            <p
                              className="
                                mt-1
                                text-[10px]
                                text-[#988e9e]

                                dark:text-[#897f90]
                              "
                            >
                              {Number(
                                person.followersCount ||
                                  0
                              )}{" "}
                              {Number(
                                person.followersCount ||
                                  0
                              ) ===
                              1
                                ? "follower"
                                : "followers"}
                            </p>

                          </button>


                          {/* FOLLOW STATE */}

                          <button
                            type="button"
                            onClick={() =>
                              handlePersonFollow(
                                person
                              )
                            }
                            disabled={
                              loadingThisPerson
                            }
                            className={`
                              inline-flex
                              shrink-0
                              items-center
                              gap-1.5
                              rounded-full
                              px-3
                              py-2
                              text-[10px]
                              font-semibold
                              transition
                              disabled:opacity-50

                              ${
                                person.isFollowing
                                  ? `
                                    border
                                    border-[#ddd4e2]
                                    bg-white
                                    text-[#6f6378]
                                    hover:bg-[#f6f1f7]

                                    dark:border-[#423849]
                                    dark:bg-[#211d25]
                                    dark:text-[#c8bdcf]
                                    dark:hover:bg-[#2b2530]
                                  `
                                  : `
                                    bg-[#302839]
                                    text-white
                                    hover:bg-[#43364d]

                                    dark:bg-[#eee8ff]
                                    dark:text-[#302839]
                                    dark:hover:bg-white
                                  `
                              }
                            `}
                          >

                            {loadingThisPerson ? (
                              <span
                                className="
                                  h-3
                                  w-3
                                  animate-spin
                                  rounded-full
                                  border-2
                                  border-current
                                  border-r-transparent
                                "
                              />
                            ) : person.isFollowing ? (
                              <Check
                                size={12}
                              />
                            ) : (
                              <UserPlus
                                size={12}
                              />
                            )}


                            {loadingThisPerson
                              ? "..."
                              : getFollowLabel(
                                  person
                                )}

                          </button>


                          {/* OPEN PROFILE */}

                          <button
                            type="button"
                            onClick={() => {
                              closePeopleModal();

                              navigate(
                                `/user/${person.username}`
                              );
                            }}
                            className="
                              hidden
                              h-8
                              w-8
                              shrink-0
                              place-items-center
                              rounded-full
                              text-[#938996]
                              hover:bg-[#f1edf3]

                              dark:hover:bg-[#2a2430]

                              sm:grid
                            "
                            aria-label={`Open @${person.username}`}
                          >
                            <ChevronRight
                              size={15}
                            />
                          </button>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>

          </div>

        </div>
      )}


      {/* ========================================
          CHANGE PASSWORD MODAL
      ======================================== */}

      {changePasswordOpen && (
        <ChangePasswordModal
          onClose={() =>
            setChangePasswordOpen(
              false
            )
          }
        />
      )}

    </>
  );
}


export default Profile;