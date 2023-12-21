import Image from "next/image";
import HUMAN from "/public/human.png";
import AIIMAGE from "/public/ai.png";

const UiMessage = ({ sender, message }: { sender: any; message: any }) => {
  return (
    <div
      className={`message ${sender === "User" ? "user-message" : "ai-message"}`}
    >
      <div className="flex flex-row px-2 py-4 sm:px-4">
        <Image
          className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
          src={sender === "User" ? HUMAN : AIIMAGE}
          alt={sender}
        />
        <div className="flex max-w-3xl items-center">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default UiMessage;
