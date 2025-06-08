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

function renderWithRoute(route = '/register') {
    window.history.pushState({}, 'Test page', route);
    return render(
        <MemoryRouter initialEntries={[route]}>
            <App />
        </MemoryRouter>
    );
}

test('renderiza el formulario de registro', () => {
    renderWithRoute();
    expect(screen.getByPlaceholderText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/contraseña/i).length).toBe(2);
    expect(screen.getByPlaceholderText(/confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByText(/registrarse/i)).toBeInTheDocument();
});

test('muestra error si las contraseñas no coinciden en registro', async () => {
    renderWithRoute();
    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), { target: { value: 'test@mail.com' } });
    fireEvent.change(screen.getByPlaceholderText(/nombre de usuario/i), { target: { value: 'usuario' } });
    const [pass1] = screen.getAllByPlaceholderText(/contraseña/i);
    fireEvent.change(pass1, { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText(/confirmar contraseña/i), { target: { value: '654321' } });
    fireEvent.click(screen.getByText(/registrarse/i));
    expect(await screen.findByText(/contraseñas no coinciden/i)).toBeInTheDocument();
});

test('muestra error si el email de registro es inválido', async () => {
    renderWithRoute();
    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), { target: { value: 'noemail' } });
    fireEvent.change(screen.getByPlaceholderText(/nombre de usuario/i), { target: { value: 'usuario' } });
    const [pass1] = screen.getAllByPlaceholderText(/contraseña/i);
    fireEvent.change(pass1, { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText(/confirmar contraseña/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByText(/registrarse/i));
    expect(await screen.findByText(/correo electrónico válido/i)).toBeInTheDocument();
});
