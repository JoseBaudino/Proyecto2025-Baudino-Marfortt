import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';
import CostCalculator from '@/components/CostCalculator';
import LivestockSection from '@/components/LivestockSection';
import MachinerySection from '@/components/MachinerySection';
import SummaryPanel from '@/components/SummaryPanel';
import useLocalStorage from '@/hooks/useLocalStorage';
import { CLAVES } from '@/utils/storage';

/**
 * Renderiza la sección de ganadería con su lista guardada en localStorage (como en IndexPage).
 * @method Ganaderia
 * @return {JSX.Element} Sección de ganadería
 */
const Ganaderia = () => {
  const [razas, setRazas] = useLocalStorage(CLAVES.GANADERIA, []);
  return <LivestockSection razas={razas} setRazas={setRazas} />;
};

/**
 * Renderiza la sección de maquinaria con su lista guardada en localStorage (como en IndexPage).
 * @method Maquinaria
 * @return {JSX.Element} Sección de maquinaria
 */
const Maquinaria = () => {
  const [maquinas, setMaquinas] = useLocalStorage(CLAVES.MAQUINARIA, []);
  return <MachinerySection maquinas={maquinas} setMaquinas={setMaquinas} />;
};

const MAQUINAS_DEMO = [
  { id: '1', name: 'John Deere 6145J', type: 'Tractor', condition: 'Activo', price: 85000, notes: '', photo: null },
  { id: '2', name: 'Pla MV 3000', type: 'Pulverizadora', condition: 'Inactivo', price: 42000, notes: '', photo: null },
];

beforeEach(() => {
  localStorage.clear();
  window.location.hash = '';
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Calculadora de costos', () => {
  test('al calcular sin datos avisa con alert y marca los campos obligatorios', async () => {
    render(<CostCalculator />);
    await userEvent.click(screen.getByRole('button', { name: 'Calcular' }));
    expect(window.alert).toHaveBeenCalled();
    expect(screen.getAllByText('Este campo es obligatorio')).toHaveLength(3);
  });

  test('valida en tiempo real y blanquea el campo con letras al enviar', async () => {
    render(<CostCalculator />);
    const hectareas = screen.getByLabelText('Hectáreas *');
    await userEvent.type(hectareas, 'abc');
    expect(screen.getByRole('alert')).toHaveTextContent('Ingrese solo números');
    await userEvent.click(screen.getByRole('button', { name: 'Calcular' }));
    expect(hectareas).toHaveValue('');
  });

  test('con datos válidos muestra el resultado', async () => {
    render(<CostCalculator />);
    await userEvent.type(screen.getByLabelText('Hectáreas *'), '10');
    await userEvent.type(screen.getByLabelText('Dosis de semilla (kg/ha) *'), '80');
    await userEvent.type(screen.getByLabelText('Precio semilla (USD/kg) *'), '1');
    await userEvent.click(screen.getByRole('button', { name: 'Calcular' }));
    expect(window.alert).not.toHaveBeenCalled();
    expect(screen.getByText(/Costo total/).parentElement).toHaveTextContent('USD 800,00');
  });
});

describe('Ganadería', () => {
  /**
   * Completa y envía el formulario de ganadería.
   * @method agregarRaza
   * @param {string} tipo - Tipo de animal
   * @param {string} raza - Nombre de la raza
   * @param {string} cantidad - Cantidad inicial
   * @return {Promise<void>}
   */
  const agregarRaza = async (tipo, raza, cantidad) => {
    await userEvent.selectOptions(screen.getByLabelText('Tipo de animal'), tipo);
    await userEvent.type(screen.getByLabelText('Raza'), raza);
    await userEvent.clear(screen.getByLabelText('Cantidad inicial'));
    await userEvent.type(screen.getByLabelText('Cantidad inicial'), cantidad);
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));
  };

  test('agrega una raza, suma con +1 y la guarda en localStorage', async () => {
    render(<Ganaderia />);
    await agregarRaza('Vaca', 'Angus', '5');

    const [item] = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(item).toHaveTextContent('Angus: 5 animales');
    await userEvent.click(within(item).getByRole('button', { name: 'Sumar un animal a Angus' }));
    expect(item).toHaveTextContent('Angus: 6 animales');
    expect(JSON.parse(localStorage.getItem('agroGestion_breeds'))[0].count).toBe(6);
  });

  test('no permite cargar dos veces la misma raza para el mismo animal', async () => {
    render(<Ganaderia />);
    await agregarRaza('Vaca', 'Angus', '5');
    await agregarRaza('Vaca', 'angus', '3');

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('ya está registrada'));
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(1);
  });
});

