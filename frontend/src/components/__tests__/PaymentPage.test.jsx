import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import PaymentPage from '../PaymentPage';
import { CartProvider } from '../../Context/CartContext';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock fetch
global.fetch = jest.fn();

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });

const renderPaymentPage = () => {
  return render(
    <BrowserRouter>
      <CartProvider>
        <PaymentPage />
      </CartProvider>
    </BrowserRouter>
  );
};

describe('PaymentPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('mock-token');
    mockSessionStorage.getItem
      .mockImplementation((key) => {
        const storage = {
          shippingInfo: JSON.stringify({ name: 'Test User', address: 'Test Address' }),
          cartItems: JSON.stringify([{ id: 1, quantity: 1 }]),
          orderId: '12345',
        };
        return storage[key];
      });
  });

  describe('Input Validation', () => {
    test('validates cardholder name', async () => {
      renderPaymentPage();
      
      const nameInput = screen.getByPlaceholderText(/John Doe/i);
      fireEvent.change(nameInput, { target: { value: '123' } });
      fireEvent.blur(nameInput);
      
      expect(await screen.findByText(/Please enter a valid cardholder name/i)).toBeInTheDocument();
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.blur(nameInput);
      
      expect(screen.queryByText(/Please enter a valid cardholder name/i)).not.toBeInTheDocument();
    });

    test('validates card number with Luhn algorithm', async () => {
      renderPaymentPage();
      
      const cardInput = screen.getByPlaceholderText(/1234 5678 9012 3456/i);
      
      // Invalid card number
      fireEvent.change(cardInput, { target: { value: '4532123456788' } });
      fireEvent.blur(cardInput);
      
      expect(await screen.findByText(/Invalid card number/i)).toBeInTheDocument();
      
      // Valid card number (Visa test number)
      fireEvent.change(cardInput, { target: { value: '4532015112830366' } });
      fireEvent.blur(cardInput);
      
      expect(screen.queryByText(/Invalid card number/i)).not.toBeInTheDocument();
    });

    test('validates expiration date', async () => {
      renderPaymentPage();
      
      const expirationInput = screen.getByPlaceholderText(/MM\/YY/i);
      
      // Past date
      fireEvent.change(expirationInput, { target: { value: '01/20' } });
      fireEvent.blur(expirationInput);
      
      expect(await screen.findByText(/Card has expired/i)).toBeInTheDocument();
      
      // Invalid month
      fireEvent.change(expirationInput, { target: { value: '13/25' } });
      fireEvent.blur(expirationInput);
      
      expect(await screen.findByText(/Invalid month/i)).toBeInTheDocument();
      
      // Valid future date
      const futureYear = new Date().getFullYear() + 2;
      fireEvent.change(expirationInput, { target: { value: `12/${futureYear.toString().slice(-2)}` } });
      fireEvent.blur(expirationInput);
      
      expect(screen.queryByText(/Card has expired/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Invalid month/i)).not.toBeInTheDocument();
    });

    test('validates CVV', async () => {
      renderPaymentPage();
      
      const cvvInput = screen.getByLabelText(/CVV/i);
      
      // Too short
      fireEvent.change(cvvInput, { target: { value: '12' } });
      fireEvent.blur(cvvInput);
      
      expect(await screen.findByText(/CVV must be 3 or 4 digits/i)).toBeInTheDocument();
      
      // Valid 3 digits
      fireEvent.change(cvvInput, { target: { value: '123' } });
      fireEvent.blur(cvvInput);
      
      expect(screen.queryByText(/CVV must be 3 or 4 digits/i)).not.toBeInTheDocument();
    });
  });

  describe('Payment Processing', () => {
    test('handles successful payment submission', async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ orderId: '12345', status: 'success' }),
        })
      );

      renderPaymentPage();

      // Fill in form
      fireEvent.change(screen.getByPlaceholderText(/John Doe/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText(/1234 5678 9012 3456/i), { target: { value: '4532015112830366' } });
      fireEvent.change(screen.getByPlaceholderText(/MM\/YY/i), { target: { value: '12/25' } });
      const cvvInput = screen.getByLabelText(/CVV/i);
      fireEvent.change(cvvInput, { target: { value: '123' } });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /Pay Securely/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/order-confirmation', expect.any(Object));
      });
    });

    test('handles payment failure', async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: 'Payment failed' }),
        })
      );

      renderPaymentPage();

      // Fill in form
      fireEvent.change(screen.getByPlaceholderText(/John Doe/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText(/1234 5678 9012 3456/i), { target: { value: '4532015112830366' } });
      fireEvent.change(screen.getByPlaceholderText(/MM\/YY/i), { target: { value: '12/25' } });
      const cvvInput = screen.getByLabelText(/CVV/i);
      fireEvent.change(cvvInput, { target: { value: '123' } });

      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /Pay Securely/i }));

      await waitFor(() => {
        expect(screen.getByText(/Payment failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Security Checks', () => {
    test('redirects to login if no token', () => {
      mockLocalStorage.getItem.mockReturnValueOnce(null);
      renderPaymentPage();
      
      expect(mockNavigate).toHaveBeenCalledWith('/login', expect.any(Object));
    });

    test('redirects to checkout if no shipping info', () => {
      mockSessionStorage.getItem.mockImplementation((key) => {
        if (key === 'shippingInfo') return null;
        return 'mock-value';
      });
      
      renderPaymentPage();
      
      expect(mockNavigate).toHaveBeenCalledWith('/checkout');
    });

    test('cleans up sensitive data after successful payment', async () => {
      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ orderId: '12345', status: 'success' }),
        })
      );

      renderPaymentPage();

      // Fill and submit form
      fireEvent.change(screen.getByPlaceholderText(/John Doe/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByPlaceholderText(/1234 5678 9012 3456/i), { target: { value: '4532015112830366' } });
      fireEvent.change(screen.getByPlaceholderText(/MM\/YY/i), { target: { value: '12/25' } });
      const cvvInput = screen.getByLabelText(/CVV/i);
      fireEvent.change(cvvInput, { target: { value: '123' } });

      fireEvent.click(screen.getByRole('button', { name: /Pay Securely/i }));

      await waitFor(() => {
        expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('cartItems');
        expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('orderId');
        expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('shippingInfo');
      });
    });
  });
});
