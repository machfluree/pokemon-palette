// utils/getPaletteManual.ts

export const getPaletteManually = async (
  imageUrl: string,
  colorCount = 5,
  sampleRate = 0.1
): Promise<string[]> => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageUrl;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (e) => reject(e);
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const colorMap = new Map<string, number>();

  // Quantize colors into buckets of size 16 (better granularity)
  const quantize = (r: number, g: number, b: number) =>
    [r, g, b].map((c) => Math.round(c / 16) * 16).join(",");

  // Helper: convert rgb string to hex
  const rgbToHex = (rgb: string) => {
    const [r, g, b] = rgb.split(",").map(Number);
    return (
      "#" +
      [r, g, b]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase()
    );
  };

  // Iterate pixels, skip edges, near-white pixels, and sample randomly
  for (let y = 5; y < height - 5; y++) {
    for (let x = 5; x < width - 5; x++) {
      if (Math.random() > sampleRate) continue; // sampling

      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];
      if (alpha < 128) continue; // skip transparent
      if (r > 240 && g > 240 && b > 240) continue; // skip near white

      const key = quantize(r, g, b);
      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }
  }

  // Sort colors by frequency desc, take top colorCount, convert to HEX
  const sortedColors = [...colorMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, colorCount)
    .map(([key]) => rgbToHex(key));

  return sortedColors;
};
