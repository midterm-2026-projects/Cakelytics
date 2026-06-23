// src/test/LoginPage.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../src/pages/LoginPage.jsx';
import * as authService from '../src/services/authService.js';

// Mock para sa localStorage upang maiwasan ang TypeError: localStorage.clear is not a function
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

vi.mock('../src/services/authService.js');

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should update the input state when the admin types into the email or password field', () => {
    render(<LoginPage onLogin={() => {}} />);

    const emailInput = screen.getByPlaceholderText('@gmail.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    fireEvent.change(emailInput, { target: { value: 'admin@cakelytics.com' } });
    fireEvent.change(passwordInput, { target: { value: '1234' } });

    expect(emailInput.value).toBe('admin@cakelytics.com');
    expect(passwordInput.value).toBe('1234');
  });

  it('should call the mock login function with the entered credentials when the form is submitted', async () => {
    authService.login.mockResolvedValue({
      token: 'fake-token',
      admin: { id: '1', name: 'Christine De Padua', email: 'admin@cakelytics.com' },
    });
    const onLogin = vi.fn();

    render(<LoginPage onLogin={onLogin} />);

    fireEvent.change(screen.getByPlaceholderText('@gmail.com'), { target: { value: 'admin@cakelytics.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('admin@cakelytics.com', '1234');
    });
  });

  it('should store the token and call onLogin with the admin info on success', async () => {
    authService.login.mockResolvedValue({
      token: 'fake-token',
      admin: { id: '1', name: 'Christine De Padua', email: 'admin@cakelytics.com' },
    });
    const onLogin = vi.fn();

    render(<LoginPage onLogin={onLogin} />);

    fireEvent.change(screen.getByPlaceholderText('@gmail.com'), { target: { value: 'admin@cakelytics.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith({ id: '1', name: 'Christine De Padua', email: 'admin@cakelytics.com' });
    });
    expect(localStorage.getItem('token')).toBe('fake-token');
  });

  it('should show an error and not call onLogin when login fails', async () => {
    authService.login.mockRejectedValue(new Error('Invalid credentials'));
    const onLogin = vi.fn();

    render(<LoginPage onLogin={onLogin} />);

    fireEvent.change(screen.getByPlaceholderText('@gmail.com'), { target: { value: 'admin@cakelytics.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('should show validation errors and not call the login service when fields are empty', () => {
    render(<LoginPage onLogin={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
    expect(authService.login).not.toHaveBeenCalled();
  });
});