"use client";
import { useState } from "react";
import UiMessage from "./ChatUi";
import { Icons } from "@/components/Icons";
import GoogleMapComponent from "@/components/GoogleMapComponent";

async function consumeStream(
  response: any,
  updateAiResponse: any,
  setError: any
) {
  const reader = response.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const textChunk = new TextDecoder("utf-8").decode(value);
      updateAiResponse(textChunk); // Update with each new chunk
    }
  } catch (error) {
    setError("Error while reading data from the stream.");
    console.error("Stream error:", error);
  }
}

const GeminiChatBox = () => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversation, setConversation] = useState<any>([]); // Array to store conversation
  const [mapState, setMapState] = useState({
    center: { lat: 16, lng: 40 },
    zoom: 16,
    markers: [],
  });

  const updateAiResponse = (newChunk: any) => {
    setConversation((prevConvo: any) => {
      const lastEntry =
        prevConvo.length > 0 ? prevConvo[prevConvo.length - 1] : null;
      if (lastEntry && lastEntry.sender === "AI") {
        return [
          ...prevConvo.slice(0, -1),
          { ...lastEntry, message: lastEntry.message + newChunk },
        ];
      } else {
        return [...prevConvo, { sender: "AI", message: newChunk }];
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const updateMapState = async () => {
    try {
      const mapStateResponse = await fetch("/api/gemini-mapstate", {
        cache: "no-store",
      });
      if (mapStateResponse.status === 200) {
        const mapData = await mapStateResponse.json();
        // Transform the markers_state data into the expected format
        const markers = mapData.markers_state.latitudes.map(
          (lat: any, index: any) => ({
            lat: lat,
            lng: mapData.markers_state.longitudes[index],
            label: mapData.markers_state.labels[index],
          })
        );

        setMapState({
          center: {
            lat: mapData.map_state.latitude,
            lng: mapData.map_state.longitude,
          },
          zoom: mapData.map_state.zoom,
          markers: markers,
        });
      } else {
        console.error("Failed to fetch map state");
      }
    } catch (error) {
      console.error("Error fetching map state:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!inputValue) return;

    setIsLoading(true);
    setError(null);

    setConversation([...conversation, { sender: "User", message: inputValue }]);

    try {
      const response = await fetch(
        `/api/streaming-gemini?query=${inputValue}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      consumeStream(response, updateAiResponse, setError);
      setInputValue("");

      await updateMapState(); // Update the map state after stream is complete
    } catch (error: any) {
      setError(error.message);
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row min-h-[74vh] items-center justify-center">
      <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center m-2">
        <div className="overflow-y-auto max-h-[400px] h-full sm:max-h-[460px] md:max-h-[520px] lg:max-h-[570px] xl:max-h-[600px] w-full">
          {conversation.map((entry: any, index: any) => (
            <UiMessage
              key={index}
              sender={entry.sender}
              message={entry.message}
            />
          ))}
        </div>
        <form
          onSubmit={handleSubmit}
          className="relative w-full m-1 flex items-center justify-between space-x-2"
        >
          <textarea
            id="prompt"
            rows={1}
            className="mx-2 flex  disabled:cursor-not-allowed disabled:opacity-50 min-h-full w-full rounded-md border border-slate-300 bg-slate-200 p-2 text-base text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-300/20 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:border-blue-600 dark:focus:ring-blue-600"
            placeholder="Let's visit Japan!"
            value={inputValue}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-3 disabled:cursor-not-allowed disabled:opacity-50 rounded-r-lg py-[8px] text-sm  hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 border-slate-300 bg-slate-200 p-2 text-slate-700 placeholder-slate-400"
          >
            {isLoading ? <Icons.isLoading /> : <Icons.sendMesssage />}
            <span className="sr-only">Send message</span>
          </button>
        </form>
      </div>
      <div className="w-full h-[400px] sm:h-[460px] md:h-[520px] rounded-sm lg:h-[570px] xl:h-[600px] md:w-1/2 bg-gray-400 flex items-center justify-center m-4">
        <GoogleMapComponent
          center={mapState.center}
          zoom={mapState.zoom}
          markers={mapState.markers}
        />
      </div>
    </div>
  );
};

export default GeminiChatBox;
