const {
  GoogleGenAI,
} = require("@google/genai");


// ==========================================
// GEMINI CONFIG
// ==========================================

const geminiApiKey =
  process.env.GEMINI_API_KEY;

const MODEL_NAME =
  process.env.GEMINI_MODEL ||
  "gemini-3.5-flash-lite";

const ai =
  geminiApiKey
    ? new GoogleGenAI({
        apiKey: geminiApiKey,
      })
    : null;


// ==========================================
// SYSTEM INSTRUCTION
// ==========================================

const SYSTEM_INSTRUCTION = `
You are Unsaid's premium writing assistant.

Your job is to take a user's rough thought and
turn it into a polished, beautiful, natural,
emotionally engaging piece of writing that the
user would genuinely be proud to post.

The result should feel:

- polished
- elegant
- natural
- emotionally intelligent
- expressive
- confident
- memorable
- human

Think like an excellent writer helping someone
express the exact idea they already have, but much
better.

IMPORTANT RULES:

1. Understand the user's intended meaning first.

2. Fix all grammar, spelling, punctuation,
   capitalization, sentence structure, and awkward
   wording.

3. Improve the flow between ideas.

4. Replace weak or repetitive wording with stronger,
   more natural wording.

5. Make the writing more expressive and emotionally
   engaging.

6. Make ordinary sentences sound thoughtful and
   intentional.

7. You may restructure sentences when it produces
   a significantly better result.

8. You may add elegant transitions when they are
   naturally implied by the original thought.

9. Preserve the user's core meaning.

10. Preserve the user's emotional intention.

11. Do NOT invent facts.

12. Do NOT invent experiences.

13. Do NOT invent major feelings that the user did
    not express.

14. Do NOT turn every thought into poetry.

15. Do NOT use unnecessarily complicated vocabulary.

16. Do NOT make it sound corporate, academic,
    artificial, or like marketing copy.

17. Do NOT make it motivational unless the original
    thought is already motivational.

18. Do NOT make every sentence dramatically longer.

19. Keep roughly the same amount of information,
    but make the expression considerably better.

20. The final result should sound like a talented
    human wrote it naturally, not like an AI edited it.

21. Return ONLY the finished text.

22. Never explain what you changed.

23. Never provide multiple versions.

24. Never put the answer inside quotation marks.

STYLE GOAL:

Do not merely correct the user's sentence.

Rewrite it so the user thinks:

"Yes. That's exactly what I wanted to say,
but I couldn't say it that well."

EXAMPLES:

Input:
college is killing me idk what to do

Output:
College has been exhausting lately, and honestly, I don't know what I'm supposed to do anymore.

Input:
im tired of pretending everything is fine

Output:
I'm tired of pretending everything is fine when, deep down, I know it isn't.

Input:
everyone is moving ahead except me

Output:
It feels like everyone is moving forward while I'm still trying to figure out where I belong.

Input:
i miss talking to her but i dont wanna bother her

Output:
I miss talking to her, but I don't want to reach out and make her feel like she has to respond.

Input:
naruto is one of those characters who starts with almost nothing but still keeps chasing his dream to become hokage. he gets ignored, misunderstood, and loses people he cares about, but he keeps moving forward.

Output:
Naruto is the kind of character who starts with almost nothing, yet continues to chase his dream of becoming Hokage. Even when he's ignored, misunderstood, and forced to lose people he cares about, he keeps moving forward. His journey shows that where you begin doesn't have to define where you end.

Input:
today was actually a good day

Output:
Today was one of those unexpectedly good days that reminds you to appreciate the little things.

Input:
sometimes i just want to disappear for a while and not talk to anyone

Output:
Sometimes, I just want to step away from everything for a while, disappear into my own space, and not have to talk to anyone.

IMPORTANT:

The goal is not to make every sentence fancy.

The goal is to make the user's original thought
feel clearer, more meaningful, more natural, and
more beautiful without losing what made it theirs.
`;


// ==========================================
// CLEAN RESULT
// ==========================================

const cleanResult = (
  result,
  original
) => {
  if (
    typeof result !== "string" ||
    !result.trim()
  ) {
    return original;
  }

  let cleaned =
    result.trim();


  // ----------------------------------------
  // REMOVE COMMON PREFIXES
  // ----------------------------------------

  const prefixes = [
    "improved thought:",
    "improved version:",
    "rewritten thought:",
    "corrected thought:",
    "corrected version:",
    "polished thought:",
    "polished version:",
    "rewrite:",
    "output:",
    "answer:",
    "final version:",
  ];


  const lower =
    cleaned.toLowerCase();


  for (
    const prefix of prefixes
  ) {
    if (
      lower.startsWith(prefix)
    ) {
      cleaned =
        cleaned
          .slice(prefix.length)
          .trim();

      break;
    }
  }


  // ----------------------------------------
  // REMOVE SURROUNDING DOUBLE QUOTES
  // ----------------------------------------

  if (
    cleaned.length >= 2 &&
    cleaned.startsWith('"') &&
    cleaned.endsWith('"')
  ) {
    cleaned =
      cleaned
        .slice(1, -1)
        .trim();
  }


  // ----------------------------------------
  // REMOVE SURROUNDING SINGLE QUOTES
  // ----------------------------------------

  if (
    cleaned.length >= 2 &&
    cleaned.startsWith("'") &&
    cleaned.endsWith("'")
  ) {
    cleaned =
      cleaned
        .slice(1, -1)
        .trim();
  }


  // ----------------------------------------
  // REMOVE MARKDOWN CODE FENCES
  // ----------------------------------------

  if (
    cleaned.startsWith("```") &&
    cleaned.endsWith("```")
  ) {
    cleaned =
      cleaned
        .replace(
          /^```[\w-]*\s*/i,
          ""
        )
        .replace(
          /\s*```$/i,
          ""
        )
        .trim();
  }


  // ----------------------------------------
  // SAFETY FALLBACK
  // ----------------------------------------

  if (!cleaned) {
    return original;
  }


  if (
    cleaned.length > 1000
  ) {
    return original;
  }


  return cleaned;
};


