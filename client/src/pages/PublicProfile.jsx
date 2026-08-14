import {
  ArrowLeft,
  CalendarDays,
  Check,
  LoaderCircle,
  MessageSquareText,
  UserPlus,
  Users,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getPublicProfile,
  toggleFollow,
} from "../services/userService";

import ThoughtCard from "../components/ThoughtCard";

import {
  useAuth,
} from "../context/AuthContext";


function PublicProfile() {
  const {
    username,
  } = useParams();

  const navigate =
    useNavigate();

  const {
    user: currentUser,
  } = useAuth();


  // ==========================================
  // STATE
  // ==========================================

  const [
    profile,
    setProfile,
  ] = useState(null);


  const [
    thoughts,
    setThoughts,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    followLoading,
    setFollowLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  // ==========================================
  // LOAD PROFILE
  // ==========================================

  const loadProfile =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getPublicProfile(
            username
          );


        setProfile(
          data.user
        );


        setThoughts(
          Array.isArray(
            data.thoughts
          )
            ? data.thoughts
            : []
        );
      } catch (error) {
        console.error(
          "Public profile error:",
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


  useEffect(() => {
    loadProfile();
  }, [
    username,
  ]);


  // ==========================================
  // FOLLOW
  // ==========================================

  const handleFollow =
    async () => {
      if (
        !profile ||
        followLoading
      ) {
        return;
      }


      try {
        setFollowLoading(
          true
        );


        const data =
          await toggleFollow(
            profile.username
          );


        setProfile(
          (current) => ({
            ...current,

            isFollowing:
              Boolean(
                data.following
              ),

            followersCount:
              Number(
                data.followersCount ||
                  0
              ),
          })
        );
      } catch (error) {
        console.error(
          "Follow error:",
          error
        );


        setError(
          error.message ||
            "Unable to update follow"
        );
      } finally {
        setFollowLoading(
          false
        );
      }
    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div
        className="
          grid
          min-h-[60vh]
          place-items-center
        "
      >

        <div className="text-center">

          <LoaderCircle
            size={28}
            className="
              mx-auto
              animate-spin
              text-[#806d8f]
            "
          />

          <p
            className="
              mt-3
              text-xs
              text-[#968c9c]

              dark:text-[#8b8091]
            "
          >
            Loading profile...
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error && !profile) {
    return (
      <div
        className="
          mx-auto
          max-w-[700px]
          py-10
        "
      >

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="
            mb-5
            inline-flex
            items-center
            gap-2
            text-xs
            font-semibold
            text-[#766b7d]

            dark:text-[#afa3b5]
          "
        >
          <ArrowLeft
            size={15}
          />

          Back
        </button>


        <div
          className="
            rounded-[26px]
            border
            border-red-200
            bg-red-50
            p-6
            text-center
            text-sm
            text-red-700

            dark:border-red-900/50
            dark:bg-red-950/20
            dark:text-red-400
          "
        >
          {error}
        </div>

      </div>
    );
  }


  if (!profile) {
    return null;
  }


  // ==========================================
  // IS OWN PROFILE
  // ==========================================

  const isOwnProfile =
    currentUser?.username?.toLowerCase() ===
    profile.username?.toLowerCase();


  // ==========================================
  // BUTTON STATE
  // ==========================================

  let followLabel =
    "Follow";


  if (
    profile.isFollowing
  ) {
    followLabel =
      "Following";
  } else if (
    profile.followsMe
  ) {
    followLabel =
      "Follow back";
  }


  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[900px]
        space-y-5
      "
    >

      {/* ======================================
          TOP
      ====================================== */}

      <button
        type="button"
        onClick={() =>
          navigate(-1)
        }
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          px-2
          py-2
          text-xs
          font-semibold
          text-[#776c7e]
          hover:bg-[#f1edf3]

          dark:text-[#afa3b5]
          dark:hover:bg-[#29232f]
        "
      >

        <ArrowLeft
          size={15}
        />

        Back

      </button>


      {/* ======================================
          PROFILE CARD
      ====================================== */}

      <section
        className="
          overflow-hidden
          rounded-[28px]
          border
          border-[#e3dbe8]
          bg-white

          dark:border-[#38313f]
          dark:bg-[#1b191f]
        "
      >

        {/* COVER */}

        <div
          className="
            h-24
            bg-[linear-gradient(135deg,#eee8ff,#f7eef7)]

            dark:bg-[linear-gradient(135deg,#29222f,#211c26)]

            sm:h-32
          "
        />


        <div
          className="
            relative
            px-5
            pb-5

            sm:px-7
            sm:pb-7
          "
        >

          {/* AVATAR */}

          <div
            className="
              absolute
              -top-8
              grid
              h-16
              w-16
              place-items-center
              rounded-full
              border-4
              border-white
              bg-[#eee7f4]
              text-lg
              font-bold
              uppercase
              text-[#756681]

              dark:border-[#1b191f]
              dark:bg-[#2a2330]
              dark:text-[#c8b5d4]

              sm:-top-10
              sm:h-20
              sm:w-20
              sm:text-xl
            "
          >
            {profile.username?.charAt(
              0
            ) || "U"}
          </div>


          {/* ACTION */}

          <div
            className="
              flex
              justify-end
              pt-3
            "
          >

            {!isOwnProfile && (
              <button
                type="button"
                onClick={
                  handleFollow
                }
                disabled={
                  followLoading
                }
                className={`
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  transition
                  disabled:opacity-60

                  ${
                    profile.isFollowing
                      ? "border border-[#ddd4e2] bg-white text-[#61566b] hover:bg-[#f6f1f7] dark:border-[#443a4b] dark:bg-[#211d25] dark:text-[#d2c7d6]"
                      : "bg-[#302839] text-white hover:bg-[#43364d] dark:bg-[#eee8ff] dark:text-[#302839] dark:hover:bg-white"
                  }
                `}
              >

                {followLoading ? (
                  <LoaderCircle
                    size={14}
                    className="
                      animate-spin
                    "
                  />
                ) : profile.isFollowing ? (
                  <Check
                    size={14}
                  />
                ) : (
                  <UserPlus
                    size={14}
                  />
                )}


                {followLabel}

              </button>
            )}

          </div>


          {/* PROFILE INFO */}

          <div
            className="
              pt-5

              sm:pt-6
            "
          >

            <h1
              className="
                text-xl
                font-semibold
                tracking-[-0.03em]
                text-[#332c39]

                dark:text-[#f1ebf3]

                sm:text-2xl
              "
            >
              @{profile.username}
            </h1>


            {profile.bio && (
              <p
                className="
                  mt-2
                  max-w-xl
                  text-sm
                  leading-6
                  text-[#817685]

                  dark:text-[#a198a7]
                "
              >
                {profile.bio}
              </p>
            )}


            <div
              className="
                mt-4
                flex
                flex-wrap
                items-center
                gap-x-5
                gap-y-2
              "
            >

              {/* THOUGHTS */}

              <div
                className="
                  inline-flex
                  items-center
                  gap-1.5
                "
              >

                <MessageSquareText
                  size={14}
                  className="
                    text-[#8f8198]
                  "
                />

                <span
                  className="
                    text-xs
                    font-semibold
                    text-[#4c4251]

                    dark:text-[#d8cedd]
                  "
                >
                  {profile.thoughtCount || 0}
                </span>

                <span
                  className="
                    text-[10px]
                    text-[#988e9e]

                    dark:text-[#897f90]
                  "
                >
                  thoughts
                </span>

              </div>


              {/* FOLLOWERS */}

              <div
                className="
                  inline-flex
                  items-center
                  gap-1.5
                "
              >

                <Users
                  size={14}
                  className="
                    text-[#8f8198]
                  "
                />

                <span
                  className="
                    text-xs
                    font-semibold
                    text-[#4c4251]

                    dark:text-[#d8cedd]
                  "
                >
                  {profile.followersCount || 0}
                </span>

                <span
                  className="
                    text-[10px]
                    text-[#988e9e]

                    dark:text-[#897f90]
                  "
                >
                  followers
                </span>

              </div>


              {/* FOLLOWING */}

              <div
                className="
                  inline-flex
                  items-center
                  gap-1.5
                "
              >

                <Users
                  size={14}
                  className="
                    text-[#8f8198]
                  "
                />

                <span
                  className="
                    text-xs
                    font-semibold
                    text-[#4c4251]

                    dark:text-[#d8cedd]
                  "
                >
                  {profile.followingCount || 0}
                </span>

                <span
                  className="
                    text-[10px]
                    text-[#988e9e]

                    dark:text-[#897f90]
                  "
                >
                  following
                </span>

              </div>


              {/* MEMBER SINCE */}

              {profile.createdAt && (
                <div
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                  "
                >

                  <CalendarDays
                    size={13}
                    className="
                      text-[#8f8198]
                    "
                  />

                  <span
                    className="
                      text-[10px]
                      text-[#988e9e]

                      dark:text-[#897f90]
                    "
                  >
                    Joined{" "}
                    {new Date(
                      profile.createdAt
                    ).toLocaleDateString(
                      "en-US",
                      {
                        month:
                          "short",
                        year:
                          "numeric",
                      }
                    )}
                  </span>

                </div>
              )}

            </div>


            {/* RELATIONSHIP INFO */}

            {!isOwnProfile &&
              profile.followsMe &&
              !profile.isFollowing && (
                <div
                  className="
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-[#f1eafa]
                    px-3
                    py-1.5
                    text-[10px]
                    font-semibold
                    text-[#725d7e]

                    dark:bg-[#30263a]
                    dark:text-[#c8b4d4]
                  "
                >
                  <UserPlus
                    size={12}
                  />

                  Follows you
                </div>
              )}

          </div>

        </div>

      </section>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div
          className="
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


      {/* ======================================
          THOUGHTS
      ====================================== */}

      <section>

        <div
          className="
            mb-4
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h2
              className="
                text-sm
                font-semibold
                text-[#39313f]

                dark:text-[#eee7f2]
              "
            >
              Thoughts
            </h2>


            <p
              className="
                mt-1
                text-[10px]
                text-[#9b919f]

                dark:text-[#817786]
              "
            >
              Thoughts shared by @{profile.username}
            </p>

          </div>

        </div>


        {thoughts.length ===
          0 ? (
          <div
            className="
              rounded-[26px]
              border
              border-dashed
              border-[#d8cfdf]
              bg-white
              px-6
              py-14
              text-center

              dark:border-[#3c3442]
              dark:bg-[#1b191f]
            "
          >

            <MessageSquareText
              size={24}
              className="
                mx-auto
                text-[#a296aa]

                dark:text-[#6f6475]
              "
            />


            <p
              className="
                mt-4
                text-sm
                font-semibold

                dark:text-[#eee7f2]
              "
            >
              No thoughts yet
            </p>


            <p
              className="
                mt-1
                text-xs
                text-[#9d949f]

                dark:text-[#898090]
              "
            >
              @{profile.username} hasn't shared
              anything yet.
            </p>

          </div>
        ) : (
          <div
            className="
              space-y-3

              sm:space-y-4
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
                />
              )
            )}

          </div>
        )}

      </section>

    </div>
  );
}


export default PublicProfile;