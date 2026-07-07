import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ActionableRecommendation from '../../../src/components/Analytics/actionableRecommendation';

describe('ActionableRecommendation Component', () => {
  it('should render the list of recommendations correctly given valid recommendation data.', () => {
    const validData = [
      { 
        badge: 'STOCK', 
        title: 'Restock Cake Flour', 
        desc: 'Paubos na ang flour natin para sa cake bases.', 
        type: 'danger' 
      }
    ];
    
    render(<ActionableRecommendation recommendations={validData} />);
    
    // Tinitingnan kung lumabas nang tama ang badge, title, at description
    expect(screen.getByText('STOCK')).toBeInTheDocument();
    expect(screen.getByText('Restock Cake Flour')).toBeInTheDocument();
    expect(screen.getByText('Paubos na ang flour natin para sa cake bases.')).toBeInTheDocument();
  });
});