import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CheckoutPage from '../CheckoutPage';
import { CartProvider } from '../../Context/CartContext';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('CheckoutPage', () => {
  const renderCheckoutPage = () => {
    return render(
      <BrowserRouter>
        <CartProvider>
          <CheckoutPage />
        </CartProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    // Clear mocks
    mockNavigate.mockClear();
    
    // Mock localStorage and sessionStorage
    const mockCart = JSON.stringify([{ id: 1, quantity: 1 }]);
    const mockTotal = "10.00";
    const mockToken = "mock-token";
    
    Storage.prototype.getItem = jest.fn((key) => {
      switch (key) {
        case 'cart':
          return mockCart;
        case 'orderTotal':
          return mockTotal;
        case 'token':
          return mockToken;
        default:
          return null;
      }
    });
  });

  describe('Form Validation', () => {
    it('validates required fields', async () => {
      renderCheckoutPage();

      // Try to submit empty form
      fireEvent.click(screen.getByRole('button', { name: /Proceed to Payment/i }));

      await waitFor(() => {
        expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Address is required/i)).toBeInTheDocument();
        expect(screen.getByText(/City is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Postal code is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Country is required/i)).toBeInTheDocument();
      });
    });

    it('validates postal code format', async () => {
      renderCheckoutPage();

      // Fill in invalid postal code
      const postalCodeInput = screen.getByPlaceholderText(/Postal Code/i);
      fireEvent.change(postalCodeInput, { target: { value: 'invalid' } });
      fireEvent.blur(postalCodeInput);

      // Wait for error message to appear after input change
      await waitFor(() => {
        expect(screen.getByText(/Invalid postal code format/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('handles successful submission', async () => {
      renderCheckoutPage();

      // Fill in form
      fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText(/Address/i), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByPlaceholderText(/City/i), { target: { value: 'Test City' } });
      fireEvent.change(screen.getByPlaceholderText(/Postal Code/i), { target: { value: '12345' } });
      fireEvent.change(screen.getByPlaceholderText(/Country/i), { target: { value: 'Test Country' } });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /Proceed to Payment/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/payment');
        expect(sessionStorage.getItem('shippingInfo')).toBeTruthy();
      });
    });
  });

  describe('Security Checks', () => {
    it('redirects to login if no token', () => {
      sessionStorage.removeItem('token');
      renderCheckoutPage();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('redirects to cart if no token but cart is empty', () => {
      sessionStorage.setItem('token', 'mock-token');
      sessionStorage.removeItem('cart');
      renderCheckoutPage();
      expect(mockNavigate).toHaveBeenCalledWith('/cart');
    });
  });
});
