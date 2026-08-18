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
// FIND ANONYMOUS EXPERIENCES
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
      // VALIDATE THOUGHT
      // ======================================

      if (!thoughtId) {
        return res.status(400).json({
          message:
            "Thought id is required",
        });
      }


      // ======================================
      // CURRENT THOUGHT
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
      // BUILD DYNAMIC SEARCH TERMS
      // ======================================

      const keywords =
        getCandidateKeywords(
          currentThought.content,
          12
        );


      // ======================================
      // BASE QUERY
      // ======================================
      //
      // IMPORTANT:
      // We exclude:
      //
      // 1. Current thought
      // 2. Current author
      //
      // Therefore users cannot get their own
      // thought back as a "resonance".
      //
      // We intentionally DON'T populate author.
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
          $type: "string",
        },
      };


      // ======================================
      // DYNAMIC CANDIDATE QUERY
      // ======================================
      //
      // If meaningful words exist, search for
      // thoughts containing those actual words.
      //
      // If there aren't enough words, fall back
      // to recent thoughts.
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
                      keyword.replace(
                        /[.*+?^${}()|[\]\\]/g,
                        "\\$&"
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
      // SCORE CANDIDATES
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
      // REMOVE VERY SIMILAR DUPLICATES
      // ======================================

      const selected = [];


      for (
        const candidate of scored
      ) {
        const duplicate =
          selected.some(
            (existing) =>
              existing.content
                .toLowerCase()
                .trim() ===
              candidate.content
                .toLowerCase()
                .trim()
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
      // RETURN ANONYMOUS RESULTS
      // ======================================
      //
      // NEVER expose:
      //
      // username
      // author
      // user id
      // profile
      // follower data
      // exact similarity score
      //
      // This is intentional.
      // ======================================

      const experiences =
        selected.map(
          (candidate) => ({
            content:
              shortenExperience(
                candidate.content
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