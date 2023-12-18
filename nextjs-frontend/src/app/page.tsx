import React from "react";
import MapAIServiceAssistant from "./ui/MapAIServiceAssistant";
import { AnimatedPage } from "./ui/AnimatedHero";
import BottomBar from "@/components/BottomBar";

const page = () => {
  return (
    <div className="flex flex-col w-full h-full mx-auto justify-center px-4">
      {/* <h1 className="scroll-m-20 py-7 pt-20 text-4xl tracking-tight lg:text-5xl font-semibold first:mt-0 w-fit mx-auto">
        Wandering AI Travel Assistant
      </h1> */}
      <h2 className="scroll-m-20 border-b py-1 pt-20  text-4xl md:text-5xl font-semibold tracking-tight first:mt-0 w-fit mx-4 max-w-4xl">
        Wandering AI Travel Assistant
      </h2>
      <MapAIServiceAssistant />
      <AnimatedPage />
      <BottomBar />
    </div>
  );
};

export default page;
