// src/App.jsx
import React, { useState } from 'react';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import './App.css';

function App() {
  // Estados para gerenciar dados da API
  const [paises, setPaises] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [favoritos, setFavoritos] = useState([]);

  // Simulação de dados (será substituída por API real)
  const dadosSimulados = [
    {
      name: { common: "Brasil" },
      capital: ["Brasília"],
      population: 215353593,
      region: "Americas",
      flag: "🇧🇷",
      cca3: "BRA"
    },
    {
      name: { common: "França" },
      capital: ["Paris"],
      population: 67391582,
      region: "Europe",
      flag: "🇫🇷",
      cca3: "FRA"
    }
  ];

  // Função que simula busca da API
  const buscarPaises = async () => {
    setCarregando(true);
    setErro(null);

    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simular possível erro (30% de chance)
      if (Math.random() < 0.3) {
        throw new Error('Erro de conexão com o servidor');
      }

      setPaises(dadosSimulados);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  const toggleFavorito = (paisCodigo) => {
    setFavoritos(prev => 
      prev.includes(paisCodigo)
        ? prev.filter(codigo => codigo !== paisCodigo)
        : [...prev, paisCodigo]
    );
  };

  // Carregar dados na inicialização (será substituído por useEffect)
  React.useEffect(() => {
    buscarPaises();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌍 Lista de Países</h1>
        <p>Dados obtidos via API REST Countries</p>

        {paises.length > 0 && (
          <div className="stats">
            <span>📊 {paises.length} países</span>
            <span>❤️ {favoritos.length} favoritos</span>
          </div>
        )}
      </header>

      <main className="main-content">
        {carregando && <Loading />}

        {erro && (
          <ErrorMessage 
            mensagem={erro} 
            onTentar={buscarPaises}
          />
        )}

        {!carregando && !erro && paises.length > 0 && (
          <div className="countries-grid">
            {paises.map(pais => (
              <CountryCard 
                key={pais.cca3}
                pais={pais}
                isFavorito={favoritos.includes(pais.cca3)}
                onToggleFavorito={() => toggleFavorito(pais.cca3)}
              />
            ))}
          </div>
        )}

        {!carregando && !erro && paises.length === 0 && (
          <div className="empty-state">
            <p>🌍 Nenhum país encontrado</p>
            <button onClick={buscarPaises}>Carregar Países</button>
          </div>
        )}
      </main>
    </div>
  );
}

// Componente CountryCard atualizado para dados de API
function CountryCard({ pais, isFavorito, onToggleFavorito }) {
  return (
    <div className="country-card">
      <div className="country-flag">{pais.flag}</div>
      <div className="country-info">
        <h2>{pais.name.common}</h2>
        <p><strong>Capital:</strong> {pais.capital?.[0] || 'N/A'}</p>
        <p><strong>População:</strong> {pais.population.toLocaleString()}</p>
        <p><strong>Região:</strong> {pais.region}</p>

        <button 
          className={`favorite-btn ${isFavorito ? 'favorited' : ''}`}
          onClick={onToggleFavorito}
        >
          {isFavorito ? '❤️ Remover' : '🤍 Favoritar'}
        </button>
      </div>
    </div>
  );
}

export default App;