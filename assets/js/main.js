const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

// === Modal: abrir detalhes ao clicar no Pokémon ===
function showPokemonDetails(pokemon) {
  const modal = document.getElementById('pokemon-modal');
  const detailsContainer = document.getElementById('pokemon-details');
  if (!modal || !detailsContainer) return;

  detailsContainer.innerHTML = `
    <h2>${pokemon.name} (#${pokemon.number})</h2>
    <img src="${pokemon.photo}" alt="${pokemon.name}">
    <ol class="types">
      ${pokemon.types.map((t) => `<li class="type ${t}">${t}</li>`).join('')}
    </ol>
    <p><strong>Altura:</strong> ${(pokemon.height ?? 0) / 10} m</p>
    <p><strong>Peso:</strong> ${(pokemon.weight ?? 0) / 10} kg</p>
    ${pokemon.stats ? `<h3>Estatísticas</h3>
    <ul class="stats">
      ${pokemon.stats.map(s => `<li><span>${s.name}</span><span>${s.value}</span></li>`).join('')}
    </ul>` : ''}
  `;

  modal.classList.remove('hidden');
}

function closePokemonModal() {
  const modal = document.getElementById('pokemon-modal');
  if (modal) modal.classList.add('hidden');
}

// Fechar no [X], clique fora e tecla ESC
(function bindModalCloseEvents() {
  const modal = document.getElementById('pokemon-modal');
  if (!modal) return;
  const closeBtn = modal.querySelector('.close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closePokemonModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePokemonModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePokemonModal();
  });
})();

// Delegação de eventos: ouve cliques na lista e abre o modal
pokemonList.addEventListener('click', async (e) => {
  const li = e.target.closest('li.pokemon');
  if (!li) return;
  const id = li.getAttribute('data-id');
  try {
    const details = await pokeApi.getPokemonDetailById(id);
    showPokemonDetails(details);
  } catch (err) {
    console.error('Erro ao carregar detalhes do Pokémon', err);
  }
});
