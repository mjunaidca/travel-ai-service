"use client";
import { FeatureTitle } from "@/components/FeatureTitle";
import {
  Availability,
  Colors,
  Music,
  SchedulingLinks,
  Team,
  Todo,
} from "@/components/AnimatedCards";
import { MusicVisual, OtherVisual } from "@/components/Visuals";
import { useFeatureStore } from "@/store/FeatureStore";
import { delay, stagger, useAnimate } from "framer-motion";
import { useEffect } from "react";
import { useEscapePress } from "@/hooks/UseEscapePressa";
import { useHidePageOverflow } from "@/hooks/TogglePageOverflow";
import Image from "next/image";
import DownArrow from "../../../public/down.png";
const features = [
  {
    title: "GeminiPro Streaming FastAPI",
    id: "todo-list",
    card: Todo,
    visual: OtherVisual,
  },
  {
    title: "OpenAI Assistants FastAPI",
    id: "colors",
    card: Colors,
    visual: OtherVisual,
  },
  {
    title: "AI-Powered Interactive Maps",
    id: "todo",
    card: Todo,
    visual: OtherVisual,
  },
  {
    title: "Serverless PostgreSQL with SQL Alchemy ORM",
    id: "scheduling-links",
    card: SchedulingLinks,
    visual: OtherVisual,
  },
  {
    title: "Frontend in NextJS14 & Streamlit",
    id: "team",
    card: Team,
    visual: OtherVisual,
  },
  {
    title: "Containerized FastAPI on Google Cloud Run",
    id: "availability",
    card: Availability,
    visual: OtherVisual,
  },
];

export const AnimatedPage = () => {
  const [scope, animate] = useAnimate();
  const fullscreenFeature = useFeatureStore((store) => store.fullscreenFeature);

  const setFullscreenFeature = useFeatureStore(
    (state) => state.setFullscreenFeature
  );

  const lastFullscreenFeature = useFeatureStore(
    (state) => state.lastFullscreenFeature
  );
  const onEscapePress = () => {
    if (fullscreenFeature) setFullscreenFeature(null);
  };

  useEscapePress(onEscapePress);
  useHidePageOverflow(!!fullscreenFeature);

  useEffect(() => {
    if (fullscreenFeature) {
      animate([
        [
          ".feature-title",
          { opacity: 0, x: "-200px" },
          { duration: 0.3, delay: stagger(0.05) },
        ],
        [
          `.visual-${lastFullscreenFeature}`,
          { opacity: 1, scale: 1, pointerEvents: "auto" },
          { at: "<" },
        ],
        [".active-card .gradient", { opacity: 0, scale: 0 }, { at: "<" }],
        [".active-card .show-me-btn", { opacity: 0 }, { at: "<" }],
        [
          ".back-to-site-btn",
          { opacity: 1, y: "0px" },
          { at: "<", duration: 0.3 },
        ],
      ]);
    } else {
      animate([
        [
          ".feature-title",
          { opacity: 1, x: "0px" },
          { duration: 0.3, delay: stagger(0.05) },
        ],
        [
          `.visual-${lastFullscreenFeature}`,
          { opacity: 0, scale: 0.75, pointerEvents: "none" },
          { at: "<" },
        ],
        [".active-card .gradient", { opacity: 1, scale: 1 }, { at: "<" }],
        [
          ".back-to-site-btn",
          { opacity: 0, y: "300px" },
          { at: "<", duration: 0.3 },
        ],
        [".active-card .show-me-btn", { opacity: 1 }],
      ]);
    }
  }, [animate, fullscreenFeature, lastFullscreenFeature]);

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex justify-center  sm:pt-4 md:pt-8 animate-bounce">
        <div className=" w-7 sm:w-10 xl:w-12">
          <Image src={DownArrow} alt={"Down Arrow"} />
        </div>
      </div>
      <div ref={scope}>
        {features.map((feature) => (
          <feature.visual id={feature.id} key={feature.id} />
        ))}
        <div className="flex w-full items-start gap-20">
          <div className="w-full py-[10vh] pb-[18vh]">
            <ul>
              {features.map((feature) => (
                <li key={feature.id}>
                  <FeatureTitle id={feature.id}>{feature.title}</FeatureTitle>
                </li>
              ))}
            </ul>
          </div>
          <div className="sticky top-0 flex h-screen w-full items-center">
            <div className="relative aspect-square w-full rounded-2xl bg-gray-100 [&:has(>_.active-card)]:bg-transparent">
              {features.map((feature) => (
                <feature.card id={feature.id} key={feature.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
