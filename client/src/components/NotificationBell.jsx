import {
  Bell,
  CheckCheck,
  Heart,
  MessageCircle,
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
  getUnreadNotificationCount,
  markNotificationRead,
} from "../services/notificationService";


function NotificationBell() {
  const navigate =
    useNavigate();


  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);


  const [
    loading,
    setLoading,
  ] = useState(true);


  // ==========================================
  // LOAD COUNT
  // ==========================================

  const loadCount =
    async () => {
      try {
        const data =
          await getUnreadNotificationCount();

        setUnreadCount(
          Number(
            data.unreadCount ||
              0
          )
        );
      } catch (error) {
        console.error(
          "Notification count error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };


  // ==========================================
  // INITIAL + POLLING
  // ==========================================

  useEffect(() => {
    loadCount();


    const interval =
      setInterval(
        loadCount,
        30000
      );


    return () =>
      clearInterval(
        interval
      );
  }, []);


  // ==========================================
  // ICON
  // ==========================================

  const getIcon =
    (type) => {
      if (
        type === "like"
      ) {
        return (
          <Heart
            size={15}
          />
        );
      }


      if (
        type === "comment" ||
        type === "reply"
      ) {
        return (
          <MessageCircle
            size={15}
          />
        );
      }


      if (
        type === "follow"
      ) {
        return (
          <UserPlus
            size={15}
          />
        );
      }


      if (
        type === "mention"
      ) {
        return (
          <UserRound
            size={15}
          />
        );
      }


      return (
        <Bell
          size={15}
        />
      );
    };


  // ==========================================
  // CLICK
  // ==========================================

  const handleClick =
    async () => {
      /*
       * Open full notifications page.
       *
       * The page itself handles loading
       * and navigation.
       */

      navigate(
        "/notifications"
      );
    };


  return (
    <button
      type="button"
      onClick={
        handleClick
      }
      disabled={loading}
      className="
        relative
        grid
        h-10
        w-10
        place-items-center
        rounded-full
        text-[#756b7d]
        transition
        hover:bg-[#f2edf4]
        hover:text-[#332b38]
        disabled:opacity-70

        dark:text-[#b8adbf]
        dark:hover:bg-[#28222d]
        dark:hover:text-white
      "
      aria-label={
        unreadCount > 0
          ? `Notifications, ${unreadCount} unread`
          : "Notifications"
      }
    >
      <Bell
        size={19}
        strokeWidth={1.8}
      />


      {unreadCount >
        0 && (
        <span
          className="
            absolute
            right-1
            top-1
            grid
            min-h-[16px]
            min-w-[16px]
            place-items-center
            rounded-full
            bg-[#c45b72]
            px-1
            text-[8px]
            font-bold
            text-white
            ring-2
            ring-[#faf8fa]

            dark:ring-[#151319]
          "
        >
          {unreadCount >
          99
            ? "99+"
            : unreadCount}
        </span>
      )}
    </button>
  );
}


export default NotificationBell;