const improveThought = async (
  req,
  res
) => {
  try {
    const {
      content,
    } = req.body;

    if (
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        message:
          "Thought cannot be empty",
      });
    }

    const cleanContent =
      content.trim();

    if (
      cleanContent.length >
      1000
    ) {
      return res.status(400).json({
        message:
          "Thought cannot exceed 1000 characters",
      });
    }

    const aiResponse =
      await fetch(
        "http://127.0.0.1:8000/improve-thought",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            content:
              cleanContent,
          }),
        }
      );

    const data =
      await aiResponse.json();

    if (!aiResponse.ok) {
      return res.status(502).json({
        message:
          data.detail ||
          "Unsaid AI service failed",
      });
    }

    return res.json({
      improved:
        data.improved,
    });
  } catch (error) {
    console.error(
      "Improve thought error:",
      error
    );

    return res.status(503).json({
      message:
        "Unsaid AI service is unavailable",
    });
  }
};


module.exports = {
  improveThought,
};