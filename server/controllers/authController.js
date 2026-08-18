const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

const User =
  require("../models/User");

const {
  checkLoginAllowed,
  recordFailedLogin,
  clearLoginAttempts,
} = require(
  "../middleware/loginProtection"
);


// ==========================================
// CREATE JWT
// ==========================================

const createToken = (
  userId
) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


// ==========================================
// COOKIE OPTIONS
// ==========================================

const cookieOptions = {
  httpOnly: true,

  sameSite: "none",

  secure: true,

  path: "/",

  maxAge:
    7 *
    24 *
    60 *
    60 *
    1000,
};


// ==========================================
// FORMAT USER
// ==========================================

const formatUser = (
  user
) => {
  return {
    id:
      user._id,

    username:
      user.username,

    createdAt:
      user.createdAt,
  };
};


// ==========================================
// PASSWORD VALIDATION
// ==========================================

const validatePassword = (
  password
) => {
  if (
    typeof password !==
    "string"
  ) {
    return {
      valid: false,

      message:
        "Password is required",
    };
  }


  if (
    password.length < 8
  ) {
    return {
      valid: false,

      message:
        "Password must be at least 8 characters",
    };
  }


  if (
    password.length > 128
  ) {
    return {
      valid: false,

      message:
        "Password cannot exceed 128 characters",
    };
  }


  if (
    !/[A-Z]/.test(
      password
    )
  ) {
    return {
      valid: false,

      message:
        "Password must contain at least one uppercase letter",
    };
  }


  if (
    !/[a-z]/.test(
      password
    )
  ) {
    return {
      valid: false,

      message:
        "Password must contain at least one lowercase letter",
    };
  }


  if (
    !/[0-9]/.test(
      password
    )
  ) {
    return {
      valid: false,

      message:
        "Password must contain at least one number",
    };
  }


  if (
    !/[^A-Za-z0-9]/.test(
      password
    )
  ) {
    return {
      valid: false,

      message:
        "Password must contain at least one special character",
    };
  }


  return {
    valid: true,

    message: null,
  };
};


// ==========================================
// REGISTER
// ==========================================

const register =
  async (
    req,
    res
  ) => {
    try {
      const {
        username,
        password,
        confirmPassword,
      } = req.body;


      // --------------------------------------
      // REQUIRED FIELDS
      // --------------------------------------

      if (
        !username ||
        !password ||
        !confirmPassword
      ) {
        return res.status(400).json({
          message:
            "All fields are required",
        });
      }


      // --------------------------------------
      // PASSWORD MATCH
      // --------------------------------------

      if (
        password !==
        confirmPassword
      ) {
        return res.status(400).json({
          message:
            "Those passwords don't match yet.",
        });
      }


      // --------------------------------------
      // STRONG PASSWORD
      // --------------------------------------

      const passwordValidation =
        validatePassword(
          password
        );


      if (
        !passwordValidation.valid
      ) {
        return res.status(400).json({
          message:
            passwordValidation.message,
        });
      }


      // --------------------------------------
      // USERNAME
      // --------------------------------------

      const normalizedUsername =
        username
          .trim()
          .toLowerCase();


      if (
        !/^[a-zA-Z0-9_]+$/.test(
          normalizedUsername
        )
      ) {
        return res.status(400).json({
          message:
            "Username can only contain letters, numbers and underscores",
        });
      }


      if (
        normalizedUsername.length <
        3
      ) {
        return res.status(400).json({
          message:
            "Username must be at least 3 characters",
        });
      }


      if (
        normalizedUsername.length >
        30
      ) {
        return res.status(400).json({
          message:
            "Username cannot exceed 30 characters",
        });
      }


      // --------------------------------------
      // EXISTING USER
      // --------------------------------------

      const existingUser =
        await User.findOne({
          username:
            normalizedUsername,
        });


      if (existingUser) {
        return res.status(409).json({
          message:
            "Username already exists",
        });
      }


      // --------------------------------------
      // HASH
      // --------------------------------------

      const hashedPassword =
        await bcrypt.hash(
          password,
          12
        );


      // --------------------------------------
      // CREATE USER
      // --------------------------------------

      const user =
        await User.create({
          username:
            normalizedUsername,

          password:
            hashedPassword,
        });


      // --------------------------------------
      // JWT
      // --------------------------------------

      const token =
        createToken(
          user._id.toString()
        );


      // --------------------------------------
      // COOKIE
      // --------------------------------------

      res.cookie(
        "token",
        token,
        cookieOptions
      );


      // --------------------------------------
      // RESPONSE
      // --------------------------------------

      return res.status(201).json({
        token,

        user:
          formatUser(user),
      });
    } catch (error) {
      console.error(
        "Register error:",
        error
      );


      return res.status(500).json({
        message:
          "Something went wrong",
      });
    }
  };


