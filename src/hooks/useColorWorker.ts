// utils/useColorWorker.ts
import { useEffect, useRef, useState } from "react";

export const useColorWorker = (imageData: ImageData | null, colorCount = 5) => {
  const workerRef = useRef<Worker | null>(null);
  const [palette, setPalette] = useState<string[] | null>(null);

  useEffect(() => {
    if (!imageData) {
      setPalette(null);
      return;
    }

    if (!workerRef.current) {
      workerRef.current = new Worker(new URL("../utils/colorWorker.ts", import.meta.url), {
        type: "module",
      });
    }

    workerRef.current.onmessage = (e) => {
      setPalette(e.data);
    };

    workerRef.current.postMessage({ imageData, colorCount });

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [imageData, colorCount]);

  return palette;
};
