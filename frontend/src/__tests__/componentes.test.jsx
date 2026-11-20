import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/Button';
import Input from '@/components/Input';
import QuotesList from '@/components/QuotesList';
import cotizaciones from '@/data/cotizaciones.json';
import * as api from '@/api/cotizaciones';

describe('Componentes genéricos', () => {
  test('Button renderiza el texto esperado y ejecuta onClick', async () => {
    const alHacerClic = jest.fn();
    render(<Button onClick={alHacerClic}>Guardar</Button>);
    const boton = screen.getByRole('button', { name: 'Guardar' });
    expect(boton).toHaveClass('btn');
    expect(boton).toHaveAttribute('type', 'button');
    await userEvent.click(boton);
    expect(alHacerClic).toHaveBeenCalledTimes(1);
  });

  test('Input asocia el label con el campo mediante el atributo for', () => {
    render(<Input label="Hectáreas" id="hectareas" maxLength={10} />);
    const campo = screen.getByLabelText('Hectáreas');
    expect(campo).toHaveAttribute('id', 'hectareas');
    expect(campo).toHaveAttribute('maxLength', '10');
  });

  test('Input muestra el error de forma accesible (role=alert y aria-invalid)', () => {
    render(<Input label="Email" id="email" error="Ingrese un email válido" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Ingrese un email válido');
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  test('Input con options renderiza un select con todas las opciones', () => {
    render(<Input label="Tipo" id="tipo" options={['Tractor', 'Arado']} placeholderOption="Elegir" />);
    expect(screen.getByLabelText('Tipo').tagName).toBe('SELECT');
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  test('QuotesList pide los datos al servicio y renderiza una tarjeta por cada bolsa', async () => {
    render(<QuotesList />);
    expect(screen.getByText('Cargando cotizaciones…')).toBeInTheDocument();
    for (const bolsa of cotizaciones) {
      expect(await screen.findByRole('heading', { name: bolsa.nombre })).toBeInTheDocument();
      expect(screen.getByAltText(bolsa.alt)).toBeInTheDocument();
    }
  });

  test('QuotesList muestra los precios en pesos y dólares en una tabla con caption', async () => {
    render(<QuotesList />);
    const [tablaRosario] = await screen.findAllByRole('table', { name: 'Precios por tonelada' });
    const filaSoja = within(tablaRosario).getByRole('row', { name: /Soja/ });
    expect(filaSoja).toHaveTextContent('$ 550.000');
    expect(filaSoja).toHaveTextContent('US$ 353,47');
  });

  test('QuotesList muestra un mensaje cuando el servicio no devuelve datos', async () => {
    jest.spyOn(api, 'obtenerCotizaciones').mockResolvedValueOnce([]);
    render(<QuotesList />);
    expect(await screen.findByText('No hay cotizaciones disponibles.')).toBeInTheDocument();
  });

  test('QuotesList avisa si el servicio falla', async () => {
    jest.spyOn(api, 'obtenerCotizaciones').mockRejectedValueOnce(new Error('sin conexión'));
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<QuotesList />);
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudieron cargar las cotizaciones.');
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
