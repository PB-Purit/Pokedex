import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Pokemon {
  name: string;
  types: Array<{ type: { name: string } }>;
  sprites: {
    front_default: string;
  };
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
}

function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pokemonsPerPage = 12;

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const offset = (currentPage - 1) * pokemonsPerPage;
        const responses = await Promise.all(
          Array.from({ length: pokemonsPerPage }, (_, i) =>
            axios.get(`https://pokeapi.co/api/v2/pokemon/${offset + i + 1}`)
          )
        );
        setPokemons(responses.map(res => res.data));

        // Get total count of Pokemon for pagination
        const totalCountResponse = await axios.get('https://pokeapi.co/api/v2/pokemon');
        setTotalPages(Math.ceil(totalCountResponse.data.count / pokemonsPerPage));
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
      }
    };

    fetchPokemons();
  }, [currentPage]);

  const handleSearch = async () => {
    if (!searchTerm) return;
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
      setPokemons([response.data]);
      setCurrentPage(1);
      setTotalPages(1);
    } catch (error) {
      console.error('Error searching Pokemon:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const menuItems = [
    { name: 'Home', action: () => window.location.reload() },
    { name: 'All Pokémon', action: () => window.location.reload() },
    { name: 'Types', action: () => alert('Types feature coming soon!') },
    { name: 'Favorites', action: () => alert('Favorites feature coming soon!') },
    { name: 'About', action: () => alert('About feature coming soon!') },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hamburger Menu */}
      <div
        className={`fixed inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } w-64 bg-red-600 text-white transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Menu</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white hover:text-yellow-300"
            >
              ✕
            </button>
          </div>
          <nav>
            <ul className="space-y-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      item.action();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left py-2 px-4 hover:bg-red-700 rounded transition-colors duration-200"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Header with gradient border */}
      <header className="bg-red-600 p-4 relative">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500"></div>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-white hover:text-yellow-300 p-2"
          >
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-current"></div>
              <div className="w-6 h-0.5 bg-current"></div>
              <div className="w-6 h-0.5 bg-current"></div>
            </div>
          </button>
          <h1 className="text-white text-4xl font-bold text-center flex-grow md:text-5xl lg:text-6xl">Pokédex</h1>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-2 max-w-md mx-auto mt-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`w-full px-4 py-2 rounded-lg transition-all duration-200 outline-none ${isSearchFocused ? 'ring-2 ring-yellow-400' : ''
                }`}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-yellow-400 px-6 py-2 rounded-lg text-gray-800 font-bold hover:bg-yellow-300 transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 md:p-8 bg-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {pokemons.map((pokemon, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-4 transform hover:scale-105 transition-transform duration-200 cursor-pointer"
              onClick={() => setSelectedPokemon(pokemon)}
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full bg-gray-100 overflow-hidden border-4 border-yellow-400">
                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="w-full h-full object-contain animate-bounce"
                />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-center capitalize mt-2">
                {pokemon.name}
              </h2>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {pokemon.types.map((type, typeIndex) => (
                  <span
                    key={typeIndex}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${currentPage === 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-yellow-400 hover:bg-yellow-300'
                }`}
            >
              Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNumber = totalPages - 3 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 rounded-lg ${currentPage === pageNumber
                      ? 'bg-red-600 text-white'
                      : 'bg-yellow-400 hover:bg-yellow-300'
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${currentPage === totalPages
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-yellow-400 hover:bg-yellow-300'
                }`}
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Pokemon Detail Modal */}
      {selectedPokemon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl sm:text-2xl font-bold capitalize">{selectedPokemon.name}</h2>
              <button
                onClick={() => setSelectedPokemon(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full bg-gray-100 overflow-hidden border-4 border-yellow-400 mb-4">
              <img
                src={selectedPokemon.sprites.front_default}
                alt={selectedPokemon.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {selectedPokemon.types.map((type, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
              <div className="space-y-2">
                {selectedPokemon.stats.map((stat, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-24 text-sm capitalize">{stat.stat.name}:</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm">{stat.base_stat}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Height: {selectedPokemon.height / 10}m</div>
                <div>Weight: {selectedPokemon.weight / 10}kg</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 Pokédex by PB. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;