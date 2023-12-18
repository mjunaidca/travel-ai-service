"use client";

import { cn } from "@/lib/utils";
import { useFeatureStore } from "@/store/FeatureStore";
import { motion } from "framer-motion";

type Props = {
  id: string;
};

type VisualProps = {
  children: React.ReactNode;
} & Props;

const Visual = ({ children, id }: VisualProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 flex items-center justify-center opacity-0",
        `visual-${id}`
      )}
    >
      <div className="max-w-6xl px-4">{children}</div>
    </div>
  );
};

export default Visual;

export const MusicVisual = ({ id }: Props) => {
  const fullscreenFeature = useFeatureStore((store) => store.fullscreenFeature);
  const isFullscreen = fullscreenFeature === id;

  return (
    <Visual id={id}>
      {/* <Image alt="" src={SPOTIFYVISUAL} /> */}
      {isFullscreen && (
        <motion.div
          layoutId="spotify-logo"
          className="absolute left-[61.7%] top-[53%] h-48 w-[10px] rounded-[10px] bg-[#1bd761] p-[1px] shadow-lg"
        ></motion.div>
      )}
    </Visual>
  );
};
export const OtherVisual = ({ id }: Props) => {
  return (
    <Visual id={id}>
      {/* <Image alt="" src={SPOTIFYVISUAL} /> */}
      <>Hello</>
    </Visual>
  );
};
