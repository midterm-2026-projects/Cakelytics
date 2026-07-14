import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../sample-backend/server'; 
import LoginPage from '../../src/pages/LoginPage';

describe('Login API Integration Tests', () => {
  
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // ─── 1. SUCCESSFUL API REQUEST ───
  it('Should login successfully if the credentials are correct', async () => {
    
    server.use(
      http.post('*/api/login', () => {
        return HttpResponse.json({
          message: "Login successful",
          data: { 
            token: "fake-jwt-token-123",
            admin: { id: "1", name: "Staff/Admin", email: "tinadepadua19@gmail.com" }
          }
        }, { status: 200 });
      })
    );

    const user = userEvent.setup();
    const mockOnLogin = vi.fn();
    
    render(<LoginPage onLogin={mockOnLogin} />);
    
    await user.type(screen.getByPlaceholderText('@gmail.com'), 'tinadepadua19@gmail.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'admin123');
    
    await user.click(screen.getByRole('button', { name: /Sign in/i }));
    
    await waitFor(() => {
      
      expect(localStorage.getItem('token')).toBe('fake-jwt-token-123');
    }, { timeout: 8000 });

    expect(mockOnLogin).toHaveBeenCalledWith({ 
      id: "1", 
      name: "Staff/Admin", 
      email: "tinadepadua19@gmail.com" 
    });
  }, 15000);

  // ─── 2. FAILED API REQUEST (401 UNAUTHORIZED) ───
  it('Should display an error message if the credentials are incorrect', async () => {
    server.use(
      http.post('*/api/login', () => {
        return HttpResponse.json({ message: "Invalid email or password." }, { status: 401 });
      })
    );

    const user = userEvent.setup();
    const mockOnLogin = vi.fn();
    
    render(<LoginPage onLogin={mockOnLogin} />);
    
    await user.type(screen.getByPlaceholderText('@gmail.com'), 'tinadepadua19@gmail.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrongpassword_ito');
    
    await user.click(screen.getByRole('button', { name: /Sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password.')).toBeInTheDocument();
    }, { timeout: 8000 });

    expect(localStorage.getItem('token')).toBeNull();
    expect(mockOnLogin).not.toHaveBeenCalled();
  }, 15000);

  // ─── 3. SERVER ERROR (500 INTERNAL SERVER ERROR) ───
  it('Should display a generic error message if the server crashes or fails unexpectedly', async () => {
    server.use(
      http.post('*/api/login', () => {
        return HttpResponse.json(
          { message: "Something went wrong. Please try again later." },
          { status: 500 }
        );
      })
    );

    const user = userEvent.setup();
    const mockOnLogin = vi.fn();

    render(<LoginPage onLogin={mockOnLogin} />);

    await user.type(screen.getByPlaceholderText('@gmail.com'), 'tinadepadua19@gmail.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'admin123');

    await user.click(screen.getByRole('button', { name: /Sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument();
    }, { timeout: 8000 });

    expect(localStorage.getItem('token')).toBeNull();
    expect(mockOnLogin).not.toHaveBeenCalled();
  }, 15000);

});