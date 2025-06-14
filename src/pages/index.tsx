import { useState } from "react";
import { fetchPokemon } from "@/utils/fetchPokemonApi";
import { getPalette } from "@/utils/getPokemonColorPalette";
import { getPaletteManually } from "@/utils/getPaletteManually";
import PokemonColorPalette from "@/components/PokemonPalette";

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

      const colors = await getPalette(data.image, 4);
      setPalette(colors);
      const colorsM = await getPaletteManually(data.image, 6, 0.8);
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
          placeholder="e.g., pikachu"
          className="px-3 py-2 rounded border"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {pokemon && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold capitalize">{pokemon.name}</h2>
          <img src={pokemon.image} alt={pokemon.name} className="w-128 h-128 object-contain mx-auto" />

          {/* {palette.length > 0 && (
            <div className="flex justify-center mt-4 gap-2">
              {palette.map((color, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 rounded shadow"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}

          {paletteM.length > 0 && (
            <div className="flex justify-center mt-4 gap-2">
              {paletteM.map((color, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 rounded shadow"
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
      )}
    </main>
  );
}
