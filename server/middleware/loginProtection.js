// ==========================================
// UNSAID LOGIN PROTECTION
// ==========================================
//
// Protects login from repeated password attempts.
//
// Progressively applies:
// 1. Short delay
// 2. Longer delay
// 3. Temporary lock
//
// NOTE:
// This in-memory version is suitable for development
// and a single server instance.
//
// For multiple production instances, move this
// state to Redis / Render Key Value.
//


const attempts = new Map();


// ==========================================
// CONFIG
// ==========================================

const WINDOW_MS =
  10 * 60 * 1000; // 10 minutes

const MAX_ATTEMPTS =
  5;

const LOCKOUT_MS =
  5 * 60 * 1000; // 5 minutes


// ==========================================
// CLEAN OLD DATA
// ==========================================

const cleanupEntry = (
  entry
) => {
  if (!entry) {
    return;
  }

  if (
    entry.lockedUntil &&
    entry.lockedUntil <=
      Date.now()
  ) {
    attempts.delete(
      entry.key
    );

    return;
  }

  if (
    entry.windowStartedAt &&
    Date.now() -
        entry.windowStartedAt >
      WINDOW_MS
  ) {
    attempts.delete(
      entry.key
    );
  }
};


// ==========================================
// GET CLIENT KEY
// ==========================================
//
// Combines IP + username so an attacker
// cannot easily affect every account.
//


const getLoginKey = (
  req,
  username
) => {
  const forwarded =
    req.headers[
      "x-forwarded-for"
    ];

  const ip =
    typeof forwarded ===
      "string"
      ? forwarded
          .split(",")[0]
          .trim()
      : req.ip ||
        req.socket
          ?.remoteAddress ||
        "unknown";


  const normalizedUsername =
    String(
      username || ""
    )
      .trim()
      .toLowerCase();


  return `${ip}:${normalizedUsername}`;
};


// ==========================================
// BEFORE LOGIN
// ==========================================

const checkLoginAllowed = (
  req,
  username
) => {
  const key =
    getLoginKey(
      req,
      username
    );


  let entry =
    attempts.get(
      key
    );


  if (!entry) {
    entry = {
      key,

      failures: 0,

      windowStartedAt:
        Date.now(),

      lockedUntil:
        null,

      nextAllowedAt:
        0,
    };

    attempts.set(
      key,
      entry
    );
  }


  cleanupEntry(
    entry
  );


  entry =
    attempts.get(
      key
    );


  if (!entry) {
    return {
      allowed: true,
      retryAfter: 0,
    };
  }


  // ----------------------------------------
  // LOCKED
  // ----------------------------------------

  if (
    entry.lockedUntil &&
    entry.lockedUntil >
      Date.now()
  ) {
    return {
      allowed: false,

      retryAfter:
        Math.ceil(
          (
            entry.lockedUntil -
            Date.now()
          ) / 1000
        ),
    };
  }


  // ----------------------------------------
  // PROGRESSIVE DELAY
  // ----------------------------------------

  if (
    entry.nextAllowedAt >
    Date.now()
  ) {
    return {
      allowed: false,

      retryAfter:
        Math.ceil(
          (
            entry.nextAllowedAt -
            Date.now()
          ) / 1000
        ),
    };
  }


  return {
    allowed: true,

    retryAfter: 0,
  };
};


// ==========================================
// RECORD FAILED LOGIN
// ==========================================

const recordFailedLogin = (
  req,
  username
) => {
  const key =
    getLoginKey(
      req,
      username
    );


  let entry =
    attempts.get(
      key
    );


  if (!entry) {
    entry = {
      key,

      failures: 0,

      windowStartedAt:
        Date.now(),

      lockedUntil:
        null,

      nextAllowedAt:
        0,
    };

    attempts.set(
      key,
      entry
    );
  }


  cleanupEntry(
    entry
  );


  entry =
    attempts.get(
      key
    );


  if (!entry) {
    return;
  }


  entry.failures += 1;


  // ----------------------------------------
  // PROGRESSIVE DELAY
  // ----------------------------------------
  //
  // 1st failure -> 0s
  // 2nd failure -> 2s
  // 3rd failure -> 5s
  // 4th failure -> 10s
  // 5th failure -> 30s
  //

  const delays = [
    0,
    2,
    5,
    10,
    30,
  ];


  const delayIndex =
    Math.min(
      entry.failures - 1,
      delays.length - 1
    );


  const delaySeconds =
    delays[
      delayIndex
    ];


  entry.nextAllowedAt =
    Date.now() +
    delaySeconds *
      1000;


  // ----------------------------------------
  // LOCK AFTER MAX ATTEMPTS
  // ----------------------------------------

  if (
    entry.failures >=
    MAX_ATTEMPTS
  ) {
    entry.lockedUntil =
      Date.now() +
      LOCKOUT_MS;

    entry.nextAllowedAt =
      entry.lockedUntil;
  }
};


// ==========================================
// SUCCESSFUL LOGIN
// ==========================================

const clearLoginAttempts = (
  req,
  username
) => {
  const key =
    getLoginKey(
      req,
      username
    );


  attempts.delete(
    key
  );
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  checkLoginAllowed,
  recordFailedLogin,
  clearLoginAttempts,
};