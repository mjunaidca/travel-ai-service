from fastapi import APIRouter
from service.travel_agent_call import call_travel_assistant

router = APIRouter(prefix="/travel_assistant")


@router.get("/echo/{thing}")
def echo(thing: str | int):
    return f"echo {thing}"
# test it: http -b  localhost:8000/echo/ki


@router.post("/")
def travel_assistant(prompt: str):
    try:
        # Use the validated prompt from Pydantic model
        response, thread_id = call_travel_assistant(prompt)
        print('thread_id', thread_id)

        return {
            # "markers_state": markers_state,
            # "map_state": map_state,
            "openai_response": response
        }
    except Exception as e:
        print("Validation error:", e)  # Debugging
        return {"error": str(e)}
