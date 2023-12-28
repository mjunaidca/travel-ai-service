from fastapi.responses import StreamingResponse
from fastapi import APIRouter, HTTPException
from ..service.gemini_streaming_ai import ai_powered_map, call_gemini_travel_assistant

router = APIRouter(prefix="/gemini_streaming_travel_ai")


@router.get('/')
async def stream(query: str):
    print("query", query)
    # no-store directive instructs response must not be stored in any cache
    headers = {"Cache-Control": "no-store"}
    try:
        return StreamingResponse(call_gemini_travel_assistant(query), media_type="text/event-stream", headers=headers)
    except Exception as e:
        # Log the error or take other appropriate actions
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/mapstate")
def get_latest_map_state():
    return {
        "markers_state": ai_powered_map['markers_state'],
        "map_state": ai_powered_map['map_state']
    }
