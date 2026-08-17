// ==========================================
// UNSAID CONTENT MODERATION
// ==========================================
//
// Lightweight server-side moderation.
//
// 1. Censors common profanity.
// 2. Censors explicit sexual/vulgar terms.
// 3. Blocks obvious violent/threatening content.
// 4. Preserves normal emotional language.
//
// NOTE:
// This is a rule-based filter, not a complete
// AI moderation system.
//


const PROFANITY_WORDS = [
  // ========================================
  // GENERAL PROFANITY
  // ========================================

  "fuck",
  "fucks",
  "fucked",
  "fucker",
  "fuckers",
  "fucking",
  "fuckin",
  "motherfuck",
  "motherfucker",
  "motherfuckers",
  "motherfucking",

  "shit",
  "shits",
  "shitty",
  "shithead",
  "shitheads",
  "bullshit",
  "bullshitter",

  "damn",
  "damned",
  "goddamn",
  "goddamned",

  "crap",
  "crappy",

  "asshole",
  "assholes",
  "dumbass",
  "jackass",
  "smartass",
  "asshat",
  "asswipe",
  "kickass",
  "badass",

  "bastard",
  "bastards",

  "bitch",
  "bitches",
  "bitchy",
  "bitching",

  "dick",
  "dicks",
  "dickhead",
  "dickheads",

  "cock",
  "cocks",

  "piss",
  "pissed",
  "pissing",

  "cunt",
  "cunts",

  "prick",
  "pricks",

  "twat",
  "twats",

  "wanker",
  "wankers",
  "wank",

  "tosser",
  "tossers",

  "douche",
  "douches",
  "douchebag",
  "douchebags",

  "scumbag",
  "scumbags",

  "jerkoff",
  "jerkoffs",

  "fuckface",
  "fuckfaces",
  "fuckhead",
  "fuckheads",
  "fuckwit",
  "fuckwits",

  "shitface",
  "shitfaces",

  "dipshit",
  "dipshits",

  "sonofabitch",
  "sonofabitches",


  // ========================================
  // SEXUAL / EXPLICIT
  // ========================================

  "boob",
  "boobs",
  "boobies",

  "tit",
  "tits",
  "titties",

  "nipple",
  "nipples",

  "slut",
  "sluts",
  "slutty",

  "whore",
  "whores",

  "hoe",
  "hoes",

  "skank",
  "skanks",

  "prostitute",
  "prostitutes",

  "porn",
  "porno",
  "pornography",
  "pornographic",

  "horny",

  "orgasm",
  "orgasms",

  "masturbate",
  "masturbates",
  "masturbating",
  "masturbation",

  "erection",
  "erections",

  "penis",
  "vagina",
  "vulva",
  "clitoris",

  "cum",
  "cumming",

  "semen",


  // ========================================
  // INSULTS
  // ========================================

  "idiot",
  "idiots",

  "moron",
  "morons",

  "stupid",

  "imbecile",
  "imbeciles",

  "loser",
  "losers",

  "retard",
  "retarded",
];


// ==========================================
// VIOLENT / THREAT TERMS
// ==========================================
//
// These are handled separately from profanity.
//
// We do NOT simply block words such as "kill"
// everywhere because:
// "this assignment is killing me"
// should normally be allowed.
//
// These words are used for short/direct
// violent statements or combined with context.
//


const VIOLENT_TERMS = [
  "kill",
  "killing",
  "killed",

  "murder",
  "murdering",
  "murdered",

  "assassinate",
  "assassination",

  "execute",

  "stab",
  "stabbing",
  "stabbed",

  "shoot",
  "shooting",
  "shot",

  "strangle",
  "strangling",
  "strangled",

  "choke",
  "choking",
  "choked",

  "beat",
  "beating",
  "beaten",

  "attack",
  "attacking",
  "attacked",

  "rape",
  "raping",
  "raped",

  "torture",
  "torturing",
  "tortured",

  "bomb",
  "bombing",
  "explode",
  "explosion",
];


// ==========================================
// THREAT PATTERNS
// ==========================================
//
// These target direct statements toward people.
//


