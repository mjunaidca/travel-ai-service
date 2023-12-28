import time
from typing import Any
from vertexai.preview.generative_models import (
    Content,
    FunctionDeclaration,
    GenerativeModel,
    Part,
    Tool,
)
from vertexai.generative_models._generative_models import GenerationResponse, ContentsType
from typing import Union, Iterable
import json
import asyncio

BASE_PROMPT: str = """You are an AI Travel Assistant who make global travellers traval planning fun and interactive:

Before replying perform the following steps:

1. If user share any travel location name, update the map to go to that place and Add markers on the place.
2. if user shared any travel suggestions update them map.

If user sends any general message share with them you are a helpful AI Travel Assistant and you can help them with travel planning.

"""


MapStateType = dict[str, float]
MarkersStateType = dict[str, list]

ai_powered_map: dict[str, Any] = {
    "map_state": {
        "latitude": 39.949610,
        "longitude": 75.150282,
        "zoom": 16,
    },
    "markers_state": {
        "latitudes": [],
        "longitudes": [],
        "labels": [],
    }
}


def update_map_and_markers(latitude: float, longitude: float, zoom: float, latitudes: list[float], longitudes: list[float], labels: list[float]):
    """Update map location and add markers."""

    try:

        # Validate marker data
        if len(latitudes) != len(longitudes) or len(latitudes) != len(labels):
            raise ValueError(
                "Number of latitudes, longitudes, and labels must be the same.")

        # Update map location
        ai_powered_map["map_state"]['latitude'] = latitude
        ai_powered_map["map_state"]['longitude'] = longitude
        ai_powered_map["map_state"]['zoom'] = zoom

        # Update markers
        ai_powered_map["markers_state"]["latitudes"] = latitudes
        ai_powered_map["markers_state"]["longitudes"] = longitudes
        ai_powered_map["markers_state"]["labels"] = labels

        return {"status": "Map location and markers updated successfully. Now only assist the travellers - no function calling", "values": ai_powered_map}
    except (ValueError, TypeError) as e:
        raise ValueError({"status": f"Error in update_map_and_markers function: {e}, Now only assist the travellers - no function calling", "values": ai_powered_map})


map_ai_update_and_markers_func = FunctionDeclaration(
    name="update_map_and_markers",
    description="Update map to center on a particular location and add list of markers to the map",
    parameters={
        "type": "object",
        "properties": {
            "longitude": {
                "type": "number",
                "description": "Longitude of the location to center the map on"
            },
            "latitude": {
                "type": "number",
                "description": "Latitude of the location to center the map on"
            },
            "zoom": {
                "type": "integer",
                "description": "Zoom level of the map"
            },
            "longitudes": {
                "type": "array",
                "items": {
                    "type": "number"
                },
                "description": "List of longitudes for each marker"
            },
            "latitudes": {
                "type": "array",
                "items": {
                    "type": "number"
                },
                "description": "List of latitudes for each marker"
            },
            "labels": {
                "type": "array",
                "items": {
                    "type": "string"
                },
                "description": "List of labels for each marker"
            }
        },
        "required": ["longitude", "latitude", "zoom", "longitudes", "latitudes", "labels"]
    }
)

map_ai_tool = Tool(
    function_declarations=[map_ai_update_and_markers_func],
)

available_functions = {
    "update_map_and_markers": update_map_and_markers,
}


# Load Gemini Pro
gemini_pro_model: GenerativeModel = GenerativeModel(
    "gemini-pro", generation_config={"temperature": 0.4}, tools=[map_ai_tool])

message1: Content = Content(role="user", parts=[Part.from_text(BASE_PROMPT)])
message2: Content = Content(role="model", parts=[Part.from_text("Got It")])

chat_history = [message1, message2]