// ==========================================
// IMPROVE THOUGHT
// ==========================================

const improveThought =
  async (req, res) => {
    try {
      // --------------------------------------
      // CHECK GEMINI CONFIG
      // --------------------------------------

      if (!ai) {
        return res.status(500).json({
          message:
            "Gemini API is not configured",
        });
      }


      // --------------------------------------
      // READ CONTENT
      // --------------------------------------

      const content =
        typeof req.body?.content ===
        "string"
          ? req.body.content.trim()
          : "";


      // --------------------------------------
      // VALIDATION
      // --------------------------------------

      if (!content) {
        return res.status(400).json({
          message:
            "Thought cannot be empty",
        });
      }


      if (
        content.length > 1000
      ) {
        return res.status(400).json({
          message:
            "Thought cannot exceed 1000 characters",
        });
      }


      // --------------------------------------
      // GEMINI INTERACTIONS API
      // --------------------------------------

      const interaction =
        await ai.interactions.create({
          model:
            MODEL_NAME,

          system_instruction:
            SYSTEM_INSTRUCTION,

          input:
            `Rewrite the following thought.

Make it:
- polished
- elegant
- natural
- expressive
- emotionally engaging
- easy to read

Fix grammar, spelling, punctuation,
capitalization, sentence structure, and awkward
wording.

Improve the flow and vocabulary where useful.

Keep the exact core meaning and emotional intent.

Do not invent facts, experiences, or major feelings.

Do not make it corporate, academic, motivational,
or unnecessarily poetic.

Do not explain the changes.

Return ONLY the finished version.

TEXT:
${content}`,

          store:
            false,
        });


      // --------------------------------------
      // READ OUTPUT TEXT
      // --------------------------------------

      let result = "";


      if (
        interaction &&
        typeof interaction.output_text ===
          "string"
      ) {
        result =
          interaction.output_text.trim();
      }


      // --------------------------------------
      // FALLBACK: OUTPUTS
      // --------------------------------------

      if (
        !result &&
        interaction &&
        Array.isArray(
          interaction.outputs
        )
      ) {
        for (
          const output of
            interaction.outputs
        ) {
          if (
            typeof output?.text ===
            "string"
          ) {
            result +=
              output.text;
          }


          if (
            Array.isArray(
              output?.content
            )
          ) {
            for (
              const item of
                output.content
            ) {
              if (
                typeof item?.text ===
                "string"
              ) {
                result +=
                  item.text;
              }
            }
          }
        }
      }


      // --------------------------------------
      // FALLBACK: STEPS
      // --------------------------------------

      if (
        !result &&
        interaction &&
        Array.isArray(
          interaction.steps
        )
      ) {
        for (
          const step of
            interaction.steps
        ) {
          if (
            !Array.isArray(
              step?.content
            )
          ) {
            continue;
          }


          for (
            const block of
              step.content
          ) {
            if (
              typeof block?.text ===
              "string"
            ) {
              result +=
                block.text;
            }


            if (
              Array.isArray(
                block?.content
              )
            ) {
              for (
                const nested of
                  block.content
              ) {
                if (
                  typeof nested?.text ===
                  "string"
                ) {
                  result +=
                    nested.text;
                }
              }
            }
          }
        }
      }


      // --------------------------------------
      // CLEAN RESULT
      // --------------------------------------

      const improved =
        cleanResult(
          result,
          content
        );


      return res.json({
        improved,
      });
    } catch (error) {
      console.error(
        "Gemini improve thought error:",
        error
      );


      const status =
        Number(
          error?.status ||
          error?.statusCode ||
          0
        );


      // --------------------------------------
      // RATE LIMIT
      // --------------------------------------

      if (
        status === 429
      ) {
        return res.status(429).json({
          message:
            "AI request limit reached. Please try again later.",
        });
      }


      // --------------------------------------
      // AUTH ERROR
      // --------------------------------------

      if (
        status === 401 ||
        status === 403
      ) {
        return res.status(500).json({
          message:
            "Gemini API authentication failed",
        });
      }


      // --------------------------------------
      // MODEL ERROR
      // --------------------------------------

      if (
        status === 404
      ) {
        return res.status(500).json({
          message:
            `Gemini model "${MODEL_NAME}" is unavailable.`,
        });
      }


      // --------------------------------------
      // INVALID REQUEST
      // --------------------------------------

      if (
        status === 400
      ) {
        return res.status(400).json({
          message:
            error?.message ||
            "Invalid Gemini request",
        });
      }


      // --------------------------------------
      // GENERAL ERROR
      // --------------------------------------

      return res.status(500).json({
        message:
          "AI generation failed",
      });
    }
  };


// ==========================================
// AI HEALTH
// ==========================================

const aiHealth =
  async (req, res) => {
    return res.json({
      status:
        "ok",

      configured:
        Boolean(
          geminiApiKey
        ),

      model:
        MODEL_NAME,
    });
  };


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  improveThought,
  aiHealth,
};