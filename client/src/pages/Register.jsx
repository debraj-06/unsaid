import {
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";


function Register() {
  const navigate =
    useNavigate();

  const {
    register,
  } = useAuth();


  // ==========================================
  // FORM
  // ==========================================

  const [
    username,
    setUsername,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  // ==========================================
  // REGISTER
  // ==========================================

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      const cleanUsername =
        username
          .trim()
          .toLowerCase();

      if (!cleanUsername) {
        setError(
          "Choose a username."
        );

        return;
      }

      if (!password) {
        setError(
          "Create a password."
        );

        return;
      }

      if (
        password.length <
        8
      ) {
        setError(
          "Your password needs at least 8 characters."
        );

        return;
      }

      if (
        password !==
        confirmPassword
      ) {
        setError(
          "Those passwords don't match yet."
        );

        return;
      }

      try {
        setLoading(true);
        setError("");

        await register({
          username:
            cleanUsername,

          password,

          confirmPassword,
        });


        navigate(
          "/",
          {
            replace: true,
          }
        );
      } catch (error) {
        console.error(
          "Register error:",
          error
        );

        setError(
          error.message ||
            "Unable to create your space right now."
        );
      } finally {
        setLoading(false);
      }
    };


  return (
    <div
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-[#faf8fa]
        px-5
        py-10
        text-[#302936]

        dark:bg-[#121016]
        dark:text-[#f3edf7]
      "
    >

      <div
        className="
          w-full
          max-w-[440px]
        "
      >

        {/* ====================================
            BRAND
        ==================================== */}

        <div
          className="
            mb-8
            text-center
          "
        >

          <div
            className="
              mx-auto
              flex
              w-fit
              items-center
              gap-2
            "
          >

            <div
              className="
                grid
                h-9
                w-9
                place-items-center
                rounded-full
                bg-[#302839]
                text-sm
                font-bold
                text-white

                dark:bg-[#eee8ff]
                dark:text-[#302839]
              "
            >
              U
            </div>


            <span
              className="
                text-sm
                font-semibold
                tracking-[0.18em]
              "
            >
              UNSAID
            </span>

          </div>

        </div>


        {/* ====================================
            CARD
        ==================================== */}

        <div
          className="
            rounded-[30px]
            border
            border-[#e7e0e9]
            bg-white
            p-6
            shadow-[0_20px_60px_rgba(48,41,54,0.06)]

            dark:border-[#302a35]
            dark:bg-[#1b191f]
            dark:shadow-none

            sm:p-8
          "
        >

          <div>

            <h1
              className="
                text-3xl
                font-semibold
                tracking-[-0.04em]
              "
            >
              Create your space.
            </h1>


            <p
              className="
                mt-3
                max-w-[370px]
                text-sm
                leading-6
                text-[#8f8595]

                dark:text-[#9b91a2]
              "
            >
              No real name. No pressure.
              Just a place to say what you mean.
            </p>

          </div>


          {/* ==================================
              ERROR
          ================================== */}

          {error && (
            <div
              className="
                mt-6
                rounded-[16px]
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-xs
                leading-5
                text-red-600

                dark:border-red-900/40
                dark:bg-red-950/20
                dark:text-red-400
              "
            >
              {error}
            </div>
          )}


          {/* ==================================
              FORM
          ================================== */}

          <form
            onSubmit={
              handleSubmit
            }
            className="
              mt-7
              space-y-4
            "
          >

            {/* USERNAME */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-xs
                  font-semibold
                  text-[#544a5b]

                  dark:text-[#cfc4d4]
                "
              >
                Username
              </label>


              <div
                className="
                  relative
                "
              >

                <UserRound
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[#a298a6]
                  "
                />


                <input
                  type="text"
                  value={
                    username
                  }
                  onChange={(
                    event
                  ) => {
                    setUsername(
                      event.target.value
                    );

                    setError("");
                  }}
                  placeholder="What should we call you?"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  disabled={
                    loading
                  }
                  className="
                    h-12
                    w-full
                    rounded-[16px]
                    border
                    border-[#e1d9e4]
                    bg-[#faf8fb]
                    pl-11
                    pr-4
                    text-sm
                    outline-none

                    placeholder:text-[#aaa1ae]

                    focus:border-[#a493ad]
                    focus:ring-4
                    focus:ring-[#eee6f0]

                    disabled:opacity-60

                    dark:border-[#3a333f]
                    dark:bg-[#151319]
                    dark:text-white
                    dark:placeholder:text-[#7f7585]

                    dark:focus:border-[#675274]
                    dark:focus:ring-[#30253a]
                  "
                />

              </div>


              <p
                className="
                  mt-2
                  text-[10px]
                  text-[#a097a4]

                  dark:text-[#746a79]
                "
              >
                Your username is the only
                identity you need.
              </p>

            </div>


            {/* PASSWORD */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-xs
                  font-semibold
                  text-[#544a5b]

                  dark:text-[#cfc4d4]
                "
              >
                Password
              </label>


              <div
                className="
                  relative
                "
              >

                <LockKeyhole
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[#a298a6]
                  "
                />


                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    password
                  }
                  onChange={(
                    event
                  ) => {
                    setPassword(
                      event.target.value
                    );

                    setError("");
                  }}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  disabled={
                    loading
                  }
                  className="
                    h-12
                    w-full
                    rounded-[16px]
                    border
                    border-[#e1d9e4]
                    bg-[#faf8fb]
                    pl-11
                    pr-12
                    text-sm
                    outline-none

                    placeholder:text-[#aaa1ae]

                    focus:border-[#a493ad]
                    focus:ring-4
                    focus:ring-[#eee6f0]

                    disabled:opacity-60

                    dark:border-[#3a333f]
                    dark:bg-[#151319]
                    dark:text-white
                    dark:placeholder:text-[#7f7585]

                    dark:focus:border-[#675274]
                    dark:focus:ring-[#30253a]
                  "
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    grid
                    h-8
                    w-8
                    -translate-y-1/2
                    place-items-center
                    rounded-full
                    text-[#8f8595]
                    hover:bg-black/5

                    dark:hover:bg-white/5
                  "
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (
                    <EyeOff
                      size={16}
                    />
                  ) : (
                    <Eye
                      size={16}
                    />
                  )}

                </button>

              </div>


              <p
                className="
                  mt-2
                  text-[10px]
                  text-[#a097a4]

                  dark:text-[#746a79]
                "
              >
                At least 8 characters.
              </p>

            </div>


            {/* CONFIRM PASSWORD */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-xs
                  font-semibold
                  text-[#544a5b]

                  dark:text-[#cfc4d4]
                "
              >
                Confirm password
              </label>


              <div
                className="
                  relative
                "
              >

                <LockKeyhole
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[#a298a6]
                  "
                />


                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    confirmPassword
                  }
                  onChange={(
                    event
                  ) => {
                    setConfirmPassword(
                      event.target.value
                    );

                    setError("");
                  }}
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  disabled={
                    loading
                  }
                  className="
                    h-12
                    w-full
                    rounded-[16px]
                    border
                    border-[#e1d9e4]
                    bg-[#faf8fb]
                    pl-11
                    pr-12
                    text-sm
                    outline-none

                    placeholder:text-[#aaa1ae]

                    focus:border-[#a493ad]
                    focus:ring-4
                    focus:ring-[#eee6f0]

                    disabled:opacity-60

                    dark:border-[#3a333f]
                    dark:bg-[#151319]
                    dark:text-white
                    dark:placeholder:text-[#7f7585]

                    dark:focus:border-[#675274]
                    dark:focus:ring-[#30253a]
                  "
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) =>
                        !current
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    grid
                    h-8
                    w-8
                    -translate-y-1/2
                    place-items-center
                    rounded-full
                    text-[#8f8595]
                    hover:bg-black/5

                    dark:hover:bg-white/5
                  "
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showConfirmPassword ? (
                    <EyeOff
                      size={16}
                    />
                  ) : (
                    <Eye
                      size={16}
                    />
                  )}

                </button>

              </div>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={
                loading
              }
              className="
                mt-2
                flex
                h-12
                w-full
                items-center
                justify-center
                rounded-full
                bg-[#302839]
                text-sm
                font-semibold
                text-white
                transition

                hover:bg-[#40344a]

                disabled:cursor-not-allowed
                disabled:opacity-50

                dark:bg-[#eee8ff]
                dark:text-[#302839]
                dark:hover:bg-white
              "
            >

              {loading ? (
                <>
                  <span
                    className="
                      mr-2
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-white/40
                      border-t-white

                      dark:border-[#302839]/30
                      dark:border-t-[#302839]
                    "
                  />

                  Creating...
                </>
              ) : (
                "Create my space"
              )}

            </button>

          </form>


          {/* ==================================
              FOOTER
          ================================== */}

          <div
            className="
              mt-7
              border-t
              border-[#eee8f0]
              pt-6
              text-center

              dark:border-[#2d2731]
            "
          >

            <p
              className="
                text-xs
                text-[#968c9c]

                dark:text-[#8e8495]
              "
            >
              Already have a space?
              {" "}
              <Link
                to="/login"
                className="
                  font-semibold
                  text-[#62536d]
                  underline
                  decoration-[#cfc2d6]
                  underline-offset-4

                  dark:text-[#cdbbd5]
                  dark:decoration-[#5b4d64]
                "
              >
                Enter Unsaid
              </Link>
            </p>

          </div>

        </div>


        {/* ====================================
            PRIVACY NOTE
        ==================================== */}

        <p
          className="
            mx-auto
            mt-6
            max-w-[340px]
            text-center
            text-[10px]
            leading-5
            text-[#aaa0ad]

            dark:text-[#706675]
          "
        >
          No real name. No public identity.
          Just a space for your thoughts.
        </p>

      </div>

    </div>
  );
}


export default Register;