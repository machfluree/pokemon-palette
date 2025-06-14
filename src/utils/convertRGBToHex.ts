export function rgbStringToHex(rgbStr: string): string {
  // Extract numbers from the string using regex
  const match = rgbStr.match(/\d+/g);
  if (!match || match.length < 3) {
    throw new Error("Invalid RGB string format");
  }

  // Convert extracted strings to numbers
  const rgb = match.slice(0, 3).map(Number) as [number, number, number];

  // Convert RGB array to hex
  return rgbToHex(rgb);
}

export function rgbToHex(rgb: [number, number, number]): string {
  return (
    "#" +
    rgb
      .map((channel) => {
        const hex = Math.round(channel).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
      .toUpperCase()
  );
}