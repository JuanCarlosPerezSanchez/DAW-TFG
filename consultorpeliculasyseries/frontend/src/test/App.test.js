import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock window.scrollTo para evitar warnings en jsdom
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

test('renderiza el header con el logo y el menú principal', () => {
    renderWithRoute('/');
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByText(/popular/i)).toBeInTheDocument();
    expect(screen.getByText(/películas/i)).toBeInTheDocument();
    expect(screen.getByText(/series/i)).toBeInTheDocument();
    expect(screen.getByText(/mi galería/i)).toBeInTheDocument();
});

test('navega a la página de películas', async () => {
    renderWithRoute('/');
    fireEvent.click(screen.getByText(/películas/i));
    await waitFor(() => {
        expect(screen.getByText(/películas/i)).toBeInTheDocument();
    });
});

test('navega a la página de series', async () => {
    renderWithRoute('/');
    fireEvent.click(screen.getByText(/series/i));
    await waitFor(() => {
        expect(screen.getByText(/series/i)).toBeInTheDocument();
    });
});

test('navega correctamente usando el menú principal', async () => {
    renderWithRoute('/');
    fireEvent.click(screen.getByText(/series/i));
    await screen.findByText(/series/i);
    fireEvent.click(screen.getByText(/películas/i));
    await screen.findByText(/películas/i);
    fireEvent.click(screen.getByText(/mi galería/i));
    await screen.findByText(/debes iniciar sesión/i);
});

test('renderiza los botones de usuario en el header', () => {
    renderWithRoute('/');
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
});
