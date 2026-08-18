const CourtCase =
  require("../models/CourtCase");

const CourtVote =
  require("../models/CourtVote");


// ==========================================
// CONSTANTS
// ==========================================

const DECISIONS = [
  "right",
  "wrong",
  "both_wrong",
  "not_enough_info",
];

const COURT_DURATION_MS =
  24 * 60 * 60 * 1000;


// ==========================================
// FORMAT PUBLIC CASE
// ==========================================

const formatCase =
  async (
    courtCase,
    userId
  ) => {
    const [
      voteCount,
      rightCount,
      wrongCount,
      bothWrongCount,
      notEnoughInfoCount,
      myVote,
    ] = await Promise.all([
      CourtVote.countDocuments({
        courtCase:
          courtCase._id,
      }),

      CourtVote.countDocuments({
        courtCase:
          courtCase._id,

        decision:
          "right",
      }),

      CourtVote.countDocuments({
        courtCase:
          courtCase._id,

        decision:
          "wrong",
      }),

      CourtVote.countDocuments({
        courtCase:
          courtCase._id,

        decision:
          "both_wrong",
      }),

      CourtVote.countDocuments({
        courtCase:
          courtCase._id,

        decision:
          "not_enough_info",
      }),

      CourtVote.findOne({
        courtCase:
          courtCase._id,

        voter:
          userId,
      })
        .select(
          "decision reasoning"
        )
        .lean(),
    ]);


    const isOwner =
      courtCase.author.toString() ===
      userId.toString();


    return {
      id:
        courtCase._id.toString(),

      situation:
        courtCase.situation,

      status:
        courtCase.closesAt <=
        new Date()
          ? "closed"
          : courtCase.status,

      closesAt:
        courtCase.closesAt,

      createdAt:
        courtCase.createdAt,

      voteCount,

      results: {
        right:
          rightCount,

        wrong:
          wrongCount,

        bothWrong:
          bothWrongCount,

        notEnoughInfo:
          notEnoughInfoCount,
      },

      hasVoted:
        Boolean(myVote),

      myVote: myVote
        ? {
            decision:
              myVote.decision,

            reasoning:
              myVote.reasoning || "",
          }
        : null,

      // We can expose owner status
      // to the current authenticated user,
      // but never expose the owner's identity.
      isOwner,
    };
  };


// ==========================================
// CREATE COURT CASE
// ==========================================

const createCourtCase =
  async (
    req,
    res
  ) => {
    try {
      const {
        situation,
      } = req.body;


      if (
        typeof situation !==
        "string"
      ) {
        return res.status(400).json({
          message:
            "Situation is required",
        });
      }


      const cleanSituation =
        situation.trim();


      if (
        cleanSituation.length <
        20
      ) {
        return res.status(400).json({
          message:
            "Your situation needs at least 20 characters",
        });
      }


      if (
        cleanSituation.length >
        1000
      ) {
        return res.status(400).json({
          message:
            "Situation cannot exceed 1000 characters",
        });
      }


      const closesAt =
        new Date(
          Date.now() +
            COURT_DURATION_MS
        );


      const courtCase =
        await CourtCase.create({
          author:
            req.userId,

          situation:
            cleanSituation,

          status:
            "open",

          closesAt,
        });


      return res.status(201).json({
        courtCase:
          await formatCase(
            courtCase,
            req.userId
          ),
      });
    } catch (error) {
      console.error(
        "Create court case error:",
        error
      );


      return res.status(500).json({
        message:
          "Unable to create court case",
      });
    }
  };


// ==========================================
// GET OPEN COURT CASES
// ==========================================

const getOpenCourtCases =
  async (
    req,
    res
  ) => {
    try {
      const now =
        new Date();


      const cases =
        await CourtCase.find({
          status:
            "open",

          closesAt: {
            $gt:
              now,
          },

          // Do not show your own case in
          // the public court feed.
          author: {
            $ne:
              req.userId,
          },
        })
          .sort({
            createdAt: -1,
          })
          .limit(30)
          .lean();


      const formatted =
        await Promise.all(
          cases.map(
            (courtCase) =>
              formatCase(
                courtCase,
                req.userId
              )
          )
        );


      return res.json({
        cases:
          formatted,
      });
    } catch (error) {
      console.error(
        "Get open court cases error:",
        error
      );


      return res.status(500).json({
        message:
          "Unable to load court cases",
      });
    }
  };


