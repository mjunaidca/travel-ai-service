"use client";

import { Icons } from "@/components/Icons";
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
      const response = await fetch(`/api/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputValue }),
      });

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
        {isLoading ? <Icons.isLoading /> : <Icons.sendMesssage />}
      </button>
    </form>
  );
};

export default ChatBox;
