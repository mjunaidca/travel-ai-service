from fastapi import APIRouter
from ..service.openai_travel_agent_call import call_travel_assistant
from ..utils.add_markers import markers_state
from ..utils.update_map import map_state

router = APIRouter(prefix="/travel_assistant")


@router.post("/")
def openai_travel_assistant(prompt: str):
    try:
        # Use the validated prompt from Pydantic model
        response, thread_id = call_travel_assistant(prompt)
        print('thread_id', thread_id)

        return {
            "markers_state": markers_state,
            "map_state": map_state,
            "openai_response": response
        }
    except Exception as e:
        print("Validation error:", e)  # Debugging
        return {"error": str(e)}