// ==========================================
// GET ONE COURT CASE
// ==========================================

const getCourtCase =
  async (
    req,
    res
  ) => {
    try {
      const {
        id,
      } = req.params;


      const courtCase =
        await CourtCase.findById(
          id
        ).lean();


      if (!courtCase) {
        return res.status(404).json({
          message:
            "Court case not found",
        });
      }


      return res.json({
        courtCase:
          await formatCase(
            courtCase,
            req.userId
          ),
      });
    } catch (error) {
      console.error(
        "Get court case error:",
        error
      );


      return res.status(500).json({
        message:
          "Unable to load court case",
      });
    }
  };


// ==========================================
// VOTE
// ==========================================

const voteOnCourtCase =
  async (
    req,
    res
  ) => {
    try {
      const {
        id,
      } = req.params;


      const {
        decision,
        reasoning = "",
      } = req.body;


      // --------------------------------------
      // DECISION
      // --------------------------------------

      if (
        !DECISIONS.includes(
          decision
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid court decision",
        });
      }


      // --------------------------------------
      // REASONING
      // --------------------------------------

      if (
        typeof reasoning !==
        "string"
      ) {
        return res.status(400).json({
          message:
            "Reasoning must be text",
        });
      }


      const cleanReasoning =
        reasoning.trim();


      if (
        cleanReasoning.length >
        500
      ) {
        return res.status(400).json({
          message:
            "Reasoning cannot exceed 500 characters",
        });
      }


      // --------------------------------------
      // CASE
      // --------------------------------------

      const courtCase =
        await CourtCase.findById(
          id
        );


      if (!courtCase) {
        return res.status(404).json({
          message:
            "Court case not found",
        });
      }


      // --------------------------------------
      // OWNER CANNOT VOTE
      // --------------------------------------

      if (
        courtCase.author.toString() ===
        req.userId.toString()
      ) {
        return res.status(403).json({
          message:
            "You cannot vote on your own case",
        });
      }


      // --------------------------------------
      // CLOSE EXPIRED CASE
      // --------------------------------------

      if (
        courtCase.closesAt <=
        new Date()
      ) {
        courtCase.status =
          "closed";

        await courtCase.save();


        return res.status(410).json({
          message:
            "Voting on this case has ended",
        });
      }


      // --------------------------------------
      // CHECK EXISTING VOTE
      // --------------------------------------

      const existingVote =
        await CourtVote.findOne({
          courtCase:
            courtCase._id,

          voter:
            req.userId,
        });


      if (existingVote) {
        return res.status(409).json({
          message:
            "You have already voted on this case",
        });
      }


      // --------------------------------------
      // CREATE VOTE
      // --------------------------------------

      try {
        await CourtVote.create({
          courtCase:
            courtCase._id,

          voter:
            req.userId,

          decision,

          reasoning:
            cleanReasoning,
        });
      } catch (error) {
        // Handles MongoDB unique-index
        // race conditions cleanly.
        if (
          error?.code ===
          11000
        ) {
          return res.status(409).json({
            message:
              "You have already voted on this case",
          });
        }

        throw error;
      }


      // --------------------------------------
      // RESPONSE
      // --------------------------------------

      const updatedCase =
        await CourtCase.findById(
          courtCase._id
        ).lean();


      return res.status(201).json({
        courtCase:
          await formatCase(
            updatedCase,
            req.userId
          ),
      });
    } catch (error) {
      console.error(
        "Vote on court case error:",
        error
      );


      return res.status(500).json({
        message:
          "Unable to record your vote",
      });
    }
  };


// ==========================================
// GET MY COURT CASES
// ==========================================

const getMyCourtCases =
  async (
    req,
    res
  ) => {
    try {
      const cases =
        await CourtCase.find({
          author:
            req.userId,
        })
          .sort({
            createdAt: -1,
          })
          .limit(50)
          .lean();


      const formatted =
        await Promise.all(
          cases.map(
            (courtCase) =>
              formatCase(
                courtCase,
                req.userId
              )
          )
        );


      return res.json({
        cases:
          formatted,
      });
    } catch (error) {
      console.error(
        "Get my court cases error:",
        error
      );


      return res.status(500).json({
        message:
          "Unable to load your court cases",
      });
    }
  };


module.exports = {
  createCourtCase,
  getOpenCourtCases,
  getCourtCase,
  voteOnCourtCase,
  getMyCourtCases,
};