from fastapi import (
    FastAPI,
    HTTPException,
)

from pydantic import (
    BaseModel,
    Field,
)

from model import improve_thought


app = FastAPI(
    title="Unsaid AI",
    version="1.0.0",
)


# ==========================================
# REQUEST MODEL
# ==========================================

class ImproveThoughtRequest(
    BaseModel
):

    content: str = Field(
        min_length=1,
        max_length=1000,
    )


# ==========================================
# HEALTH
# ==========================================

@app.get("/health")
def health():

    return {
        "status": "ok",
        "service": "unsaid-ai",
    }


# ==========================================
# IMPROVE THOUGHT
# ==========================================

@app.post(
    "/improve-thought"
)
def improve(
    request: ImproveThoughtRequest
):

    content = (
        request.content.strip()
    )


    if not content:

        raise HTTPException(
            status_code=400,
            detail=
                "Thought cannot be empty",
        )


    try:

        improved = (
            improve_thought(
                content
            )
        )


        return {
            "improved":
                improved,
        }


    except Exception as error:

        print(
            "AI generation error:",
            error,
        )


        raise HTTPException(
            status_code=500,
            detail=
                "AI generation failed",
        )