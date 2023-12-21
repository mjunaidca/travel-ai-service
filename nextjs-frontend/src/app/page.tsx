import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedPage } from "./ui/AnimatedHero";
import BottomBar from "@/components/BottomBar";
// import MapAIServiceAssistant from "./ui/openai/MapAIServiceAssistant";
import GeminiChatBox from "./ui/gemini/GeminiChatBox";

const page = () => {
  return (
    <div className="flex flex-col w-full h-full mx-auto item justify-center px-4">
      <h2 className="scroll-m-20 border-b py-1 pt-20  text-4xl md:text-5xl font-semibold tracking-tight first:mt-0 w-fit mx-4 max-w-4xl">
        Wandering AI Assistant
      </h2>
      <Tabs
        defaultValue="gemini"
        className=" p-5 flex flex-col items-center justify-center"
      >
        <TabsList className="">
          <TabsTrigger value="gemini">GeminiPro Streaming Fast API</TabsTrigger>
          {/* <TabsTrigger value="openai">OpenAI Assistant</TabsTrigger> */}
        </TabsList>
        <TabsContent value="gemini" className="w-full">
          <GeminiChatBox />
        </TabsContent>
        {/* <TabsContent value="openai" className="w-full">
          <MapAIServiceAssistant />
        </TabsContent> */}
      </Tabs>

      <AnimatedPage />
      <BottomBar /> 
    </div>
  );
};

export default page;
