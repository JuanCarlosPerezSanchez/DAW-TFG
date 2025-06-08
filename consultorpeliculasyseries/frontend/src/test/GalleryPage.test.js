import { render, screen, waitFor } from '@testing-library/react';
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

function renderWithRoute(route = '/galeria') {
    window.history.pushState({}, 'Test page', route);
    return render(
        <MemoryRouter initialEntries={[route]}>
            <App />
        </MemoryRouter>
    );
}

test('renderiza la página de galería protegida', async () => {
    window.localStorage.removeItem('user');
    renderWithRoute();
    await waitFor(() => {
        expect(screen.getByText(/debes iniciar sesión/i)).toBeInTheDocument();
    });
});

test('muestra mensaje de login requerido en galería si no hay usuario', async () => {
    window.localStorage.removeItem('user');
    renderWithRoute();
    expect(await screen.findByText(/debes iniciar sesión/i)).toBeInTheDocument();
});
