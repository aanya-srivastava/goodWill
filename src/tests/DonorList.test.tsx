import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DonorList } from '../components/DonorList';

const renderDonorList = (bloodGroup = 'A+') =>
  render(<DonorList bloodGroup={bloodGroup} />);

describe('DonorList', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the blood group badge', () => {
    renderDonorList('A+');
    expect(screen.getByText('A+ Donors')).toBeInTheDocument();
  });

  it('renders the Available Donors heading', () => {
    renderDonorList();
    expect(screen.getByText('Available Donors')).toBeInTheDocument();
  });

  it('shows 3 fallback donors when localStorage is empty', () => {
    renderDonorList('B+');
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Michael Brown')).toBeInTheDocument();
  });

  it('shows donor count in description', () => {
    renderDonorList('O+');
    expect(screen.getByText(/3 potential donors/)).toBeInTheDocument();
  });

  it('renders donor phone and address', () => {
    renderDonorList();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('555-0123')).toBeInTheDocument();
  });

  it('shows HospitalList when View Hospitals is clicked', async () => {
    renderDonorList();
    await userEvent.click(screen.getByText('View Hospitals'));
    expect(screen.getByText('Nearby Hospitals')).toBeInTheDocument();
  });

  it('loads donors from localStorage when available', () => {
    const mockDonors = [
      { donorName: 'Sumit Kumar', bloodGroup: 'A+', age: '21', phone: '999-0001', address: 'Pune', availability: 'Weekends', gender: 'male' },
    ];
    localStorage.setItem('blood-donors', JSON.stringify(mockDonors));
    renderDonorList('A+');
    expect(screen.getByText('Sumit Kumar')).toBeInTheDocument();
  });
});
