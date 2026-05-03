import { render, screen, fireEvent } from '@testing-library/react';
import { PledgeSection } from '@/components/PledgeSection';
import { expect, test, describe, vi } from 'vitest';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('PledgeSection Component', () => {
  test('renders the pledge CTA initially', () => {
    render(<PledgeSection />);
    expect(screen.getByText(/I Pledge to/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Commit to take the Voter Pledge/i })).toBeInTheDocument();
  });

  test('shows success state after pledging', async () => {
    render(<PledgeSection />);
    const pledgeButton = screen.getByRole('button', { name: /Commit to take the Voter Pledge/i });
    
    fireEvent.click(pledgeButton);
    
    expect(await screen.findByText(/Champion of Democracy/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Download your Voter Pledge Certificate/i)).toBeInTheDocument();
  });
});

