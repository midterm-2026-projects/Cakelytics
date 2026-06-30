import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PastCreations from "../../src/components/orderingComponents/PastCreations";

describe('PastCreations Component', () => {
  
  test('renders the section heading and description correctly', () => {
    render(<PastCreations />);
    
    // Check if the main heading is in the document
    const heading = screen.getByRole('heading', { name: /some past creations/i });
    expect(heading).toBeInTheDocument();
    
    // Check if the description text is present
    const description = screen.getByText(/a glimpse of the bespoke orders we've crafted/i);
    expect(description).toBeInTheDocument();
  });

  test('renders exactly 10 cake images', () => {
    render(<PastCreations />);
    
    // Query all image elements in the component
    const images = screen.getAllByRole('img');
    
    // Verify the total count matches the array length
    expect(images).toHaveLength(10);
  });

  test('images have the correct src and alt attributes', () => {
    render(<PastCreations />);
    
    const images = screen.getAllByRole('img');
    
    // Verify the first image specifically
    expect(images[0]).toHaveAttribute('src', '/cakes/cake1.jpg');
    expect(images[0]).toHaveAttribute('alt', 'Cake 1');
    
    // Verify the last image specifically
    expect(images[9]).toHaveAttribute('src', '/cakes/cake10.jpg');
    expect(images[9]).toHaveAttribute('alt', 'Cake 10');
    
    // Alternative: Loop through and verify all to be thorough
    images.forEach((img, index) => {
      expect(img).toHaveAttribute('src', `/cakes/cake${index + 1}.jpg`);
      expect(img).toHaveAttribute('alt', `Cake ${index + 1}`);
    });
  });

  test('applies structural grid classes to the gallery container', () => {
    const { container } = render(<PastCreations />);
    
    // Find the gallery wrapper grid by looking for its specific layout classes
    const galleryGrid = container.querySelector('.grid');
    
    expect(galleryGrid).toBeInTheDocument();
    expect(galleryGrid).toHaveClass('grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-5');
  });
});