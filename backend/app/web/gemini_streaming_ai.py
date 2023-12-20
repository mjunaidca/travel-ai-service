import time
from fastapi.responses import StreamingResponse
from threading import Thread
import asyncio
from queue import Queue
from fastapi import FastAPI
from fastapi import APIRouter
from ..service.gemini_streaming_ai import ai_powered_map, ai_travel_maanger, call_gemini_travel_assistant

router = APIRouter(prefix="/gemini_streaming_travel_ai")

# initializing the queue
streamer_queue: Queue = Queue()

# Change the put_data function to accept a query parameter and generate data based on this query.


def put_data(query):
    # Logic to generate data based on the query
    # For example:
    # process and stream the query itself, or use the query to generate specific data
    for part_res in call_gemini_travel_assistant(query):
        # Put each character into the queue
        streamer_queue.put(part_res)


# Creation of thread


def start_generation(query):
    thread = Thread(target=put_data, args=(query,))
    time.sleep(0.05)
    thread.start()


# This is an asynchronous function, as it has to wait for
# the queue to be available
async def serve_data(query):
    # Optinal code to start generation - This can be started anywhere in the code
    start_generation(query)

    while True:
        if not streamer_queue.empty():
            value = streamer_queue.get()
            if value == "__END__":
                break  # End the stream
            yield str(value)
            streamer_queue.task_done()
        await asyncio.sleep(0.5)

# Using the endpoint by name /query-stream


@router.get('/')
async def stream(query: str):
    # We use Streaming Response class of Fast API to use the streaming response
    return StreamingResponse(serve_data(query), media_type='text/event-stream')


@router.get("/mapstate")
def get_latest_map_state():
    return {
        "markers_state": ai_powered_map['map_state'],
        "map_state": ai_powered_map['map_state']
    }
