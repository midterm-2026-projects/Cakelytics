import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import SearchBar from '../../src/components/POScomponents/SearchBar'; // Adjust the path as needed
import '@testing-library/jest-dom';

describe('SearchBar Component', () => {
  it('should render correctly with a placeholder', () => {
    render(<SearchBar searchTerm="" setSearchTerm={() => {}} />);
    const inputElement = screen.getByPlaceholderText(/search product.../i);
    expect(inputElement).toBeInTheDocument();
  });

  it('should call setSearchTerm when the user types', () => {
    // 1. Create a mock function
    const mockSetSearchTerm = vi.fn();
    
    // 2. Render the component with the mock
    render(<SearchBar searchTerm="" setSearchTerm={mockSetSearchTerm} />);
    
    // 3. Find the input
    const inputElement = screen.getByPlaceholderText(/search product.../i);
    
    // 4. Simulate user typing
    fireEvent.change(inputElement, { target: { value: 'coffee' } });
    
    // 5. Assert the mock was called with the correct value
    expect(mockSetSearchTerm).toHaveBeenCalledWith('coffee');
  });

  it('should reflect the provided searchTerm prop', () => {
    render(<SearchBar searchTerm="espresso" setSearchTerm={() => {}} />);
    const inputElement = screen.getByDisplayValue('espresso');
    expect(inputElement).toBeInTheDocument();
  });
});