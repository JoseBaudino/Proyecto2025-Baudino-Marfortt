import MachinerySection from '@/components/MachinerySection';
import LivestockSection from '@/components/LivestockSection';
import CostCalculator from '@/components/CostCalculator';
import WeatherPicker from '@/components/WeatherPicker';
import QuotesList from '@/components/QuotesList';
import SummaryPanel from '@/components/SummaryPanel';
import Card from '@/components/Card';
import useLocalStorage from '@/hooks/useLocalStorage';
import { CLAVES } from '@/utils/storage';

/**
 * Página principal de la aplicación (ruta "/"): reúne todas las secciones de gestión.
 * Guarda acá la maquinaria y la ganadería para que el panel de resumen y las secciones
 * usen los mismos datos.
 * @method IndexPage
 * @return {JSX.Element} Contenido de la página principal
 */
const IndexPage = () => {
  const [maquinas, setMaquinas] = useLocalStorage(CLAVES.MAQUINARIA, []);
  const [razas, setRazas] = useLocalStorage(CLAVES.GANADERIA, []);

  return (
    <div>
      <section id="inicio" className="hero hero-compacto">
        <div className="overlay">
          <h2>🌾 AgroGestión 360 🌾</h2>
          <p>Gestión integral para maquinaria, animales y costos de siembra en un solo lugar.</p>
          <SummaryPanel maquinas={maquinas} razas={razas} />
        </div>
      </section>

      <MachinerySection maquinas={maquinas} setMaquinas={setMaquinas} />
      <LivestockSection razas={razas} setRazas={setRazas} />
      <CostCalculator />

      <section id="clima" className="section">
        <h2>Clima</h2>
        <p>Seleccioná un punto en el mapa para ver el clima actual y la probabilidad de lluvia.</p>
        <Card>
          <WeatherPicker />
        </Card>
      </section>

      <section id="bolsa" className="section">
        <h2>Bolsa de Cereales</h2>
        <QuotesList />
      </section>
    </div>
  );
};

export default IndexPage;
