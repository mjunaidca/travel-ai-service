import streamlit as st
import requests
from requests.models import Response
import json
from dotenv import load_dotenv, find_dotenv
import plotly.graph_objects as go
import os

# Load environment variables
_: bool = load_dotenv(find_dotenv())  # read local .env file
MAPBOX_ACCESS_TOKEN = os.environ.get("MAPBOX_TOKEN")
BACKEND_API_URL = os.environ.get("BACKEND_API_URL")

# Set page configuration
st.set_page_config(
    page_title="Wandering AI Trips",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Header
st.header("Wandering AI Trips")

# API Selection
api_choice = st.radio("Select Travel AI FastAPI", ("Gemini Streaming & Functional Calling FastAPI",
                      "OpenAI Assistants API FastAPI"), index=0)

# Initialize session states
if "map" not in st.session_state:
    st.session_state.map = {
        "latitude": 39.949610,
        "longitude": -75.150282,
        "zoom": 16,
    }

if "markers_state" not in st.session_state:
    st.session_state.markers_state = None

if "conversation_state" not in st.session_state:
    st.session_state.conversation_state = []

    # Save Database Post URL in Session
if "databast_request_data" not in st.session_state:
    st.session_state.databast_request_data = None

# Function definition


def on_text_input_gemini():
    if st.session_state.input_user_msg == "":
        return

    st.session_state.conversation_state.append(
        ("user", st.session_state.input_user_msg)
    )

    final_res = requests.get(f'{BACKEND_API_URL}/gemini_streaming_travel_ai/?query={st.session_state.input_user_msg}', stream=True)

    if final_res.encoding is None:
        final_res.encoding = 'utf-8'

    print('final_res.iter_lines(decode_unicode=True)',
          final_res.iter_lines(decode_unicode=True))

    for line in final_res.iter_lines(decode_unicode=True):
        print('line', line)
        if line.strip():  # Check if line is not empty
            # Parse the line to extract the message
            st.session_state.conversation_state.append(
                ("gemini", line))

    map_state_res = requests.get(f'{BACKEND_API_URL}/gemini_streaming_travel_ai/mapstate')
    if map_state_res.status_code == 200:
        new_map_state = map_state_res.json()
        update_map_state(new_map_state)

    st.session_state.databast_request_data = f"{BACKEND_API_URL}/save_chat/?last_prompt={st.session_state.input_user_msg}&thread_id={'GEMINICALL'}&thread_message={st.session_state.conversation_state}"



def update_map_state(new_map_state):
    # Update only if the map state is different
    if new_map_state["map_state"] != st.session_state.map or new_map_state["markers_state"] != st.session_state.markers_state:
        st.session_state.map = new_map_state["map_state"]
        st.session_state.markers_state = new_map_state["markers_state"]


def on_text_input_openai():
    """Callback method for any chat_input value change"""

    if st.session_state.input_user_msg == "":
        return

    st.session_state.conversation_state.append(
        ("user", st.session_state.input_user_msg)
    )

    # TODO: CALL API HERE
    final_res: Response = requests.post(f'{BACKEND_API_URL}/travel_assistant/?prompt={st.session_state.input_user_msg}',)

    # Convert the bytes object to a JSON object
    response_json = json.loads(final_res.content.decode('utf-8'))

    # Access the map_state and markers_state from the JSON object
    st.session_state.map = response_json['map_state']
    st.session_state.markers_state = response_json['markers_state']

    # Update convcersation_state
    st.session_state.conversation_state = [
        (message['role'], message['content'][0]['text']['value'])
        for message in response_json["openai_response"]["data"]
        if 'role' in message and 'content' in message
    ]

    thread_message = response_json["openai_response"]["data"]
    thread_id = response_json["openai_response"]["data"][0]["thread_id"]

    st.session_state.databast_request_data = f"{BACKEND_API_URL}/save_chat/?last_prompt={st.session_state.input_user_msg}&thread_id={thread_id}&thread_message={thread_message}"


# Choose which function to call based on API selection
on_text_input = on_text_input_gemini if api_choice == "Gemini Streaming & Functional Calling FastAPI" else on_text_input_openai

left_col, right_col = st.columns(2)

with left_col:
    for role, message in st.session_state.conversation_state:
        with st.chat_message(role):
            st.write(message)

with right_col:
    figure = go.Figure(go.Scattermapbox(
        mode="markers",
    ))
    if st.session_state.markers_state is not None:
        figure.add_trace(
            go.Scattermapbox(
                mode="markers",
                marker=dict(
                    symbol='marker',
                    size=14,

                ),
                lat=st.session_state.markers_state["latitudes"],
                lon=st.session_state.markers_state["longitudes"],
                text=st.session_state.markers_state["labels"],
                customdata=st.session_state.markers_state.get("altitudes", []),
                hovertemplate=(
                    "<b>%{text}</b><br>" +
                    "Latitude: %{lat}<br>" +
                    "Longitude: %{lon}<br>" +
                    "Altitude: %{customdata}<extra></extra>"
                )
            )
        )
    figure.update_layout(
        mapbox=dict(
            accesstoken=MAPBOX_ACCESS_TOKEN,  # use it for maps styling if needed
            # style="open-street-map",
            center=go.layout.mapbox.Center(
                lat=st.session_state.map["latitude"],
                lon=st.session_state.map["longitude"]
            ),
            zoom=st.session_state.map["zoom"]
        ),
        margin=dict(l=0, r=0, t=0, b=0)
    )

    st.plotly_chart(
        figure,
        config={"displayModeBar": False},
        use_container_width=True,
        key="plotly"
    )

    if st.session_state.databast_request_data is not None:
        save_res_to_db = requests.post(st.session_state.databast_request_data)
        st.session_state.databast_request_data = None

st.chat_input(
    placeholder="Share 3 places in UAE nearby to each other I can visit in december holidays",
    key="input_user_msg",
    on_submit=on_text_input
)
