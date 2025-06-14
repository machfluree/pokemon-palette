import React, { useEffect, useRef, useState } from "react";
import { useColorWorker } from "@/hooks/useColorWorker";
import { getPalette } from "@/utils/getPokemonColorPalette";

type Props = {
   imageUrl: string;
};

const PokemonColorPalette = ({ imageUrl }: Props) => {
   const [imageData, setImageData] = useState<ImageData | null>(null);
   const [getColorPaletteMode, setGetColorPaletteMode] = useState<'Manual' | 'Colorthief'>('Colorthief');
   // const [colorThiefPalette, setColorThiefPalette] = useState<string[]>([]);
   const canvasRef = useRef<HTMLCanvasElement>(null);

   // Draw image to canvas and get pixel data
   useEffect(() => {
      if (!imageUrl) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;

      img.onload = () => {
         const canvas = canvasRef.current;
         if (!canvas) return;
         canvas.width = img.width;
         canvas.height = img.height;
         const ctx = canvas.getContext("2d", { willReadFrequently: true });
         if (!ctx) return;
         ctx.drawImage(img, 0, 0);
         const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
         setImageData(data);
      };
   }, [imageUrl]);

   // Use hook to get palette from worker
   const palette = useColorWorker(imageData, 5);
   return (
      <div>
         <canvas ref={canvasRef} style={{ display: "none" }} />
         <div className="flex space-x-2 mt-4">
            {palette?.map((color) => (
               <div
                  key={color}
                  className="w-16 h-16 rounded"
                  style={{ backgroundColor: color }}
               />
            ))}
         </div>
      </div>
   );
};

export default PokemonColorPalette;
