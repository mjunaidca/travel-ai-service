"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;

    setIsLoading(true);

    console.log("inputValue", inputValue);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/sendMessage`,
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
      className="flex w-full items-center justify-center p-4"
    >
      <Input
        type="text"
        placeholder="Share 3 places in UAE nearby to each other I can visit in december holidays"
        value={inputValue}
        onChange={handleInputChange}
        disabled={isLoading}
        className="w-full max-w-lg m-2"
      />
      <Button type="submit" disabled={isLoading} className="m-2">
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </form>
  );
};

export default ChatBox;
