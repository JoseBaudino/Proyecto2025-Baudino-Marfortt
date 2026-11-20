import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';
import CostCalculator from '@/components/CostCalculator';
import LivestockSection from '@/components/LivestockSection';

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
  test('agrega una raza, suma con +1 y la guarda en localStorage', async () => {
    render(<LivestockSection />);
    await userEvent.selectOptions(screen.getByLabelText('Tipo de animal'), 'Vaca');
    await userEvent.type(screen.getByLabelText('Raza'), 'Angus');
    await userEvent.clear(screen.getByLabelText('Cantidad inicial'));
    await userEvent.type(screen.getByLabelText('Cantidad inicial'), '5');
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

    const [item] = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(item).toHaveTextContent('Angus: 5 animales');
    await userEvent.click(within(item).getByRole('button', { name: 'Sumar un animal a Angus' }));
    expect(item).toHaveTextContent('Angus: 6 animales');
    expect(JSON.parse(localStorage.getItem('agroGestion_breeds'))[0].count).toBe(6);
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
