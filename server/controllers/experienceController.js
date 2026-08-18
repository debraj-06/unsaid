const Thought =
  require("../models/Thought");

const {
  similarityScore,
  getCandidateKeywords,
  shortenExperience,
} = require(
  "../utils/experienceMatcher"
);


// ==========================================
// ESCAPE REGEX
// ==========================================

const escapeRegex = (
  value
) => {
  return String(
    value || ""
  ).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};


// ==========================================
// GET EXPERIENCE MATCHES
// ==========================================

const getExperienceMatches =
  async (
    req,
    res
  ) => {
    try {
      const {
        thoughtId,
      } = req.params;


      // ======================================
      // VALIDATE ID
      // ======================================

      if (!thoughtId) {
        return res.status(400).json({
          message:
            "Thought id is required",
        });
      }


      // ======================================
      // GET CURRENT THOUGHT
      // ======================================

      const currentThought =
        await Thought.findById(
          thoughtId
        )
          .select(
            "_id author content createdAt"
          )
          .lean();


      if (!currentThought) {
        return res.status(404).json({
          message:
            "Thought not found",
        });
      }


      if (
        typeof currentThought.content !==
          "string" ||
        !currentThought.content.trim()
      ) {
        return res.json({
          count: 0,
          experiences: [],
        });
      }


      // ======================================
      // FIND KEYWORDS DYNAMICALLY
      // ======================================

      const keywords =
        getCandidateKeywords(
          currentThought.content,
          12
        );


      // ======================================
      // BASE QUERY
      // ======================================

      const baseQuery = {
        _id: {
          $ne:
            currentThought._id,
        },

        author: {
          $ne:
            currentThought.author,
        },

        content: {
          $exists: true,

          $type:
            "string",
        },
      };


      // ======================================
      // GET CANDIDATES
      // ======================================

      let candidates;


      if (
        keywords.length > 0
      ) {
        candidates =
          await Thought.find({
            ...baseQuery,

            $or:
              keywords.map(
                (keyword) => ({
                  content: {
                    $regex:
                      escapeRegex(
                        keyword
                      ),

                    $options:
                      "i",
                  },
                })
              ),
          })
            .select(
              "_id content createdAt"
            )
            .sort({
              createdAt: -1,
            })
            .limit(1500)
            .lean();
      } else {
        candidates =
          await Thought.find(
            baseQuery
          )
            .select(
              "_id content createdAt"
            )
            .sort({
              createdAt: -1,
            })
            .limit(500)
            .lean();
      }


      // ======================================
      // SCORE
      // ======================================

      const scored =
        candidates
          .map(
            (candidate) => ({
              id:
                candidate._id.toString(),

              content:
                candidate.content,

              createdAt:
                candidate.createdAt,

              score:
                similarityScore(
                  currentThought.content,
                  candidate.content
                ),
            })
          )
          .filter(
            (candidate) =>
              candidate.score >=
              0.12
          )
          .sort(
            (a, b) => {
              if (
                b.score !==
                a.score
              ) {
                return (
                  b.score -
                  a.score
                );
              }

              return (
                new Date(
                  b.createdAt
                ).getTime() -
                new Date(
                  a.createdAt
                ).getTime()
              );
            }
          );


      // ======================================
      // REMOVE DUPLICATES
      // ======================================

      const selected = [];


      for (
        const candidate of scored
      ) {
        const duplicate =
          selected.some(
            (existing) =>
              existing.content
                .trim()
                .toLowerCase() ===
              candidate.content
                .trim()
                .toLowerCase()
          );


        if (
          duplicate
        ) {
          continue;
        }


        selected.push(
          candidate
        );


        if (
          selected.length >=
          5
        ) {
          break;
        }
      }


      // ======================================
      // ANONYMOUS RESPONSE
      // ======================================
      //
      // We return the thought ID because the
      // frontend needs it to open the thought.
      //
      // We DO NOT return:
      // - username
      // - author
      // - authorId
      // - profile
      // - followers
      // - likes from the author
      //
      // The ID is only used by the existing
      // authenticated get-thought endpoint.
      // ======================================

      const experiences =
        selected.map(
          (candidate) => ({
            id:
              candidate.id,

            content:
              shortenExperience(
                candidate.content,
                240
              ),

            createdAt:
              candidate.createdAt,
          })
        );


      return res.json({
        count:
          experiences.length,

        experiences,
      });
    } catch (error) {
      console.error(
        "Experience matches error:",
        error
      );


      return res.status(500).json({
        message:
          "Unable to find similar experiences right now",
      });
    }
  };


module.exports = {
  getExperienceMatches,
};