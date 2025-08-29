
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

// Detalhes completos por ID (para o modal)
pokeApi.getPokemonDetailById = (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  return fetch(url)
    .then((response) => response.json())
    .then((poke) => {
      return {
        number: poke.id,
        name: poke.name,
        types: poke.types.map((t) => t.type.name),
        photo:
          poke.sprites.other?.['official-artwork']?.front_default ||
          poke.sprites.other?.dream_world?.front_default ||
          poke.sprites.front_default,
        height: poke.height,
        weight: poke.weight,
        stats: poke.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
      };
    });
};
