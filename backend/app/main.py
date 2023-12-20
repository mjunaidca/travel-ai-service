import uvicorn

from fastapi import FastAPI

from .web import openai_travel_agent_call
from .web import save_chat_db
from .web import gemini_streaming_ai

app = FastAPI()
app.include_router(openai_travel_agent_call.router)
app.include_router(save_chat_db.router)
app.include_router(gemini_streaming_ai.router)


@app.get("/")
def top():
    return "top here"
# test it: http localhost:8000


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
