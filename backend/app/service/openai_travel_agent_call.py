from ..utils.chat_assistant import TravelAIChat
from ..utils.get_assistant import GetAssistant
from ..utils.thread_manager import CreateThread

from openai.types.beta.threads import ThreadMessage, Run
from openai.types.beta.thread import Thread
from openai.types.beta.assistant import Assistant

from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
import os

_: bool = load_dotenv(find_dotenv())  # read local .env file

client: OpenAI = OpenAI()

# TODO: If Assistant is present in env no need to retrive & verify it.
TRAVEL_ASSISTANT_ID = os.environ.get("TRAVEL_ASSISTANT_ID")


# Initialize Travel Assistant Class
travel_agent_call: GetAssistant = GetAssistant(
    client=client)

# Retrieve the Travel Assistant
travel_assistant: Assistant = travel_agent_call.retrieve_assistant(
    TRAVEL_ASSISTANT_ID or '')

print("travel_assistant.id", travel_assistant.id)

# TODO: If new thread is  not required use Existing One
# Initialize Thread Class
thread_call: CreateThread = CreateThread(
    client=client)


def call_travel_assistant(prompt: str, file_ids: list[str] = []) -> tuple[list[ThreadMessage], str]:

    # Create a Thread
    thread: Thread = thread_call.create_thread()

    ai_travel_maanger: TravelAIChat = TravelAIChat(
        client=client,
        assistant=travel_assistant, thread=thread)

    # Add a message to the thread
    ai_travel_maanger.add_message_to_thread(
        role="user",
        content=prompt,
        file_obj_ids=file_ids
    )

    # Run the assistant
    run: Run = ai_travel_maanger.run_assistant()

    # Wait for the assistant to complete
    messages: list[ThreadMessage] = ai_travel_maanger.wait_for_completion(run)

    return messages, thread.id
