from fastapi import APIRouter
from ..service.save_chat_db import save_chat_db

router = APIRouter(prefix="/save_chat")


@router.post("/")
def save_thread_to_db(last_prompt: str, thread_id: str, thread_message):
    try:
        # Use the validated prompt from Pydantic model
        response = save_chat_db(
            last_prompt=last_prompt, thread_id=thread_id, thread_message=thread_message)
        print('response', response)

        return response
    except Exception as e:
        print("Validation error:", e)  # Debugging
        return f"error, str(e)"
