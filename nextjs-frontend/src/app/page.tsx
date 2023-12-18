"use client";

import { useState } from "react";
import GoogleMapComponent from "./ui/GoogleMapComponent";
import ChatBox from "./ui/ChatBox";

const Home = () => {
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
    <div className="flex flex-col-reverse md:flex-row min-h-screen items-center justify-center">
      <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center m-4">
        <div className="overflow-y-auto max-h-[400px] h-full sm:max-h-[460px] md:max-h-[520px] lg:max-h-[570px] xl:max-h-[600px] w-full">
          {messages.map((msg: any, index: any) => (
            <div key={index} className="m-2 p-2 bg-white rounded-lg shadow-md">
              <p>
                <strong>User:</strong> {msg.user}
              </p>
              <p>
                <strong>AI:</strong> {msg.ai}
              </p>
            </div>
          ))}
        </div>
        <ChatBox onApiResponse={handleApiResponse} />
      </div>
      <div className="w-full md:w-1/2 h-full bg-blue-400 flex items-center justify-center m-4">
        <GoogleMapComponent
          center={{ lat: mapState.latitude, lng: mapState.longitude }}
          zoom={mapState.zoom}
          markers={markers}
        />
      </div>
    </div>
  );
};

export default Home;

// import {
//   useLoadScript,
//   GoogleMap,
//   MarkerF,
//   CircleF,
// } from "@react-google-maps/api";
// import type { NextPage } from "next";
// import { useMemo, useState } from "react";
// import usePlacesAutocomplete, {
//   getGeocode,
//   getLatLng,
// } from "use-places-autocomplete";
// import styles from "./Home.module.css";

// const Home: NextPage = () => {
//   const [lat, setLat] = useState(27.672932021393862);
//   const [lng, setLng] = useState(85.31184012689732);

//   const libraries = useMemo(() => ["places"], []);
//   const mapCenter = useMemo(() => ({ lat: lat, lng: lng }), [lat, lng]);

//   const mapOptions = useMemo<google.maps.MapOptions>(
//     () => ({
//       disableDefaultUI: true,
//       clickableIcons: true,
//       scrollwheel: false,
//     }),
//     []
//   );

//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
//     libraries: libraries as any,
//   });

//   if (!isLoaded) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className={styles.homeWrapper}>
//       <div className={styles.sidebar}>
//         {/* render Places Auto Complete and pass custom handler which updates the state */}
//         <PlacesAutocomplete
//           onAddressSelect={(address) => {
//             getGeocode({ address: address }).then((results) => {
//               const { lat, lng } = getLatLng(results[0]);

//               setLat(lat);
//               setLng(lng);
//             });
//           }}
//         />
//       </div>
//       <GoogleMap
//         options={mapOptions}
//         zoom={14}
//         center={mapCenter}
//         mapTypeId={google.maps.MapTypeId.ROADMAP}
//         mapContainerStyle={{ width: "800px", height: "800px" }}
//         onLoad={(map) => console.log("Map Loaded")}
//       >
//         <MarkerF
//           position={mapCenter}
//           onLoad={() => console.log("Marker Loaded")}
//         />

//         {[1000, 2500].map((radius, idx) => {
//           return (
//             <CircleF
//               key={idx}
//               center={mapCenter}
//               radius={radius}
//               onLoad={() => console.log("Circle Load...")}
//               options={{
//                 fillColor: radius > 1000 ? "red" : "green",
//                 strokeColor: radius > 1000 ? "red" : "green",
//                 strokeOpacity: 0.8,
//               }}
//             />
//           );
//         })}
//       </GoogleMap>
//     </div>
//   );
// };

// const PlacesAutocomplete = ({
//   onAddressSelect,
// }: {
//   onAddressSelect?: (address: string) => void;
// }) => {
//   const {
//     ready,
//     value,
//     suggestions: { status, data },
//     setValue,
//     clearSuggestions,
//   } = usePlacesAutocomplete({
//     requestOptions: { componentRestrictions: { country: "us" } },
//     debounce: 300,
//     cache: 86400,
//   });

//   const renderSuggestions = () => {
//     return data.map((suggestion) => {
//       const {
//         place_id,
//         structured_formatting: { main_text, secondary_text },
//         description,
//       } = suggestion;

//       return (
//         <li
//           key={place_id}
//           onClick={() => {
//             setValue(description, false);
//             clearSuggestions();
//             onAddressSelect && onAddressSelect(description);
//           }}
//         >
//           <strong>{main_text}</strong> <small>{secondary_text}</small>
//         </li>
//       );
//     });
//   };

//   return (
//     <div className={styles.autocompleteWrapper}>
//       <input
//         value={value}
//         className={styles.autocompleteInput}
//         disabled={!ready}
//         onChange={(e) => setValue(e.target.value)}
//         placeholder="123 Stariway To Heaven"
//       />

//       {status === "OK" && (
//         <ul className={styles.suggestionWrapper}>{renderSuggestions()}</ul>
//       )}
//     </div>
//   );
// };

// export default Home;
