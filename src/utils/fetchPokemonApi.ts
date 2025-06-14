import axios from "axios";

export const fetchPokemon = async (name: string) => {
  const normPokemonName = name.toLowerCase().trim().replace(/\s+/g, '-');
  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${normPokemonName}`);
  const sprites = res.data.sprites;

  return {
    name: res.data.name,
    image: sprites.other["official-artwork"].front_default,
  };
};