// ==========================================
// LOGIN
// ==========================================

const login =
  async (
    req,
    res
  ) => {
    try {
      const {
        username,
        password,
      } = req.body;


      if (
        !username ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Username and password are required",
        });
      }


      const normalizedUsername =
        username
          .trim()
          .toLowerCase();


      // --------------------------------------
      // LOGIN TIMER / BACKOFF
      // --------------------------------------

      const protection =
        checkLoginAllowed(
          req,
          normalizedUsername
        );


      if (
        !protection.allowed
      ) {
        res.set(
          "Retry-After",
          String(
            protection.retryAfter
          )
        );


        return res.status(429).json({
          message:
            protection.retryAfter >=
            60
              ? `Too many login attempts. Try again in ${Math.ceil(
                  protection.retryAfter /
                    60
                )} minute(s).`
              : `Too many login attempts. Try again in ${protection.retryAfter} second(s).`,

          retryAfter:
            protection.retryAfter,

          code:
            "LOGIN_RATE_LIMITED",
        });
      }


      // --------------------------------------
      // FIND USER
      // --------------------------------------

      const user =
        await User.findOne({
          username:
            normalizedUsername,
        });


      // --------------------------------------
      // INVALID USER
      // --------------------------------------

      if (!user) {
        recordFailedLogin(
          req,
          normalizedUsername
        );


        // Don't reveal whether the
        // username exists.
        return res.status(401).json({
          message:
            "Invalid username or password",
        });
      }


      // --------------------------------------
      // PASSWORD CHECK
      // --------------------------------------

      const passwordMatches =
        await bcrypt.compare(
          password,
          user.password
        );


      // --------------------------------------
      // WRONG PASSWORD
      // --------------------------------------

      if (!passwordMatches) {
        recordFailedLogin(
          req,
          normalizedUsername
        );


        return res.status(401).json({
          message:
            "Invalid username or password",
        });
      }


      // --------------------------------------
      // SUCCESS
      // --------------------------------------

      clearLoginAttempts(
        req,
        normalizedUsername
      );


      const token =
        createToken(
          user._id.toString()
        );


      // --------------------------------------
      // COOKIE
      // --------------------------------------

      res.cookie(
        "token",
        token,
        cookieOptions
      );


      // --------------------------------------
      // RESPONSE
      // --------------------------------------

      return res.json({
        token,

        user:
          formatUser(user),
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );


      return res.status(500).json({
        message:
          "Something went wrong",
      });
    }
  };


// ==========================================
// LOGOUT
// ==========================================

const logout =
  async (
    req,
    res
  ) => {
    res.clearCookie(
      "token",
      {
        httpOnly: true,

        sameSite:
          "none",

        secure:
          true,

        path: "/",
      }
    );


    return res.json({
      message:
        "Logged out",
    });
  };


// ==========================================
// CURRENT USER
// ==========================================

const me =
  async (
    req,
    res
  ) => {
    try {
      const user =
        await User.findById(
          req.userId
        ).select(
          "_id username createdAt"
        );


      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }


      return res.json({
        user:
          formatUser(user),
      });
    } catch (error) {
      console.error(
        "Me error:",
        error
      );


      return res.status(500).json({
        message:
          "Something went wrong",
      });
    }
  };


module.exports = {
  register,
  login,
  logout,
  me,
  validatePassword,
};