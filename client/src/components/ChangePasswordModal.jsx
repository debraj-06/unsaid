import {
  Eye,
  EyeOff,
  KeyRound,
  X,
} from "lucide-react";

import { useState } from "react";

import {
  changePassword,
} from "../services/userService";


function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]:
        event.target.value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    if (
      !form.currentPassword ||
      !form.newPassword ||
      !form.confirmPassword
    ) {
      setError(
        "Please fill in all fields."
      );

      return;
    }


    if (
      form.newPassword !==
      form.confirmPassword
    ) {
      setError(
        "New passwords do not match."
      );

      return;
    }


    try {
      setLoading(true);

      const data =
        await changePassword(form);

      setSuccess(
        data.message ||
          "Password changed successfully."
      );

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {
      setError(
        error.message ||
          "Unable to change password."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="
        fixed
        inset-0
        z-[200]
        flex
        items-center
        justify-center
        bg-black/40
        px-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >

      <div
        className="
          w-full
          max-w-[440px]
          rounded-[28px]
          border
          border-[#e8e0eb]
          bg-white
          p-6
          shadow-2xl

          dark:border-[#332c38]
          dark:bg-[#1b191f]
          sm:p-7
        "
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        {/* Header */}

        <div className="flex items-start justify-between">

          <div>

            <div
              className="
                grid
                h-10
                w-10
                place-items-center
                rounded-full
                bg-[#eee7f4]
                text-[#806e8d]

                dark:bg-[#2b2430]
                dark:text-[#c7b5d1]
              "
            >
              <KeyRound size={18} />
            </div>

            <h2 className="mt-4 text-xl font-semibold">
              Change password
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#968c9c]">
              Update your password without
              adding any personal information.
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              grid
              h-9
              w-9
              place-items-center
              rounded-full
              text-[#8e8592]
              hover:bg-[#f3eef4]

              dark:hover:bg-[#29232e]
            "
          >
            <X size={17} />
          </button>

        </div>


        {/* Errors */}

        {error && (
          <div
            className="
              mt-5
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-3
              py-2.5
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


        {/* Success */}

        {success && (
          <div
            className="
              mt-5
              rounded-xl
              border
              border-emerald-200
              bg-emerald-50
              px-3
              py-2.5
              text-xs
              text-emerald-700

              dark:border-emerald-900/50
              dark:bg-emerald-950/30
              dark:text-emerald-400
            "
          >
            {success}
          </div>
        )}


        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >

          {/* Current password */}

          <div>

            <label className="mb-2 block text-xs font-semibold">
              Current password
            </label>

            <div className="relative">

              <input
                name="currentPassword"
                value={
                  form.currentPassword
                }
                onChange={handleChange}
                type={
                  showCurrent
                    ? "text"
                    : "password"
                }
                autoComplete="current-password"
                placeholder="Enter current password"
                className="
                  h-12
                  w-full
                  rounded-[16px]
                  border
                  border-[#e3dce6]
                  bg-[#faf8fb]
                  px-4
                  pr-12
                  text-sm
                  outline-none
                  focus:border-[#82708f]

                  dark:border-[#3a3340]
                  dark:bg-[#151319]
                  dark:text-white
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrent(
                    (current) =>
                      !current
                  )
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[#99909e]
                "
              >
                {showCurrent ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>

            </div>

          </div>


          {/* New password */}

          <div>

            <label className="mb-2 block text-xs font-semibold">
              New password
            </label>

            <div className="relative">

              <input
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                type={
                  showNew
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                placeholder="Create a new password"
                className="
                  h-12
                  w-full
                  rounded-[16px]
                  border
                  border-[#e3dce6]
                  bg-[#faf8fb]
                  px-4
                  pr-12
                  text-sm
                  outline-none
                  focus:border-[#82708f]

                  dark:border-[#3a3340]
                  dark:bg-[#151319]
                  dark:text-white
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowNew(
                    (current) =>
                      !current
                  )
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[#99909e]
                "
              >
                {showNew ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>

            </div>

            <p className="mt-1.5 text-[10px] text-[#a39aa7]">
              Use at least 8 characters.
            </p>

          </div>


          {/* Confirm */}

          <div>

            <label className="mb-2 block text-xs font-semibold">
              Confirm new password
            </label>

            <div className="relative">

              <input
                name="confirmPassword"
                value={
                  form.confirmPassword
                }
                onChange={handleChange}
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                placeholder="Repeat new password"
                className="
                  h-12
                  w-full
                  rounded-[16px]
                  border
                  border-[#e3dce6]
                  bg-[#faf8fb]
                  px-4
                  pr-12
                  text-sm
                  outline-none
                  focus:border-[#82708f]

                  dark:border-[#3a3340]
                  dark:bg-[#151319]
                  dark:text-white
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(
                    (current) =>
                      !current
                  )
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[#99909e]
                "
              >
                {showConfirm ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>

            </div>

          </div>


          {/* Buttons */}

          <div className="flex gap-2 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="
                h-11
                flex-1
                rounded-[15px]
                border
                border-[#ddd4e2]
                text-xs
                font-semibold
                text-[#6f6575]

                hover:bg-[#f5f1f6]

                dark:border-[#403744]
                dark:text-[#c2b7c8]
                dark:hover:bg-[#28222d]
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                h-11
                flex-1
                rounded-[15px]
                bg-[#2c2632]
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-[#3a3142]
                disabled:cursor-not-allowed
                disabled:opacity-50

                dark:bg-[#eee8ff]
                dark:text-[#2c2632]
                dark:hover:bg-white
              "
            >
              {loading
                ? "Changing..."
                : "Change password"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ChangePasswordModal;