import axios from "axios";

export const fetchPokemon = async (name: string) => {
  const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
  const sprites = res.data.sprites;

  return {
    name: res.data.name,
    image: sprites.other["official-artwork"].front_default,
  };
};
