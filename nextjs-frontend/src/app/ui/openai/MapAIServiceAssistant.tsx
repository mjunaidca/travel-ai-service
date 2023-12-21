"use client";

import { useState } from "react";
import GoogleMapComponent from "@/components/GoogleMapComponent";
import ChatBox from "@/app/ui/openai/ChatBox";
import ChatMessage from "@/app/ui/openai/ChatMessage";

const MapAIServiceAssistant = () => {
  const [mapState, setMapState] = useState({
    latitude: 25.1972,
    longitude: 55.2744,
    zoom: 7,
  });
  const [markers, setMarkers] = useState([]);
  const [messages, setMessages] = useState<any>([]); // Add this line

  const handleApiResponse = (
    newMapState: any,
    newMarkersState: any,
    userMessage: string,
    aiResponse: string
  ) => {
    setMapState({
      latitude: newMapState.latitude,
      longitude: newMapState.longitude,
      zoom: newMapState.zoom,
    });

    const transformedMarkers = newMarkersState.map((marker: any) => ({
      lat: marker.lat,
      lng: marker.lng,
      label: marker.label,
    }));

    setMarkers(transformedMarkers);
    setMessages((prevMessages: any) => [
      { user: userMessage, ai: aiResponse },
      ...prevMessages,
    ]); // Add this line
  };

  return (
    <div className="flex flex-col-reverse md:flex-row min-h-[74vh] items-center justify-center">
      <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center m-2">
        <div className="overflow-y-auto max-h-[400px] h-full sm:max-h-[460px] md:max-h-[520px] lg:max-h-[570px] xl:max-h-[600px] w-full">
          {messages.map((msg: any, index: number) => (
            <ChatMessage
              key={index}
              userMessage={msg.user}
              aiResponse={msg.ai}
            />
          ))}
        </div>
        <ChatBox onApiResponse={handleApiResponse} />
      </div>
      <div className="w-full h-[400px] sm:h-[460px] md:h-[520px] rounded-sm lg:h-[570px] xl:h-[600px] md:w-1/2 bg-gray-400 flex items-center justify-center m-4">
        <GoogleMapComponent
          center={{ lat: mapState.latitude, lng: mapState.longitude }}
          zoom={mapState.zoom}
          markers={markers}
        />
      </div>
    </div>
  );
};

export default MapAIServiceAssistant;
