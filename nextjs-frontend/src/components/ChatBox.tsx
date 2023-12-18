"use client";

import { FC, useState } from "react";

interface MapState {
  latitude: number;
  longitude: number;
  zoom: number;
}

interface Marker {
  lat: number;
  lng: number;
  label: string;
}

interface ChatBoxProps {
  onApiResponse: (
    mapState: MapState,
    markersState: Marker[],
    userMessage: string,
    aiResponse: string
  ) => void;
}

interface ApiResponse {
  response: {
    markers_state: {
      latitudes: number[];
      longitudes: number[];
      labels: string[];
    };
    map_state: MapState;
    openai_response: {
      data: Array<{
        content: Array<{
          text: { value: string };
        }>;
      }>;
    };
  };
}

const ChatBox: FC<ChatBoxProps> = ({ onApiResponse }) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;

    setIsLoading(true);

    console.log("inputValue", inputValue);

    try {
      const response = await fetch(
        `/api/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: inputValue }),
        }
      );

      const data: ApiResponse = await response.json();

      // Extract user message and AI response
      const userMessage = inputValue;
      const aiResponse = data.response.openai_response.data
        .map((d: any) => d.content[0].text.value)
        .join("\n");
      const newMapState: MapState = {
        latitude: data.response.map_state.latitude,
        longitude: data.response.map_state.longitude,
        zoom: data.response.map_state.zoom,
      };

      const newMarkersState: Marker[] =
        data.response.markers_state.latitudes.map(
          (lat: number, index: number) => ({
            lat,
            lng: data.response.markers_state.longitudes[index],
            label: data.response.markers_state.labels[index],
          })
        );
      // Call the onApiResponse prop function to update map and markers
      onApiResponse(newMapState, newMarkersState, userMessage, aiResponse);

      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full m-1 flex items-center justify-between space-x-2"
    >
      <textarea
        id="prompt"
        rows={1}
        className="mx-2 flex  disabled:cursor-not-allowed disabled:opacity-50 min-h-full w-full rounded-md border border-slate-300 bg-slate-200 p-2 text-base text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-300/20 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:border-blue-600 dark:focus:ring-blue-600"
        placeholder="Share 3 places in UAE nearby to each other for tech junkie!"
        value={inputValue}
        onChange={handleInputChange}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="absolute right-3 disabled:cursor-not-allowed disabled:opacity-50 rounded-r-lg py-[8px] text-sm  hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 border-slate-300 bg-slate-200 p-2 text-slate-700 placeholder-slate-400"
      >
        {isLoading ? (
          <>
            <svg
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="animate-spin h-5 w-5 mr-1 text-blue-800"
              strokeWidth="0.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M7.49998 0.849976C7.22383 0.849976 6.99998 1.07383 6.99998 1.34998V3.52234C6.99998 3.79848 7.22383 4.02234 7.49998 4.02234C7.77612 4.02234 7.99998 3.79848 7.99998 3.52234V1.8718C10.8862 2.12488 13.15 4.54806 13.15 7.49998C13.15 10.6204 10.6204 13.15 7.49998 13.15C4.37957 13.15 1.84998 10.6204 1.84998 7.49998C1.84998 6.10612 2.35407 4.83128 3.19049 3.8459C3.36919 3.63538 3.34339 3.31985 3.13286 3.14115C2.92234 2.96245 2.60681 2.98825 2.42811 3.19877C1.44405 4.35808 0.849976 5.86029 0.849976 7.49998C0.849976 11.1727 3.82728 14.15 7.49998 14.15C11.1727 14.15 14.15 11.1727 14.15 7.49998C14.15 3.82728 11.1727 0.849976 7.49998 0.849976ZM6.74049 8.08072L4.22363 4.57237C4.15231 4.47295 4.16346 4.33652 4.24998 4.25C4.33649 4.16348 4.47293 4.15233 4.57234 4.22365L8.08069 6.74051C8.56227 7.08599 8.61906 7.78091 8.19998 8.2C7.78089 8.61909 7.08597 8.56229 6.74049 8.08072Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Search chats</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500 hover:text-blue-700"
              aria-hidden="true"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M10 14l11 -11"></path>
              <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"></path>
            </svg>
            <span className="sr-only">Send message</span>
          </>
        )}
        <span className="sr-only">Send message</span>
      </button>
    </form>
  );
};

export default ChatBox;
