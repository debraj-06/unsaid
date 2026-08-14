from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
)

import torch


# ==========================================
# MODEL
# ==========================================

MODEL_NAME = (
    "Qwen/Qwen2.5-0.5B-Instruct"
)


print(
    "Loading Unsaid AI model..."
)


tokenizer = (
    AutoTokenizer.from_pretrained(
        MODEL_NAME
    )
)


model = (
    AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,

        # Keep it simple for local
        # CPU-based development.
        torch_dtype=torch.float32,
    )
)


model.eval()


print(
    "Unsaid AI model loaded."
)


# ==========================================
# IMPROVE THOUGHT
# ==========================================

def improve_thought(
    text: str
) -> str:

    original = text.strip()

    if not original:
        return original


    # ========================================
    # UNSAID AI INSTRUCTIONS
    # ========================================

    system_prompt = """
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

Good output:
College is killing me. I don't know what to do.

Bad output:
College is making me feel uncertain about
my future.

The bad output changes the meaning.

Another example:

Input:
im so tired of pretending everything is fine

Good output:
I'm so tired of pretending everything is fine.

Another example:

Input:
everyone is moving ahead except me

Good output:
Everyone is moving ahead except me.

Another example:

Input:
idk why i keep overthinking everything

Good output:
I don't know why I keep overthinking everything.
"""


    # ========================================
    # CHAT PROMPT
    # ========================================

    messages = [
        {
            "role": "system",
            "content": system_prompt,
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


    prompt = (
        tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
        )
    )


    # ========================================
    # TOKENIZE
    # ========================================

    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=1024,
    )


    # ========================================
    # GENERATE
    # ========================================

    with torch.no_grad():

        outputs = model.generate(
            **inputs,

            # Keep responses short.
            max_new_tokens=80,

            # Deterministic output.
            do_sample=False,

            # Slightly discourage repetition.
            repetition_penalty=1.05,

            pad_token_id=(
                tokenizer.eos_token_id
            ),
        )


    # ========================================
    # REMOVE PROMPT
    # ========================================

    generated_tokens = outputs[
        0
    ][
        inputs[
            "input_ids"
        ].shape[1]:
    ]


    result = tokenizer.decode(
        generated_tokens,
        skip_special_tokens=True,
    ).strip()


    # ========================================
    # CLEAN MODEL OUTPUT
    # ========================================

    if not result:
        return original


    unwanted_prefixes = [
        "improved thought:",
        "improved version:",
        "rewritten thought:",
        "rewrite:",
        "output:",
    ]


    cleaned = result

    lower_result = (
        cleaned.lower()
    )


    for prefix in (
        unwanted_prefixes
    ):
        if lower_result.startswith(
            prefix
        ):
            cleaned = (
                cleaned[
                    len(prefix):
                ].strip()
            )

            break


    # ========================================
    # REMOVE ACCIDENTAL QUOTES
    # ========================================

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
        cleaned = cleaned[1:-1].strip()


    # ========================================
    # SAFETY FALLBACK
    # ========================================

    if not cleaned:
        return original


    # Never allow an unexpectedly huge
    # generated response.
    if len(cleaned) > 1000:
        return original


    return cleaned