import ContentCard from './components/main_Card';
import Header from './components/header';
import './App.css';

function App() {
  const peliculas = {
    Peliculas1:{ Nombre:"Harry Potter 1", fechaLanzamiento:"2001" },
    Peliculas2:{ Nombre:"Harry Potter 2", fechaLanzamiento:"2002" },
    Peliculas3:{ Nombre:"Harry Potter 3", fechaLanzamiento:"2003" },
    Peliculas4:{ Nombre:"Harry Potter 4", fechaLanzamiento:"2004" },
    Peliculas5:{ Nombre:"Harry Potter 5", fechaLanzamiento:"2005" },
    Peliculas6:{ Nombre:"Harry Potter 6", fechaLanzamiento:"2006" },
    Peliculas7:{ Nombre:"Harry Potter 7", fechaLanzamiento:"2007" },
    Peliculas8:{ Nombre:"Harry Potter 8", fechaLanzamiento:"2008" }
  };

  return (
    <div className="App">
      <Header />
      <div style={{ display: 'flex' }}>
        {Object.entries(peliculas).map(([clave, valor]) => (
          <ContentCard
            key={clave}
            titulo={valor.Nombre}
            anio={valor.fechaLanzamiento}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
