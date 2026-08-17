const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

const User =
  require("../models/User");


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


      if (
        password !==
        confirmPassword
      ) {
        return res.status(400).json({
          message:
            "Passwords do not match",
        });
      }


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


      if (
        password.length <
        8
      ) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters",
        });
      }


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


      const hashedPassword =
        await bcrypt.hash(
          password,
          12
        );


      const user =
        await User.create({
          username:
            normalizedUsername,

          password:
            hashedPassword,
        });


      const token =
        createToken(
          user._id.toString()
        );


      // Keep cookie authentication.
      res.cookie(
        "token",
        token,
        cookieOptions
      );


      // Also return token for
      // browser environments where
      // cookie persistence is unreliable.
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


      const user =
        await User.findOne({
          username:
            normalizedUsername,
        });


      if (!user) {
        return res.status(401).json({
          message:
            "Invalid username or password",
        });
      }


      const passwordMatches =
        await bcrypt.compare(
          password,
          user.password
        );


      if (!passwordMatches) {
        return res.status(401).json({
          message:
            "Invalid username or password",
        });
      }


      const token =
        createToken(
          user._id.toString()
        );


      // Keep cookie for existing
      // Android/desktop behavior.
      res.cookie(
        "token",
        token,
        cookieOptions
      );


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
        httpOnly:
          true,

        sameSite:
          "none",

        secure:
          true,

        path:
          "/",
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
};