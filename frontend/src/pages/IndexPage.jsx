import MachinerySection from '@/components/MachinerySection';
import LivestockSection from '@/components/LivestockSection';
import CostCalculator from '@/components/CostCalculator';
import WeatherPicker from '@/components/WeatherPicker';
import QuotesList from '@/components/QuotesList';
import Card from '@/components/Card';

/**
 * Página principal de la aplicación (ruta "/"): reúne todas las secciones de gestión.
 * @method IndexPage
 * @return {JSX.Element} Contenido de la página principal
 */
const IndexPage = () => (
  <div>
    <section id="inicio" className="hero">
      <div className="overlay">
        <h2>🌾 AgroGestión 360 🌾</h2>
        <p>Gestión integral para maquinaria, animales y costos de siembra en un solo lugar.</p>
      </div>
    </section>

    <MachinerySection />
    <LivestockSection />
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

export default IndexPage;