describe('Maquinaria', () => {
  test('el buscador y el filtro por estado filtran la lista en tiempo real', async () => {
    localStorage.setItem(CLAVES.MAQUINARIA, JSON.stringify(MAQUINAS_DEMO));
    render(<Maquinaria />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);

    await userEvent.type(screen.getByLabelText('Buscar'), 'pulv');
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Pla MV 3000' })).toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText('Estado', { selector: '#m-filtro-estado' }), 'Activo');
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.getByText('Ninguna máquina coincide con la búsqueda.')).toBeInTheDocument();
  });
});

describe('Cambio de estado de maquinaria', () => {
  test('el botón Desactivar/Activar cambia el estado y lo guarda', async () => {
    localStorage.setItem(CLAVES.MAQUINARIA, JSON.stringify(MAQUINAS_DEMO));
    render(<Maquinaria />);

    await userEvent.click(screen.getByRole('button', { name: 'Desactivar John Deere 6145J' }));
    expect(screen.getByRole('button', { name: 'Activar John Deere 6145J' })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(CLAVES.MAQUINARIA))[0].condition).toBe('Inactivo');

    await userEvent.click(screen.getByRole('button', { name: 'Activar Pla MV 3000' }));
    expect(JSON.parse(localStorage.getItem(CLAVES.MAQUINARIA))[1].condition).toBe('Activo');
  });
});

describe('Panel de resumen', () => {
  test('calcula máquinas activas, total de animales y valor de la maquinaria', () => {
    const razas = [{ type: 'Vaca', name: 'Angus', count: 120 }, { type: 'Toro', name: 'Hereford', count: 4 }];
    render(<SummaryPanel maquinas={MAQUINAS_DEMO} razas={razas} />);
    expect(screen.getByText('Máquinas activas').nextSibling).toHaveTextContent('1 / 2');
    expect(screen.getByText('Animales').nextSibling).toHaveTextContent('124');
    expect(screen.getByText('Valor de la maquinaria').nextSibling).toHaveTextContent('USD 127.000,00');
  });
});

describe('Modo oscuro', () => {
  test('el botón cambia el tema y lo guarda en localStorage', async () => {
    localStorage.setItem(CLAVES.SESION, JSON.stringify({ email: 'juan@correo.com' }));
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Activar modo oscuro' }));
    expect(document.documentElement.dataset.tema).toBe('oscuro');
    expect(JSON.parse(localStorage.getItem(CLAVES.TEMA))).toBe('oscuro');
    expect(screen.getByRole('button', { name: 'Activar modo claro' })).toBeInTheDocument();
  });
});

describe('Navegación y sesión', () => {
  test('sin sesión redirige al login', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument();
  });

  test('registrarse e iniciar sesión lleva a la página principal', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('link', { name: 'Registrate aquí' }));
    await userEvent.type(screen.getByLabelText('Nombre completo:'), 'Juan Pérez');
    await userEvent.type(screen.getByLabelText('Correo electrónico:'), 'juan@correo.com');
    await userEvent.type(screen.getByLabelText('Contraseña:'), '12345678');
    await userEvent.type(screen.getByLabelText('Confirmar contraseña:'), '12345678');
    await userEvent.click(screen.getByRole('button', { name: 'Crear Cuenta' }));

    expect(screen.getByLabelText('Correo electrónico:')).toHaveValue('juan@correo.com');
    await userEvent.type(screen.getByLabelText('Contraseña:'), '12345678');
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    expect(await screen.findByRole('heading', { name: 'Organizador de Maquinaria' })).toBeInTheDocument();
    expect(screen.getByText(/juan@correo.com/)).toBeInTheDocument();
  });
});
