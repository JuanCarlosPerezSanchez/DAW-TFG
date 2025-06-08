import { render, screen } from '@testing-library/react';
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

function renderWithRoute(route = '/buscar/test') {
    window.history.pushState({}, 'Test page', route);
    return render(
        <MemoryRouter initialEntries={[route]}>
            <App />
        </MemoryRouter>
    );
}

test('renderiza la página de búsqueda', () => {
    renderWithRoute();
    expect(screen.getByText(/resultados de búsqueda/i)).toBeInTheDocument();
});
