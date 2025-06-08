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

function renderWithRoute(route = '/detalle/movie/123') {
    window.history.pushState({}, 'Test page', route);
    return render(
        <MemoryRouter initialEntries={[route]}>
            <App />
        </MemoryRouter>
    );
}

test('renderiza la página de detalles', () => {
    renderWithRoute();
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
});
