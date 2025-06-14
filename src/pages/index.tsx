import { useState } from "react";
import { fetchPokemon } from "@/utils/fetchPokemonApi";
import { getPalette } from "@/utils/getPokemonColorPalette";
import { getPaletteManually } from "@/utils/getPaletteManually";
import PokemonColorPalette from "@/components/PokemonPalette";
import { rgbStringToHex } from "@/utils/convertRGBToHex";

export default function Home() {
  const [name, setName] = useState("");
  const [pokemon, setPokemon] = useState<{ name: string; image: string } | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [paletteM, setPaletteM] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSearch = async () => {
    try {
      const data = await fetchPokemon(name);
      console.log("Fetched Pokémon data:", data);
      setPokemon(data);
      setImageUrl(data.image);
      setError("");

      const colors = await getPalette(data.image, 3);
      const colorsHex = colors.map(color => rgbStringToHex(color))
      setPalette(colorsHex);
      const colorsM = await getPaletteManually(data.image, 3, 0.4);
      setPaletteM(colorsM);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
      setError("Pokémon not found or image error");
      setPokemon(null);
      setPalette([]);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Pokémon Palette</h1>

      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Search a pokemon (e.g. pikachu)"
          className="px-3 py-2 rounded border w-[18rem]"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {pokemon && (
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <img src={pokemon.image} alt={pokemon.name} className="w-86 h-86 object-contain mx-auto" />
          </div>

          <div>
            <h2 className="text-xl mx-4 my-4 font-semibold capitalize">{pokemon.name}</h2>
            {palette.length > 0 && (
              <div className="">
                <p className="mx-4">Auto Mode (using colorthief)</p>
                <div className="flex justify-center gap-4">
                  {palette.map((color, idx) => (
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
            )}

            {/* {paletteM.length > 0 && (
            <div className="flex justify-center mt-4 gap-2">
              {paletteM.map((color, idx) => (
                <div
                  key={idx}
                  className="w-24 h-24 rounded shadow"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )} */}

            <div className="flex justify-center mx-4">
              <PokemonColorPalette imageUrl={imageUrl} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
