import uvicorn

from fastapi import FastAPI

from web import travel_agent_call
from web import save_chat_db

app = FastAPI()
app.include_router(travel_agent_call.router)
app.include_router(save_chat_db.router)


@app.get("/")
def top():
    return "top here"
# test it: http localhost:8000


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
