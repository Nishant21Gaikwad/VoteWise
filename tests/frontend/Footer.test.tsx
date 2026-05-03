import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/Footer';
import { expect, test, describe } from 'vitest';

describe('Footer Component', () => {
  test('renders the National Voter Helpline (1950)', () => {
    render(<Footer />);
    expect(screen.getByText('1950')).toBeInTheDocument();
    expect(screen.getByText(/National Voter Helpline/i)).toBeInTheDocument();
  });

  test('has correct accessibility landmarks', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /Product/i })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /Resources/i })).toBeInTheDocument();
  });

  test('contains essential links', () => {
    render(<Footer />);
    expect(screen.getByText(/Voter Journey/i)).toBeInTheDocument();
    expect(screen.getByText(/Election Timeline/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Assistant/i)).toBeInTheDocument();
  });
});