const THREAT_PATTERNS = [
  // Kill
  /\b(i['’]?m going to kill you)\b/i,
  /\b(i am going to kill you)\b/i,
  /\b(i will kill you)\b/i,
  /\b(i['’]?ll kill you)\b/i,
  /\b(i am gonna kill you)\b/i,
  /\b(i['’]?m gonna kill you)\b/i,

  // Murder
  /\b(i['’]?m going to murder you)\b/i,
  /\b(i am going to murder you)\b/i,
  /\b(i will murder you)\b/i,
  /\b(i['’]?ll murder you)\b/i,

  // Hurt
  /\b(i['’]?m going to hurt you)\b/i,
  /\b(i am going to hurt you)\b/i,
  /\b(i will hurt you)\b/i,
  /\b(i['’]?ll hurt you)\b/i,
  /\b(i am gonna hurt you)\b/i,
  /\b(i['’]?m gonna hurt you)\b/i,

  // Attack
  /\b(i['’]?m going to attack you)\b/i,
  /\b(i am going to attack you)\b/i,
  /\b(i will attack you)\b/i,
  /\b(i['’]?ll attack you)\b/i,

  // Shoot
  /\b(i['’]?m going to shoot you)\b/i,
  /\b(i am going to shoot you)\b/i,
  /\b(i will shoot you)\b/i,
  /\b(i['’]?ll shoot you)\b/i,

  // Stab
  /\b(i['’]?m going to stab you)\b/i,
  /\b(i am going to stab you)\b/i,
  /\b(i will stab you)\b/i,
  /\b(i['’]?ll stab you)\b/i,
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
// PROFANITY REGEX
// ==========================================

const profanityRegex =
  new RegExp(
    `\\b(${PROFANITY_WORDS
      .map(escapeRegex)
      .join("|")})\\b`,
    "gi"
  );


// ==========================================
// VIOLENT TERM REGEX
// ==========================================

const violentTermRegex =
  new RegExp(
    `\\b(${VIOLENT_TERMS
      .map(escapeRegex)
      .join("|")})\\b`,
    "gi"
  );


// ==========================================
// NORMALIZE TEXT
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
// CHECK DIRECT THREAT
// ==========================================

const containsDirectThreat =
  (text) => {
    return THREAT_PATTERNS.some(
      (pattern) =>
        pattern.test(text)
    );
  };


// ==========================================
// CHECK SHORT VIOLENT STATEMENT
// ==========================================
//
// This catches messages like:
// "kill"
// "murder him"
// "shoot her"
// "stab him"
//
// but avoids blocking:
// "this exam is killing me"
// "this movie killed me"
//


const containsContextualViolence =
  (text) => {
    const lower =
      text.toLowerCase();


    // Very short violent input.
    if (
      lower.length <=
      40
    ) {
      if (
        violentTermRegex.test(
          lower
        )
      ) {
        return true;
      }
    }


    // Direct object patterns.
    const directViolencePatterns = [
      /\b(kill|murder|shoot|stab|strangle|choke|attack)\s+(him|her|them|you|someone|somebody)\b/i,

      /\b(kill|murder|shoot|stab|strangle|choke|attack)\s+(this|that)\s+(person|guy|girl|man|woman)\b/i,

      /\b(make|made|making)\s+(him|her|them)\s+(die|dead)\b/i,
    ];


    return directViolencePatterns.some(
      (pattern) =>
        pattern.test(
          lower
        )
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
      normalizeText(
        text
      );


    if (!normalized) {
      return {
        allowed: true,
        text: "",
        reason: null,
      };
    }


    // ========================================
    // DIRECT THREAT
    // ========================================

    if (
      containsDirectThreat(
        normalized
      )
    ) {
      return {
        allowed: false,

        text:
          normalized,

        reason:
          "direct_threat",
      };
    }


    // ========================================
    // CONTEXTUAL VIOLENCE
    // ========================================

    if (
      containsContextualViolence(
        normalized
      )
    ) {
      return {
        allowed: false,

        text:
          normalized,

        reason:
          "violent_content",
      };
    }


    // ========================================
    // CENSOR PROFANITY
    // ========================================

    const censored =
      censorProfanity(
        normalized
      );


    return {
      allowed: true,

      text:
        censored,

      reason:
        null,
    };
  };


// ==========================================
// EXPRESS MIDDLEWARE
// ==========================================

const contentModeration =
  (req, res, next) => {
    try {
      // ------------------------------------
      // NO BODY
      // ------------------------------------

      if (
        !req.body ||
        typeof req.body !==
          "object"
      ) {
        return next();
      }


      // ====================================
      // CONTENT
      // ====================================

      if (
        typeof req.body.content ===
        "string"
      ) {
        const result =
          moderateText(
            req.body.content
          );


        if (
          !result.allowed
        ) {
          return res.status(
            422
          ).json({
            message:
              "This content can't be posted because it contains prohibited or threatening content.",

            code:
              "CONTENT_BLOCKED",

            reason:
              result.reason,
          });
        }


        req.body.content =
          result.text;
      }


      // ====================================
      // TEXT
      // ====================================

      if (
        typeof req.body.text ===
        "string"
      ) {
        const result =
          moderateText(
            req.body.text
          );


        if (
          !result.allowed
        ) {
          return res.status(
            422
          ).json({
            message:
              "This content can't be posted because it contains prohibited or threatening content.",

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


      return res.status(
        500
      ).json({
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