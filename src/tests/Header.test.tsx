import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../components/Header';
import { PointsProvider } from '../contexts/PointsContext';
import { CartProvider } from '../contexts/CartContext';

const renderHeader = () =>
  render(
    <MemoryRouter>
      <PointsProvider>
        <CartProvider>
          <Header />
        </CartProvider>
      </PointsProvider>
    </MemoryRouter>
  );

describe('Header', () => {
  it('renders the goodwill logo text', () => {
    renderHeader();
    expect(screen.getByText('goodwill')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    renderHeader();
    expect(screen.getByText('Serving Humanity')).toBeInTheDocument();
  });

  it('renders the Login button', () => {
    renderHeader();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders the points button with initial points', () => {
    renderHeader();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
