const jwt =
  require("jsonwebtoken");


const authMiddleware =
  (req, res, next) => {
    try {
      let token = null;


      // ======================================
      // TRY COOKIE FIRST
      // ======================================

      if (
        req.cookies &&
        req.cookies.token
      ) {
        token =
          req.cookies.token;
      }


      // ======================================
      // TRY AUTHORIZATION HEADER
      // ======================================

      if (!token) {
        const authHeader =
          req.headers.authorization;


        if (
          typeof authHeader ===
            "string" &&
          authHeader.startsWith(
            "Bearer "
          )
        ) {
          token =
            authHeader.slice(
              7
            ).trim();
        }
      }


      // ======================================
      // NO TOKEN
      // ======================================

      if (!token) {
        return res.status(401).json({
          message:
            "Authentication required",
        });
      }


      // ======================================
      // VERIFY
      // ======================================

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );


      if (
        !decoded ||
        !decoded.userId
      ) {
        return res.status(401).json({
          message:
            "Invalid authentication token",
        });
      }


      req.userId =
        decoded.userId;


      return next();
    } catch (error) {
      console.error(
        "Auth middleware error:",
        error
      );


      return res.status(401).json({
        message:
          "Invalid or expired session",
      });
    }
  };


module.exports =
  authMiddleware;