import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

window.scrollTo = jest.fn();

// Mock global.fetch para evitar warnings de peticiones de red
beforeAll(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ results: [] }),
        })
    );
});

afterAll(() => {
    global.fetch.mockRestore && global.fetch.mockRestore();
});

function renderWithRoute(route = '/login') {
    window.history.pushState({}, 'Test page', route);
    return render(
        <MemoryRouter initialEntries={[route]}>
            <App />
        </MemoryRouter>
    );
}

test('renderiza el formulario de login', () => {
    renderWithRoute();
    expect(screen.getByPlaceholderText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
});

test('muestra error si el login se envía vacío', async () => {
    renderWithRoute();
    fireEvent.click(screen.getByText(/iniciar sesión/i));
    expect(await screen.findByText(/rellena todos los campos/i)).toBeInTheDocument();
});

test('muestra error si el email de login es inválido', async () => {
    renderWithRoute();
    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), { target: { value: 'noemail' } });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByText(/iniciar sesión/i));
    expect(await screen.findByText(/correo electrónico válido/i)).toBeInTheDocument();
});
