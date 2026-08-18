import {
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
  X,
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


// ==========================================
// PASSWORD RULE
// ==========================================

function PasswordRule({
  valid,
  text,
}) {
  return (
    <div
      className={`
        flex
        items-center
        gap-2
        text-[10px]
        leading-4

        ${
          valid
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-[#9b919f] dark:text-[#746a79]"
        }
      `}
    >
      <span
        className={`
          grid
          h-4
          w-4
          shrink-0
          place-items-center
          rounded-full
          text-[9px]
          font-bold

          ${
            valid
              ? "bg-emerald-100 dark:bg-emerald-900/30"
              : "bg-[#eee9f0] dark:bg-[#2a2530]"
          }
        `}
      >
        {valid ? (
          <Check
            size={9}
            strokeWidth={3}
          />
        ) : (
          <X
            size={9}
            strokeWidth={2}
          />
        )}
      </span>

      <span>
        {text}
      </span>
    </div>
  );
}


// ==========================================
// REGISTER
// ==========================================

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


  // ==========================================
  // PASSWORD VISIBILITY
  // ==========================================

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);


  // ==========================================
  // PASSWORD REQUIREMENTS VISIBILITY
  // ==========================================

  const [
    showPasswordRequirements,
    setShowPasswordRequirements,
  ] = useState(false);


  // ==========================================
  // UI
  // ==========================================

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  // ==========================================
  // PASSWORD RULES
  // ==========================================

  const passwordRules = {
    length:
      password.length >= 8,

    uppercase:
      /[A-Z]/.test(password),

    lowercase:
      /[a-z]/.test(password),

    number:
      /[0-9]/.test(password),

    special:
      /[^A-Za-z0-9]/.test(password),
  };


  const passwordStrong =
    passwordRules.length &&
    passwordRules.uppercase &&
    passwordRules.lowercase &&
    passwordRules.number &&
    passwordRules.special;


  // ==========================================
  // PASSWORD MATCH
  // ==========================================

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password ===
      confirmPassword;


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      const cleanUsername =
        username
          .trim()
          .toLowerCase();


      // ----------------------------------------
      // USERNAME
      // ----------------------------------------

      if (!cleanUsername) {
        setError(
          "Choose a username."
        );

        return;
      }


      if (
        !/^[a-zA-Z0-9_]+$/.test(
          cleanUsername
        )
      ) {
        setError(
          "Username can only contain letters, numbers and underscores."
        );

        return;
      }


      if (
        cleanUsername.length < 3
      ) {
        setError(
          "Your username needs at least 3 characters."
        );

        return;
      }


      if (
        cleanUsername.length > 30
      ) {
        setError(
          "Your username can be up to 30 characters."
        );

        return;
      }


      // ----------------------------------------
      // PASSWORD
      // ----------------------------------------

      if (!password) {
        setError(
          "Create a password."
        );

        return;
      }


      if (!passwordStrong) {
        setShowPasswordRequirements(
          true
        );

        setError(
          "Your password does not meet all the requirements yet."
        );

        return;
      }


      // ----------------------------------------
      // CONFIRM PASSWORD
      // ----------------------------------------

      if (!confirmPassword) {
        setError(
          "Confirm your password."
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


      // ----------------------------------------
      // REGISTER
      // ----------------------------------------

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
          max-w-[460px]
        "
      >

        {/* ======================================
            BRAND
        ====================================== */}

        <div
          className="
            mb-8
            text-center
          "
        >

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="
              mx-auto
              flex
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

          </button>

        </div>


        {/* ======================================
            CARD
        ====================================== */}

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

          {/* ====================================
              HEADER
          ==================================== */}

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
                max-w-[390px]

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


          {/* ====================================
              ERROR
          ==================================== */}

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


          {/* ====================================
              FORM
          ==================================== */}

          <form
            onSubmit={
              handleSubmit
            }
            className="
              mt-7
              space-y-5
            "
          >

            {/* ==================================
                USERNAME
            ================================== */}

            <div>

              <label
                htmlFor="username"
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
                  strokeWidth={1.8}
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
                  id="username"
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

                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="What should we call you?"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  disabled={
                    loading
                  }
                  maxLength={30}
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

                    text-[#403747]

                    outline-none

                    transition

                    placeholder:text-[#aaa1ae]

                    focus:border-[#a493ad]
                    focus:ring-4
                    focus:ring-[#eee6f0]

                    disabled:cursor-not-allowed
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
                  leading-4

                  text-[#a097a4]

                  dark:text-[#746a79]
                "
              >
                Letters, numbers and underscores only.
              </p>

            </div>


            {/* ==================================
                PASSWORD
            ================================== */}

            <div>

              <label
                htmlFor="password"
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
                  strokeWidth={1.8}
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
                  id="password"
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

                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  disabled={
                    loading
                  }
                  maxLength={128}
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

                    text-[#403747]

                    outline-none

                    transition

                    placeholder:text-[#aaa1ae]

                    focus:border-[#a493ad]
                    focus:ring-4
                    focus:ring-[#eee6f0]

                    disabled:cursor-not-allowed
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
                      (
                        current
                      ) =>
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

                    transition

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
                      strokeWidth={1.8}
                    />
                  ) : (
                    <Eye
                      size={16}
                      strokeWidth={1.8}
                    />
                  )}
                </button>

              </div>


              {/* =================================
                  REQUIREMENTS TOGGLE
              ================================= */}

              <button
                type="button"
                onClick={() =>
                  setShowPasswordRequirements(
                    (
                      current
                    ) =>
                      !current
                  )
                }
                className="
                  mt-3

                  flex
                  w-full
                  items-center
                  justify-between

                  rounded-[12px]

                  px-1
                  py-1

                  text-left

                  text-[10px]
                  font-semibold

                  text-[#746a79]

                  transition

                  hover:text-[#544a5b]

                  dark:text-[#aaa0b0]
                  dark:hover:text-[#d6cbd9]
                "
                aria-expanded={
                  showPasswordRequirements
                }
              >

                <span>
                  Password requirements
                </span>


                <span
                  className="
                    flex
                    items-center
                    gap-1

                    text-[10px]
                    font-medium

                    text-[#978c9e]
                  "
                >
                  {
                    showPasswordRequirements
                      ? "Hide"
                      : "Show"
                  }

                  {showPasswordRequirements ? (
                    <ChevronUp
                      size={13}
                    />
                  ) : (
                    <ChevronDown
                      size={13}
                    />
                  )}
                </span>

              </button>


              {/* =================================
                  COLLAPSIBLE REQUIREMENTS
              ================================= */}

              {showPasswordRequirements && (
                <div
                  className="
                    mt-2

                    rounded-[16px]

                    border
                    border-[#ece6ee]

                    bg-[#faf8fb]

                    p-3

                    dark:border-[#302a35]
                    dark:bg-[#151319]
                  "
                >

                  <p
                    className="
                      mb-2

                      text-[10px]
                      font-semibold

                      text-[#746a79]

                      dark:text-[#aaa0b0]
                    "
                  >
                    Your password needs:
                  </p>


                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-2

                      sm:grid-cols-2
                    "
                  >

                    <PasswordRule
                      valid={
                        passwordRules.length
                      }
                      text="8 or more characters"
                    />


                    <PasswordRule
                      valid={
                        passwordRules.uppercase
                      }
                      text="One uppercase letter"
                    />


                    <PasswordRule
                      valid={
                        passwordRules.lowercase
                      }
                      text="One lowercase letter"
                    />


                    <PasswordRule
                      valid={
                        passwordRules.number
                      }
                      text="One number"
                    />


                    <PasswordRule
                      valid={
                        passwordRules.special
                      }
                      text="One special character"
                    />

                  </div>

                </div>
              )}

            </div>


            {/* ==================================
                CONFIRM PASSWORD
            ================================== */}

            <div>

              <label
                htmlFor="confirmPassword"
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
                  strokeWidth={1.8}
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
                  id="confirmPassword"
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

                    if (error) {
                      setError("");
                    }
                  }}
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  disabled={
                    loading
                  }
                  maxLength={128}
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

                    text-[#403747]

                    outline-none

                    transition

                    placeholder:text-[#aaa1ae]

                    focus:border-[#a493ad]
                    focus:ring-4
                    focus:ring-[#eee6f0]

                    disabled:cursor-not-allowed
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
                      (
                        current
                      ) =>
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

                    transition

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
                      strokeWidth={1.8}
                    />
                  ) : (
                    <Eye
                      size={16}
                      strokeWidth={1.8}
                    />
                  )}
                </button>

              </div>


              {/* =================================
                  PASSWORD MATCH STATUS
              ================================= */}

              {confirmPassword.length >
                0 && (
                <div
                  className={`
                    mt-2
                    flex
                    items-center
                    gap-1.5

                    text-[10px]

                    ${
                      passwordsMatch
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-500 dark:text-red-400"
                    }
                  `}
                >

                  {passwordsMatch ? (
                    <Check
                      size={13}
                      strokeWidth={2.4}
                    />
                  ) : (
                    <X
                      size={13}
                      strokeWidth={2.4}
                    />
                  )}

                  {passwordsMatch
                    ? "Passwords match"
                    : "Passwords don't match yet"}

                </div>
              )}

            </div>


            {/* ==================================
                SUBMIT
            ================================== */}

            <button
              type="submit"
              disabled={
                loading ||
                !passwordStrong ||
                password !==
                  confirmPassword
              }
              className="
                mt-2

                flex
                h-12
                w-full

                items-center
                justify-center
                gap-2

                rounded-full

                bg-[#302839]

                text-sm
                font-semibold
                text-white

                transition

                hover:bg-[#40344a]

                disabled:cursor-not-allowed
                disabled:opacity-40

                dark:bg-[#eee8ff]
                dark:text-[#302839]
                dark:hover:bg-white
              "
            >

              {loading ? (
                <>
                  <span
                    className="
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


          {/* ====================================
              FOOTER
          ==================================== */}

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

            max-w-[360px]

            text-center

            text-[10px]
            leading-5

            text-[#aaa0ad]

            dark:text-[#706675]
          "
        >
          No real name. No public identity.
          Just a quiet space for your thoughts.
        </p>

      </div>

    </div>
  );
}


export default Register;