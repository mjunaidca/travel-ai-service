import Image from "next/image";
import HUMAN from "/public/human.png";
import AIIMAGE from "/public/ai.png";
// import AI from" /public/ai.png";
interface ChatMessageProps {
  userMessage: string;
  aiResponse: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  userMessage,
  aiResponse,
}) => {
  const formatResponse = (response: string) => {
    const formattedResponse = response.split("\n").map((line, index) => {
      if (line.startsWith("- ")) {
        return <li key={index}>{line.substring(2)}</li>;
      } else if (line.startsWith("**") && line.endsWith("**")) {
        return <strong key={index}>{line.slice(2, -2)}</strong>;
      } else if (line.trim() === "") {
        return <br key={index} />;
      } else {
        return <p key={index}>{line}</p>;
      }
    });

    return <div>{formattedResponse}</div>;
  };

  return (
    <div className="flex-1 overflow-y-auto rounded-xl bg-slate-200 p-4 text-sm leading-6 text-slate-900 dark:bg-slate-800 dark:text-slate-300 sm:text-base sm:leading-7">
      {/* User Message */}
      <div className="flex flex-row px-2 py-4 sm:px-4">
        <Image
          className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
          src={HUMAN}
          alt="User"
        />
        <div className="flex max-w-3xl items-center">
          <p>{userMessage}</p>
        </div>
      </div>

      {/* AI Response */}
      <div className="mb-4 flex rounded-xl bg-slate-50 px-2 py-6 dark:bg-slate-900 sm:px-4">
        <Image
          className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
          src={AIIMAGE}
          alt="AI"
        />
        <div className="flex max-w-3xl items-center rounded-xl">
          {formatResponse(aiResponse)}
        </div>
      </div>

      {/* SVG Buttons (Optional, depending on functionality) */}
      <div className="mb-2 flex w-full flex-row justify-end gap-x-2 text-slate-500">
        {/* SVG buttons here */}
      </div>
    </div>
  );
};

export default ChatMessage;
