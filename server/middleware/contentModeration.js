// ==========================================
// UNSAID CONTENT MODERATION
// ==========================================
//
// This is a lightweight server-side filter.
// It is NOT a replacement for a professional
// safety/moderation API.
//
// It:
// 1. Censors common profanity.
// 2. Blocks obvious direct threats.
// 3. Leaves normal negative/emotional speech alone.
//


const PROFANITY_WORDS = [
  "fuck",
  "fucking",
  "fucked",
  "motherfucker",
  "shit",
  "bullshit",
  "bitch",
  "bastard",
  "dick",
  "cock",
  "boob",
  "tits",
  "slut",
  "piss",
  "crap",
  "asshole",
    "cunt",
    "whore",
    "porn",

];


// ==========================================
// WORD BOUNDARY REGEX
// ==========================================

const escapeRegex = (
  value
) => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};


// ==========================================
// BUILD PROFANITY REGEX
// ==========================================

const profanityRegex =
  new RegExp(
    `\\b(${PROFANITY_WORDS
      .map(escapeRegex)
      .join("|")})\\b`,
    "gi"
  );


// ==========================================
// THREAT PATTERNS
// ==========================================
//
// Intentionally conservative.
// We do NOT block:
// "I hate everything"
// "I'm so angry"
// "I feel like killing this assignment"
//
// We look for direct threats toward a person.
//
const THREAT_PATTERNS = [
  /\b(i['’]?m going to kill you)\b/i,

  /\b(i am going to kill you)\b/i,

  /\b(i will kill you)\b/i,

  /\b(i['’]?ll kill you)\b/i,

  /\b(i am gonna kill you)\b/i,

  /\b(i['’]?m gonna kill you)\b/i,

  /\b(going to murder you)\b/i,

  /\b(i will murder you)\b/i,

  /\b(i['’]?ll murder you)\b/i,

  /\b(i am going to hurt you)\b/i,

  /\b(i will hurt you)\b/i,

  /\b(i['’]?m going to hurt you)\b/i,

  /\b(i am gonna hurt you)\b/i,

  /\b(i['’]?m gonna hurt you)\b/i,
];


// ==========================================
// NORMALIZE
// ==========================================

const normalizeText = (
  value
) => {
  return String(
    value || ""
  )
    .normalize("NFKC")
    .replace(
      /\s+/g,
      " "
    )
    .trim();
};


// ==========================================
// CHECK THREAT
// ==========================================

const containsDirectThreat =
  (text) => {
    return THREAT_PATTERNS.some(
      (pattern) =>
        pattern.test(text)
    );
  };


// ==========================================
// CENSOR PROFANITY
// ==========================================

const censorProfanity =
  (text) => {
    return text.replace(
      profanityRegex,
      (word) => {
        return "*".repeat(
          Math.max(
            4,
            word.length
          )
        );
      }
    );
  };


// ==========================================
// MODERATE TEXT
// ==========================================

const moderateText =
  (text) => {
    const normalized =
      normalizeText(text);


    if (!normalized) {
      return {
        allowed: true,
        text: "",
        reason: null,
      };
    }


    // --------------------------------------
    // BLOCK DIRECT THREATS
    // --------------------------------------

    if (
      containsDirectThreat(
        normalized
      )
    ) {
      return {
        allowed: false,
        text: normalized,
        reason:
          "direct_threat",
      };
    }


    // --------------------------------------
    // CENSOR PROFANITY
    // --------------------------------------

    const censored =
      censorProfanity(
        normalized
      );


    return {
      allowed: true,
      text: censored,
      reason: null,
    };
  };


// ==========================================
// EXPRESS MIDDLEWARE
// ==========================================

const contentModeration =
  (req, res, next) => {
    try {
      // ------------------------------------
      // ONLY MODERATE REQUEST BODY CONTENT
      // ------------------------------------

      if (
        !req.body ||
        typeof req.body !==
          "object"
      ) {
        return next();
      }


      // ------------------------------------
      // CONTENT FIELD
      // ------------------------------------

      if (
        typeof req.body.content ===
        "string"
      ) {
        const result =
          moderateText(
            req.body.content
          );


        if (!result.allowed) {
          return res.status(422).json({
            message:
              "This content cannot be posted because it contains a direct threat or violent threat toward another person.",

            code:
              "CONTENT_BLOCKED",

            reason:
              result.reason,
          });
        }


        // Replace request content
        // with censored version.
        req.body.content =
          result.text;
      }


      // ------------------------------------
      // TEXT FIELD
      // ------------------------------------

      if (
        typeof req.body.text ===
        "string"
      ) {
        const result =
          moderateText(
            req.body.text
          );


        if (!result.allowed) {
          return res.status(422).json({
            message:
              "This content cannot be posted because it contains a direct threat or violent threat toward another person.",

            code:
              "CONTENT_BLOCKED",

            reason:
              result.reason,
          });
        }


        req.body.text =
          result.text;
      }


      return next();
    } catch (error) {
      console.error(
        "Content moderation error:",
        error
      );


      return res.status(500).json({
        message:
          "Unable to check content right now",
      });
    }
  };


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  moderateText,
  contentModeration,
};