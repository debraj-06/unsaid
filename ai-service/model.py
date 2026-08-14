import os

from huggingface_hub import InferenceClient


# ==========================================
# CONFIG
# ==========================================

MODEL_NAME = os.getenv(
    "HF_MODEL",
    "HuggingFaceTB/SmolLM2-135M-Instruct",
)

HF_TOKEN = os.getenv("HF_TOKEN")


# ==========================================
# HUGGING FACE CLIENT
# ==========================================

client = InferenceClient(
    api_key=HF_TOKEN,
)


# ==========================================
# SYSTEM PROMPT
# ==========================================

SYSTEM_PROMPT = """
You are Unsaid's writing assistant.

Your ONLY job is to lightly improve a user's
thought before they post it.

IMPORTANT RULES:

1. Preserve the EXACT meaning.
2. Preserve the original emotion.
3. Preserve the user's personality and tone.
4. Make only necessary changes.
5. Fix grammar, spelling, punctuation,
   capitalization, abbreviations, and awkward
   wording when necessary.
6. Keep the original wording whenever it is
   already clear.
7. Do NOT reinterpret the thought.
8. Do NOT add facts, opinions, or assumptions.
9. Do NOT remove important emotional meaning.
10. Do NOT make the thought motivational.
11. Do NOT make it corporate or formal.
12. Do NOT make it sound like an essay.
13. Do NOT explain your changes.
14. Do NOT add quotation marks.
15. Return ONLY the improved thought.

Example:

Input:
college is killing me idk what to do

Output:
College is killing me. I don't know what to do.

Input:
im so tired of pretending everything is fine

Output:
I'm so tired of pretending everything is fine.

Input:
everyone is moving ahead except me

Output:
Everyone is moving ahead except me.

Input:
idk why i keep overthinking everything

Output:
I don't know why I keep overthinking everything.
"""


# ==========================================
# CLEAN RESULT
# ==========================================

def clean_result(
    result: str,
    original: str,
) -> str:
    if not result:
        return original

    cleaned = result.strip()

    unwanted_prefixes = [
        "improved thought:",
        "improved version:",
        "rewritten thought:",
        "rewrite:",
        "output:",
    ]

    lower_result = cleaned.lower()

    for prefix in unwanted_prefixes:
        if lower_result.startswith(prefix):
            cleaned = cleaned[len(prefix):].strip()
            break

    # Remove accidental quotes.
    if len(cleaned) >= 2:
        if (
            cleaned.startswith('"')
            and cleaned.endswith('"')
        ):
            cleaned = cleaned[1:-1].strip()

        elif (
            cleaned.startswith("'")
            and cleaned.endswith("'")
        ):
            cleaned = cleaned[1:-1].strip()

    if not cleaned:
        return original

    if len(cleaned) > 1000:
        return original

    return cleaned


# ==========================================
# IMPROVE THOUGHT
# ==========================================

def improve_thought(
    text: str,
) -> str:
    original = (
        text.strip()
        if isinstance(text, str)
        else ""
    )

    if not original:
        return original

    original = original[:1000]

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT,
        },
        {
            "role": "user",
            "content": (
                "Improve this thought "
                "with minimal changes:\n\n"
                + original
            ),
        },
    ]

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            max_tokens=80,
            temperature=0.1,
            top_p=0.9,
        )

        result = ""

        if response and response.choices:
            message = response.choices[0].message

            if message:
                result = message.content or ""

        return clean_result(
            result,
            original,
        )

    except Exception as error:
        print(
            "Hugging Face inference error:",
            error,
        )

        # Keep the AI endpoint usable if the
        # remote inference provider temporarily fails.
        return original