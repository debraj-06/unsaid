import {
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  Heart,
  MessageCircle,
  Trash2,
  UserPlus,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notificationService";


function Notifications() {
  const navigate =
    useNavigate();


  const [
    notifications,
    setNotifications,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);


  // ==========================================
  // LOAD
  // ==========================================

  const loadNotifications =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getNotifications();


        setNotifications(
          Array.isArray(
            data.notifications
          )
            ? data.notifications
            : []
        );
      } catch (error) {
        console.error(
          "Notifications page error:",
          error
        );

        setError(
          error.message ||
            "Unable to load notifications"
        );
      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    loadNotifications();
  }, []);


  // ==========================================
  // UNREAD COUNT
  // ==========================================

  const unreadCount =
    notifications.filter(
      (item) =>
        !item.read
    ).length;


  // ==========================================
  // ICON
  // ==========================================

  const getIcon =
    (type) => {
      switch (type) {
        case "like":
          return (
            <Heart
              size={16}
            />
          );

        case "comment":
        case "reply":
          return (
            <MessageCircle
              size={16}
            />
          );

        case "follow":
          return (
            <UserPlus
              size={16}
            />
          );

        case "mention":
          return (
            <UserRound
              size={16}
            />
          );

        default:
          return (
            <Bell
              size={16}
            />
          );
      }
    };


  // ==========================================
  // TEXT
  // ==========================================

  const getText =
    (notification) => {
      const username =
        notification.sender
          ?.username ||
        "Someone";


      switch (
        notification.type
      ) {
        case "like":
          return `${username} liked your thought`;

        case "comment":
          return `${username} commented on your thought`;

        case "reply":
          return `${username} replied to your comment`;

        case "follow":
          return `${username} followed you`;

        case "mention":
          return `${username} mentioned you`;

        default:
          return "You have a new notification";
      }
    };


  // ==========================================
  // MARK READ
  // ==========================================

  const handleMarkRead =
    async (id) => {
      try {
        await markNotificationRead(
          id
        );


        setNotifications(
          (current) =>
            current.map(
              (notification) => {
                const notificationId =
                  notification._id ||
                  notification.id;


                if (
                  notificationId !==
                  id
                ) {
                  return notification;
                }


                return {
                  ...notification,
                  read: true,
                };
              }
            )
        );
      } catch (error) {
        console.error(
          "Mark read error:",
          error
        );
      }
    };


  // ==========================================
  // MARK ALL READ
  // ==========================================

  const handleMarkAllRead =
    async () => {
      if (
        unreadCount ===
        0
      ) {
        return;
      }


      try {
        setActionLoading(
          true
        );


        await markAllNotificationsRead();


        setNotifications(
          (current) =>
            current.map(
              (notification) => ({
                ...notification,
                read: true,
              })
            )
        );
      } catch (error) {
        console.error(
          "Mark all read error:",
          error
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };


  // ==========================================
  // DELETE ONE
  // ==========================================

  const handleDelete =
    async (
      event,
      id
    ) => {
      event.stopPropagation();


      try {
        await deleteNotification(
          id
        );


        setNotifications(
          (current) =>
            current.filter(
              (notification) =>
                (
                  notification._id ||
                  notification.id
                ) !== id
            )
        );
      } catch (error) {
        console.error(
          "Delete notification error:",
          error
        );
      }
    };


  // ==========================================
  // DELETE ALL
  // ==========================================

  const handleDeleteAll =
    async () => {
      const confirmed =
        window.confirm(
          "Delete all notifications?"
        );


      if (!confirmed) {
        return;
      }


      try {
        setActionLoading(
          true
        );


        await deleteAllNotifications();


        setNotifications(
          []
        );
      } catch (error) {
        console.error(
          "Delete all notifications error:",
          error
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };


  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleNotificationClick =
    async (
      notification
    ) => {
      const id =
        notification._id ||
        notification.id;


      if (
        !notification.read
      ) {
        await handleMarkRead(
          id
        );
      }


      // --------------------------------------
      // FOLLOW
      // --------------------------------------

      if (
        notification.type ===
          "follow" &&
        notification.sender
          ?.username
      ) {
        navigate(
          `/user/${notification.sender.username}`
        );

        return;
      }


      // --------------------------------------
      // THOUGHT-BASED EVENTS
      // --------------------------------------

      if (
        notification.thought
      ) {
        const thoughtId =
          typeof notification.thought ===
          "object"
            ? notification.thought._id ||
              notification.thought.id
            : notification.thought;


        if (thoughtId) {
          navigate(
            `/?thought=${thoughtId}&conversation=1`
          );

          return;
        }
      }


      navigate(
        "/notifications"
      );
    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div
        className="
          mx-auto
          w-full
          max-w-[900px]
        "
      >

        <div
          className="
            rounded-[26px]
            border
            border-[#e4dce8]
            bg-white
            p-12
            text-center

            dark:border-[#342e39]
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
              text-[#908695]

              dark:text-[#958a9b]
            "
          >
            Loading notifications...
          </p>

        </div>

      </div>
    );
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
          HEADER
      ====================================== */}

      <section
        className="
          rounded-[26px]
          border
          border-[#e4dce8]
          bg-white
          px-5
          py-5

          dark:border-[#342e39]
          dark:bg-[#1b191f]

          sm:px-6
          sm:py-6
        "
      >

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

          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
            "
          >

            <div
              className="
                grid
                h-11
                w-11
                shrink-0
                place-items-center
                rounded-[15px]
                bg-[#eee8ff]
                text-[#665475]

                dark:bg-[#2c2433]
                dark:text-[#cdb8d8]
              "
            >
              <Bell
                size={20}
              />
            </div>


            <div>

              <h1
                className="
                  text-xl
                  font-semibold
                  tracking-[-0.03em]
                  text-[#322b38]

                  dark:text-[#f1ebf3]

                  sm:text-2xl
                "
              >
                Notifications
              </h1>


              <p
                className="
                  mt-1
                  text-xs
                  text-[#948a99]

                  dark:text-[#887e90]
                "
              >
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You're all caught up"}
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

            {unreadCount >
              0 && (
              <button
                type="button"
                onClick={
                  handleMarkAllRead
                }
                disabled={
                  actionLoading
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#ddd4e2]
                  bg-white
                  px-3.5
                  py-2
                  text-[10px]
                  font-semibold
                  text-[#71657a]
                  hover:bg-[#f7f3f8]
                  disabled:opacity-50

                  dark:border-[#3b3341]
                  dark:bg-[#211d25]
                  dark:text-[#bdb1c5]
                  dark:hover:bg-[#2a2430]
                "
              >
                <CheckCheck
                  size={13}
                />

                Mark all read
              </button>
            )}


            {notifications.length >
              0 && (
              <button
                type="button"
                onClick={
                  handleDeleteAll
                }
                disabled={
                  actionLoading
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-red-200
                  bg-white
                  px-3.5
                  py-2
                  text-[10px]
                  font-semibold
                  text-red-500
                  hover:bg-red-50
                  disabled:opacity-50

                  dark:border-red-900/50
                  dark:bg-[#211d25]
                  dark:text-red-400
                  dark:hover:bg-red-950/20
                "
              >
                <Trash2
                  size={13}
                />

                Clear all
              </button>
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
            rounded-[20px]
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
          EMPTY
      ====================================== */}

      {!error &&
        notifications.length ===
          0 && (
          <div
            className="
              rounded-[28px]
              border
              border-dashed
              border-[#d8cfdf]
              bg-white
              px-6
              py-16
              text-center

              dark:border-[#3c3442]
              dark:bg-[#1b191f]
            "
          >

            <div
              className="
                mx-auto
                grid
                h-14
                w-14
                place-items-center
                rounded-full
                bg-[#eee8ff]
                text-[#806d8f]

                dark:bg-[#292230]
                dark:text-[#bdabca]
              "
            >
              <Bell
                size={23}
              />
            </div>


            <p
              className="
                mt-5
                text-sm
                font-semibold
                text-[#433847]

                dark:text-[#eee7f2]
              "
            >
              No notifications yet
            </p>


            <p
              className="
                mx-auto
                mt-2
                max-w-sm
                text-xs
                leading-5
                text-[#9d949f]

                dark:text-[#898090]
              "
            >
              Likes, comments, follows and
              mentions will appear here.
            </p>

          </div>
        )}


      {/* ======================================
          NOTIFICATION LIST
      ====================================== */}

      {!error &&
        notifications.length >
          0 && (
          <section
            className="
              overflow-hidden
              rounded-[26px]
              border
              border-[#e4dce8]
              bg-white

              dark:border-[#342e39]
              dark:bg-[#1b191f]
            "
          >

            {notifications.map(
              (notification) => {
                const id =
                  notification._id ||
                  notification.id;


                return (
                  <div
                    key={id}
                    className={`
                      group
                      flex
                      items-start
                      gap-3
                      border-b
                      border-[#eee8f0]
                      p-4
                      transition
                      last:border-b-0

                      dark:border-[#2c2731]

                      ${
                        notification.read
                          ? "bg-white dark:bg-[#1b191f]"
                          : "bg-[#faf7fc] dark:bg-[#211c25]"
                      }
                    `}
                  >

                    {/* ICON */}

                    <div
                      className="
                        grid
                        h-10
                        w-10
                        shrink-0
                        place-items-center
                        rounded-full
                        bg-[#eee8ff]
                        text-[#695576]

                        dark:bg-[#2c2433]
                        dark:text-[#ccb6d8]
                      "
                    >
                      {getIcon(
                        notification.type
                      )}
                    </div>


                    {/* MAIN */}

                    <button
                      type="button"
                      onClick={() =>
                        handleNotificationClick(
                          notification
                        )
                      }
                      className="
                        min-w-0
                        flex-1
                        text-left
                      "
                    >

                      <div
                        className="
                          flex
                          items-start
                          gap-2
                        "
                      >

                        <div className="min-w-0 flex-1">

                          <p
                            className="
                              text-sm
                              leading-6
                              text-[#453b4b]

                              dark:text-[#e1d7e5]
                            "
                          >
                            {getText(
                              notification
                            )}
                          </p>


                          {notification.thought &&
                            typeof notification.thought ===
                              "object" &&
                            notification.thought.content && (
                            <p
                              className="
                                mt-1
                                line-clamp-2
                                text-xs
                                leading-5
                                text-[#978d9d]

                                dark:text-[#84798b]
                              "
                            >
                              {
                                notification
                                  .thought
                                  .content
                              }
                            </p>
                          )}


                          <p
                            className="
                              mt-1.5
                              text-[10px]
                              text-[#aaa0ad]

                              dark:text-[#6f6675]
                            "
                          >
                            {notification.createdAt
                              ? new Date(
                                  notification.createdAt
                                ).toLocaleString(
                                  "en-US",
                                  {
                                    month:
                                      "short",
                                    day:
                                      "numeric",
                                    hour:
                                      "numeric",
                                    minute:
                                      "2-digit",
                                  }
                                )
                              : ""}
                          </p>

                        </div>


                        {!notification.read && (
                          <span
                            className="
                              mt-2
                              h-2
                              w-2
                              shrink-0
                              rounded-full
                              bg-[#c45b72]
                            "
                          />
                        )}

                      </div>

                    </button>


                    {/* ACTIONS */}

                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        gap-1
                      "
                    >

                      {!notification.read && (
                        <button
                          type="button"
                          onClick={() =>
                            handleMarkRead(
                              id
                            )
                          }
                          className="
                            grid
                            h-8
                            w-8
                            place-items-center
                            rounded-full
                            text-[#887c90]
                            hover:bg-[#f2edf4]

                            dark:text-[#9a8e9f]
                            dark:hover:bg-[#29232f]
                          "
                          title="Mark as read"
                        >
                          <Check
                            size={14}
                          />
                        </button>
                      )}


                      <button
                        type="button"
                        onClick={(
                          event
                        ) =>
                          handleDelete(
                            event,
                            id
                          )
                        }
                        className="
                          grid
                          h-8
                          w-8
                          place-items-center
                          rounded-full
                          text-[#9b909d]
                          opacity-70
                          hover:bg-red-50
                          hover:text-red-500

                          dark:text-[#817786]
                          dark:hover:bg-red-950/20
                        "
                        title="Delete notification"
                      >
                        <Trash2
                          size={14}
                        />
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          handleNotificationClick(
                            notification
                          )
                        }
                        className="
                          hidden
                          h-8
                          w-8
                          place-items-center
                          rounded-full
                          text-[#9b909d]
                          hover:bg-[#f2edf4]

                          dark:text-[#817786]
                          dark:hover:bg-[#29232f]

                          sm:grid
                        "
                        title="Open"
                      >
                        <ChevronRight
                          size={15}
                        />
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </section>
        )}

    </div>
  );
}

export default Notifications;