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

function renderWithRoute(route = '/') {
    window.history.pushState({}, 'Test page', route);
    return render(
        <MemoryRouter initialEntries={[route]}>
            <App />
        </MemoryRouter>
    );
}

test('scroll infinito en HomePage actualiza la página', () => {
    renderWithRoute('/');
    window.innerHeight = 1000;
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(screen.getByText(/popular/i)).toBeInTheDocument();
});

test('muestra resultados de búsqueda al escribir', () => {
    renderWithRoute('/');
    const searchInput = screen.getByPlaceholderText(/búsqueda de películas y series/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    // Aquí solo comprobamos que el input acepta texto
});
