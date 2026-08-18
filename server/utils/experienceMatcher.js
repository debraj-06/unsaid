// ==========================================
// DYNAMIC EXPERIENCE MATCHER
// ==========================================
//
// This matcher works from the actual thought text.
//
// It does NOT use:
// - hardcoded examples
// - hardcoded topic categories
// - static users
//
// It dynamically:
// 1. extracts meaningful words from the current thought
// 2. fetches candidate thoughts from MongoDB
// 3. compares word overlap
// 4. compares phrase overlap
// 5. ranks the best matches
//
// Later, this can be upgraded to embeddings without
// changing the frontend API.
//


// ==========================================
// STOP WORDS
// ==========================================

const STOP_WORDS = new Set([
  "a",
  "about",
  "after",
  "again",
  "all",
  "also",
  "am",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "but",
  "by",
  "can",
  "could",
  "did",
  "do",
  "does",
  "doing",
  "for",
  "from",
  "had",
  "has",
  "have",
  "having",
  "he",
  "her",
  "here",
  "hers",
  "him",
  "his",
  "how",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "just",
  "me",
  "more",
  "most",
  "my",
  "myself",
  "no",
  "not",
  "of",
  "on",
  "one",
  "or",
  "our",
  "ours",
  "ourselves",
  "out",
  "same",
  "she",
  "should",
  "so",
  "some",
  "such",
  "than",
  "that",
  "the",
  "their",
  "theirs",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "up",
  "very",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "who",
  "whom",
  "why",
  "will",
  "with",
  "would",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
]);


// ==========================================
// NORMALIZE
// ==========================================

const normalizeText = (
  text
) => {
  return String(
    text || ""
  )
    .toLowerCase()
    .normalize("NFKC")
    .replace(
      /https?:\/\/\S+/gi,
      " "
    )
    .replace(
      /[@#][a-z0-9_]+/gi,
      " "
    )
    .replace(
      /[^a-z0-9\s']/gi,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
};


// ==========================================
// WORDS
// ==========================================

const getWords = (
  text
) => {
  const normalized =
    normalizeText(
      text
    );

  return normalized
    .split(" ")
    .map(
      (word) =>
        word.trim()
    )
    .filter(
      (word) =>
        word.length >= 3 &&
        !STOP_WORDS.has(
          word
        )
    );
};


// ==========================================
// UNIQUE WORD SET
// ==========================================

const getWordSet = (
  text
) => {
  return new Set(
    getWords(text)
  );
};


// ==========================================
// PHRASES
// ==========================================
//
// Generates 2-word and 3-word phrases.
//
// Example:
//
// "I feel stuck in life"
//
// becomes:
//
// feel stuck
// stuck life
//
// This helps distinguish:
//
// "I feel stuck in life"
//
// from:
//
// "I feel happy today"
//

const getPhrases = (
  text
) => {
  const words =
    getWords(
      text
    );

  const phrases =
    new Set();


  for (
    let i = 0;
    i < words.length - 1;
    i++
  ) {
    phrases.add(
      `${words[i]} ${words[i + 1]}`
    );
  }


  for (
    let i = 0;
    i < words.length - 2;
    i++
  ) {
    phrases.add(
      `${words[i]} ${words[i + 1]} ${words[i + 2]}`
    );
  }


  return phrases;
};


// ==========================================
// OVERLAP
// ==========================================

const overlapScore = (
  firstSet,
  secondSet
) => {
  if (
    firstSet.size === 0 ||
    secondSet.size === 0
  ) {
    return 0;
  }


  let matches = 0;


  for (
    const value of firstSet
  ) {
    if (
      secondSet.has(value)
    ) {
      matches += 1;
    }
  }


  if (
    matches === 0
  ) {
    return 0;
  }


  // Similarity relative to the user's
  // current thought, not the candidate.
  return (
    matches /
    firstSet.size
  );
};


// ==========================================
// SCORE
// ==========================================

const similarityScore = (
  sourceText,
  candidateText
) => {
  const sourceWords =
    getWordSet(
      sourceText
    );

  const candidateWords =
    getWordSet(
      candidateText
    );


  const sourcePhrases =
    getPhrases(
      sourceText
    );

  const candidatePhrases =
    getPhrases(
      candidateText
    );


  const wordScore =
    overlapScore(
      sourceWords,
      candidateWords
    );


  const phraseScore =
    overlapScore(
      sourcePhrases,
      candidatePhrases
    );


  // Phrase matches are stronger signals.
  return (
    wordScore * 0.65 +
    phraseScore * 0.35
  );
};


// ==========================================
// CANDIDATE KEYWORDS
// ==========================================
//
// Used to avoid comparing against every thought
// in the database when the database becomes large.
//
// The candidate query is generated from the user's
// actual thought.
// ==========================================

const getCandidateKeywords = (
  text,
  maximum = 12
) => {
  const words =
    getWords(
      text
    );


  const frequency =
    new Map();


  for (
    const word of words
  ) {
    frequency.set(
      word,
      (frequency.get(word) || 0) + 1
    );
  }


  return [
    ...frequency.entries(),
  ]
    .sort(
      (a, b) =>
        b[1] - a[1]
    )
    .slice(
      0,
      maximum
    )
    .map(
      ([word]) =>
        word
    );
};


// ==========================================
// CLEAN RESPONSE TEXT
// ==========================================

const shortenExperience = (
  text,
  maximum = 240
) => {
  const clean =
    String(
      text || ""
    ).trim();


  if (
    clean.length <=
    maximum
  ) {
    return clean;
  }


  return (
    clean
      .slice(
        0,
        maximum
      )
      .trimEnd() +
    "..."
  );
};


module.exports = {
  normalizeText,
  getWords,
  getWordSet,
  getPhrases,
  similarityScore,
  getCandidateKeywords,
  shortenExperience,
};