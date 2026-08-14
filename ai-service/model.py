from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
)

import torch


# ==========================================
# MODEL CONFIG
# ==========================================

MODEL_NAME = (
    "HuggingFaceTB/"
    "SmolLM2-135M-Instruct"
)

print(
    "Loading Unsaid AI model..."
)


# ==========================================
# TOKENIZER
# ==========================================

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME,
    use_fast=True,
)


# ==========================================
# MODEL
# ==========================================

model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    low_cpu_mem_usage=True,
)

model.eval()


print(
    "Unsaid AI model loaded."
)


# ==========================================
# SYSTEM PROMPT
# ==========================================

SYSTEM_PROMPT = """
You are Unsaid's writing assistant.

Lightly improve the user's thought before
they post it.

Rules:

- Preserve the exact meaning.
- Preserve the emotion and personality.
- Fix grammar, spelling, punctuation,
  capitalization, and awkward wording.
- Make minimal changes.
- Do not add facts or opinions.
- Do not make it formal or motivational.
- Do not explain the changes.
- Return only the improved thought.

Example:

Input:
college is killing me idk what to do

Output:
College is killing me. I don't know what to do.
"""


# ==========================================
# IMPROVE THOUGHT
# ==========================================

def improve_thought(text: str) -> str:

    original = (
        text.strip()
        if isinstance(text, str)
        else ""
    )

    if not original:
        return original


    # --------------------------------------
    # Keep the incoming text small.
    # --------------------------------------

    original = original[:1000]


    # --------------------------------------
    # CHAT MESSAGES
    # --------------------------------------

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT,
        },
        {
            "role": "user",
            "content": (
                "Improve this thought with "
                "minimal changes:\n\n"
                f"{original}"
            ),
        },
    ]


    # --------------------------------------
    # BUILD PROMPT
    # --------------------------------------

    prompt = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True,
    )


    # --------------------------------------
    # TOKENIZE
    # --------------------------------------

    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=384,
    )


    # --------------------------------------
    # GENERATE
    # --------------------------------------

    with torch.inference_mode():

        outputs = model.generate(
            **inputs,

            max_new_tokens=48,

            do_sample=False,

            repetition_penalty=1.03,

            pad_token_id=(
                tokenizer.eos_token_id
            ),
        )


    # --------------------------------------
    # REMOVE PROMPT
    # --------------------------------------

    input_length = (
        inputs["input_ids"]
        .shape[1]
    )


    generated_tokens = (
        outputs[0][input_length:]
    )


    result = tokenizer.decode(
        generated_tokens,
        skip_special_tokens=True,
    ).strip()


    # --------------------------------------
    # FALLBACK
    # --------------------------------------

    if not result:
        return original


    # --------------------------------------
    # CLEAN OUTPUT
    # --------------------------------------

    unwanted_prefixes = [
        "improved thought:",
        "improved version:",
        "rewritten thought:",
        "rewrite:",
        "output:",
    ]


    cleaned = result.strip()


    lower_result =
        cleaned.lower()


    for prefix in unwanted_prefixes:

        if lower_result.startswith(
            prefix
        ):
            cleaned = (
                cleaned[
                    len(prefix):
                ].strip()
            )

            break


    # --------------------------------------
    # REMOVE ACCIDENTAL QUOTES
    # --------------------------------------

    if (
        len(cleaned) >= 2
        and (
            (
                cleaned.startswith('"')
                and cleaned.endswith('"')
            )
            or (
                cleaned.startswith("'")
                and cleaned.endswith("'")
            )
        )
    ):
        cleaned = (
            cleaned[1:-1]
            .strip()
        )


    # --------------------------------------
    # SAFETY
    # --------------------------------------

    if not cleaned:
        return original


    if len(cleaned) > 1000:
        return original


    return cleaned