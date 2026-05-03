import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BoothFinderPage from '@/app/booth-finder/page';
import { LanguageProvider } from '@/context/LanguageContext';
import React from 'react';

// Mock components that might be problematic or external
vi.mock('@/components/BoothCard', () => ({
  BoothCard: ({ booth }: any) => <div data-testid="booth-card">{booth.name}</div>
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('BoothFinderPage', () => {
  it('should render the search input and initial state', () => {
    render(<BoothFinderPage />, { wrapper });
    expect(screen.getByPlaceholderText(/Enter Pincode or City/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter your 6-digit Pincode/i)).toBeInTheDocument();
  });

  it('should show loading state and then results on search', async () => {
    render(<BoothFinderPage />, { wrapper });
    
    const input = screen.getByPlaceholderText(/Enter Pincode or City/i);
    const button = screen.getByRole('button', { name: /Search Booths/i });

    fireEvent.change(input, { target: { value: '400001' } });
    fireEvent.click(button);

    expect(screen.getByText(/Locating.../i)).toBeInTheDocument();
    expect(screen.getByText(/Connecting to ECI Database/i)).toBeInTheDocument();

    // Wait for the simulated delay in handleSearch
    await waitFor(() => {
      expect(screen.getByText(/Stations near 400001/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    const cards = screen.getAllByTestId('booth-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should not search if input is empty', () => {
    render(<BoothFinderPage />, { wrapper });
    const button = screen.getByRole('button', { name: /Search Booths/i });
    
    fireEvent.click(button);
    expect(screen.queryByText(/Locating.../i)).not.toBeInTheDocument();
  });
});
