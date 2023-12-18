"use client";

import { cn } from "@/lib/utils";
import { useFeatureStore } from "@/store/FeatureStore";
import Image from "next/image";
// import IMAGE1 from "../../../../public/spotify-card/song-1.webp";
// import IMAGE2 from "../../../../public/spotify-card/song-2.webp";
// import IMAGE3 from "../../../../public/spotify-card/song-3.webp";
import { motion } from "framer-motion";

type FeatureCardProps = {
  gradient: string;
  children: React.ReactNode;
} & CardProps;

type CardProps = {
  id: string;
};

const FeatureCard = ({ gradient, children, id }: FeatureCardProps) => {
  const inViewFeature = useFeatureStore((state) => state.inViewFeature);
  const setFullscreenFeature = useFeatureStore(
    (state) => state.setFullscreenFeature
  );

  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full rounded-2xl transition-opacity",
        inViewFeature === id
          ? "active-card opacity-100"
          : "pointer-events-none opacity-0"
      )}
    >
      <div
        className={cn(
          "gradient absolute inset-0 origin-bottom-left rounded-2xl bg-gradient-to-br",
          gradient
        )}
      />
      {children}
      {/* <button
        onClick={() => setFullscreenFeature(id)}
        className="show-me-btn absolute bottom-6 right-6 rounded-xl bg-black px-4 py-2 text-white shadow-lg"
      >
        Show me
      </button> */}
    </div>
  );
};

export const Todo = ({ id }: CardProps) => {
  return (
    <FeatureCard id={id} gradient="from-[#f7f0ff] to-[#a78afe]">
      <span />
    </FeatureCard>
  );
};

export const Colors = ({ id }: CardProps) => {
  return (
    <FeatureCard id={id} gradient="from-[#f5fbff] to-[#addeff]">
      <span />
    </FeatureCard>
  );
};

export const Availability = ({ id }: CardProps) => {
  return (
    <FeatureCard id={id} gradient="from-[#f5fff7] to-[#adf8ff]">
      <span />
    </FeatureCard>
  );
};

export const Music = ({ id }: CardProps) => {
  const fullscreenFeature = useFeatureStore((store) => store.fullscreenFeature);
  const isFullscreen = fullscreenFeature === id;

  return (
    <FeatureCard id={id} gradient="from-[#f7fff5] to-[#adffd8]">
      {!isFullscreen && (
        <motion.div
          layoutId="spotify-logo"
          className="absolute left-[40%] top-32 h-48 w-24 rounded-[96px] bg-[#1bd761] p-3 shadow-lg"
        >
          Coal
        </motion.div>
      )}
    </FeatureCard>
  );
};

export const SchedulingLinks = ({ id }: CardProps) => {
  return (
    <FeatureCard id={id} gradient="from-[#fff7f5] to-[#ffd8ad]">
      <span />
    </FeatureCard>
  );
};

export const Team = ({ id }: CardProps) => {
  return (
    <FeatureCard id={id} gradient="from-[#fef5ff] to-[#ffade1]">
      <span />
    </FeatureCard>
  );
};
