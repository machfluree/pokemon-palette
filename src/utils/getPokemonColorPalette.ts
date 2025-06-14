import ColorThief from "colorthief";

export const getPalette = async (imageUrl: string, colorCount = 5) => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageUrl;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (err) => reject(err);
  });

  const colorThief = new ColorThief();
  const palette = colorThief.getPalette(img, colorCount);
  return palette.map((rgb) => `rgb(${rgb.join(",")})`);
};
