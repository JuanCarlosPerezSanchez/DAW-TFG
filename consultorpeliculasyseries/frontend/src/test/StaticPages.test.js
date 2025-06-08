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

function renderWithRoute(route) {
    window.history.pushState({}, 'Test page', route);
    return render(
        <MemoryRouter initialEntries={[route]}>
            <App />
        </MemoryRouter>
    );
}

test('renderiza la página sobre la web', () => {
    renderWithRoute('/sobre-la-web');
    expect(screen.getByText(/sobre la web/i)).toBeInTheDocument();
});

test('renderiza la página del desarrollador', () => {
    renderWithRoute('/desarrollador');
    expect(screen.getByText(/sobre el desarrollador/i)).toBeInTheDocument();
});

test('renderiza la página de API info', () => {
    renderWithRoute('/api-info');
    expect(screen.getAllByText(/api/i).length).toBeGreaterThan(0);
});

test('el footer se renderiza en las páginas principales', () => {
    renderWithRoute('/sobre-la-web');
    expect(
        screen.queryAllByText((content, node) =>
            typeof node?.textContent === 'string' &&
            node.textContent.toLowerCase().includes('consultor de películas y series')
        ).length
    ).toBeGreaterThan(0);

    renderWithRoute('/desarrollador');
    expect(
        screen.queryAllByText((content, node) =>
            typeof node?.textContent === 'string' &&
            node.textContent.toLowerCase().includes('consultor de películas y series')
        ).length
    ).toBeGreaterThan(0);
});
