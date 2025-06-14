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
   const palette = useColorWorker(imageData, 3);
   console.log(palette)
   return (
      <div className="py-4">
         <canvas ref={canvasRef} style={{ display: "none" }} />
         <p>Manual Mode (using color worker)</p>
         <div className="flex flex-row gap-4">
            {palette?.map((color) => (
               <div className="">
                  <div
                     key={color}
                     className="w-24 h-24 rounded"
                     style={{ backgroundColor: color }}
                  ></div>
                  <div>{color}</div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default PokemonColorPalette;