class TravelAIChat():
    def __init__(self, gemini_pro_model: GenerativeModel, initial_history=chat_history):
        if gemini_pro_model is None:
            raise ValueError("Gemini Pro Model is not set!")
        self.assistant: GenerativeModel = gemini_pro_model.start_chat(
            history=initial_history)

    # PGet History
    def get_history(self):
        return self.assistant.history

    def run_assistant(self, prompt: str):

        if self.assistant is None:
            raise ValueError(
                """Assistant is not set. Cannot run assistant without an assistant.""")

        run_res: Union["GenerationResponse", Iterable["GenerationResponse"]
                       ] = self.assistant.send_message(prompt, stream=True)
        for message in run_res:

            for part in message.candidates[0].content.parts:
                print("part", part)
                try:
                    text_content = part.text
                    if text_content is not None:
                        print("Got Text")
                        yield text_content
                        continue  # Skip to next message part
                except ValueError:
                    # Handle cases where 'text' property is present but no actual text content is available
                    print("ValueError Text")
                    pass

                if hasattr(part, 'function_call') and part.function_call is not None:
                    print("Got Function Response")
                    try:
                        function_call = part.function_call  # Corrected to use 'part.function_call'
                        print("function_call", function_call)

                            # Check if the function name exists in the available_functions dictionary
                        if function_call.name in available_functions:
                            function_call_name = available_functions[function_call.name]
                            print("Function Call Name:", function_call.name)
                            # ... (rest of your code for handling function calls)
                        else:
                            print(f"Function name '{function_call}' not recognized.")
                            yield f"DM Dev. Gemini is Sleeping!"
                        # function_call_name = available_functions[function_call.name]

                        # Access 'args'
                        if hasattr(function_call, 'args'):
                            args = function_call.args
                            # print("Content of 'args':", args)

                            # Initialize variables with default values
                            zoom = ai_powered_map["map_state"].get("zoom")
                            longitude = ai_powered_map["map_state"].get(
                                "longitude")
                            latitude = ai_powered_map["map_state"].get(
                                "latitude")
                            longitudes, latitudes, labels = [], [], []

                            # Iterate over each item in 'args'
                            for key, value in args.items():
                                print("Key:", key, "Value:", value)

                                if key == "zoom":
                                    try:
                                        zoom = value
                                    except Exception as e:
                                        print(f"Error with 'zoom': {e}")

                                if key == "longitude":
                                    try:
                                        longitude = value
                                    except Exception as e:
                                        print(f"Error with 'longitude': {e}")

                                if key == "latitude":
                                    try:
                                        latitude = value
                                    except Exception as e:
                                        print(f"Error with 'latitude': {e}")

                                if key == "longitudes":
                                    try:
                                        longitudes = [v for v in value]
                                    except Exception as e:
                                        print(f"Error with 'longitudes': {e}")

                                if key == "latitudes":
                                    try:
                                        latitudes = [v for v in value]
                                    except Exception as e:
                                        print(f"Error with 'latitudes': {e}")

                                if key == "labels":
                                    try:
                                        labels = [v for v in value]
                                    except Exception as e:
                                        print(f"Error with 'labels': {e}")

                            # Print extracted values
                            print("zoom =", zoom)
                            print("longitude =", longitude)
                            print("longitudes =", longitudes)
                            print("latitude =", latitude)
                            print("latitudes =", latitudes)
                            print("labels =", labels)

                            map_update_call_func = function_call_name(labels=labels,
                                                                      latitudes=latitudes,
                                                                      longitudes=longitudes,
                                                                      latitude=latitude,
                                                                      longitude=longitude,
                                                                      zoom=zoom
                                                                      )

                            print("map_update_call", map_update_call_func)

                            time.sleep(0.5)

                            list_content: ContentsType = [json.dumps(map_update_call_func["status"]), f"Now help users with travel planning in {' '.join(labels)} - Don't call the function as Map is updated"]
                            print('list_content', list_content)

                            func_call_gemini_response = self.assistant.send_message(
                                list_content,
                                stream=True
                            )

                            for message in func_call_gemini_response:
                                part = message.candidates[0].content.parts[0]

                                try:
                                    text_content = part.text if hasattr(part, 'text') else None
                                    if text_content:
                                        print("Got Func Calling Text:", text_content)
                                        yield text_content
                                except ValueError:
                                    # Handle cases where 'text' property is present but no actual text content is available
                                    print(
                                        "No text content available in part:", part)
                                    yield "Gemini is Sleeping!"
                                    # Implement additional handling if necessary, e.g., continue, log, etc.
                                    pass
                    except ValueError as e:
                        print(f"Error processing function call: {e}")
                        yield "Funcation Calling Failed! Gemini is Sleeping!"
                        pass
                else:
                    # print("Got Nothing")
                    yield "Got Nothing"


ai_travel_maanger: TravelAIChat = TravelAIChat(
    gemini_pro_model=gemini_pro_model, initial_history=chat_history)


async def call_gemini_travel_assistant(prompt: str):
    complete_response = ""
    try:
        for response in ai_travel_maanger.run_assistant(prompt):
            if response == "__END__":
                break
            yield response
            print("response", response)
            await asyncio.sleep(0.05)  # Adjust delay as needed
            complete_response += response
    except Exception as e:
        # Handle specific exceptions as needed
        print(f"Error during streaming: {e}")
        yield "An error occurred: " + str(e)
    finally:
        print('complete_response', complete_response)
