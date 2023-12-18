"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFeatureStore } from "@/store/FeatureStore";

type Props = {
  children: React.ReactNode;
  id: string;
};

export const FeatureTitle = ({ children, id }: Props) => {
  const ref = useRef<HTMLParagraphElement>(null);
  // const documentRef = useRef<Document | undefined>(undefined);
  const isInView = useInView(ref, {
    margin: "-50% 0px -50% 0px",
    // NOTE: The only reason we pass in the document here, is because
    // of security restrictions set by the browser when using an iFrame.
    // In an iFrame (so eg in the preview on frontend.fyi),
    // margin won't take effect unless you specify the root manually.
    // By default it will be the window element, which is what we want in this case.
    // If you specify your own root, you can usually only pass in an Element, and
    // not the document (since document/window is the default). However, in order
    // to fix the issue in the iframe, we need to pass in the document here and thus
    // tell TypeScript that we know what we're doing. If you're implementing
    // this in your own website, you can just pass in the root property as well as the documentRef.
    // @ts-ignore
    root: typeof window !== "undefined" ? document : undefined,
  });
  const setInViewFeature = useFeatureStore((state) => state.setInViewFeature);
  const inViewFeature = useFeatureStore((state) => state.inViewFeature);

  useEffect(() => {
    if (isInView) setInViewFeature(id);
    if (!isInView && inViewFeature === id) setInViewFeature(null);
  }, [isInView, id, setInViewFeature, inViewFeature]);

  return (
    <p
      ref={ref}
      className={cn(
        "feature-title py-16 font-heading text-5xl transition-colors",
        isInView ? "text-black" : "text-gray-300"
      )}
    >
      {children}
    </p>
  );
};
