import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HospitalList } from '../components/HospitalList';

const mockOnBack = vi.fn();

const renderHospitalList = () =>
  render(<HospitalList onBack={mockOnBack} />);

describe('HospitalList', () => {
  beforeEach(() => {
    mockOnBack.mockClear();
  });

  it('renders the section heading', () => {
    renderHospitalList();
    expect(screen.getByText('Nearby Hospitals')).toBeInTheDocument();
  });

  it('renders all 3 hospitals', () => {
    renderHospitalList();
    expect(screen.getByText('City General Hospital')).toBeInTheDocument();
    expect(screen.getByText('Mercy Medical Center')).toBeInTheDocument();
    expect(screen.getByText("St. John's Hospital")).toBeInTheDocument();
  });

  it('shows hospital detail view on click', async () => {
    renderHospitalList();
    await userEvent.click(screen.getByText('City General Hospital'));
    expect(screen.getByText('123 Main Street, Downtown, 10001')).toBeInTheDocument();
    expect(screen.getByText('View on Map')).toBeInTheDocument();
  });

  it('goes back to list when Close is clicked', async () => {
    renderHospitalList();
    await userEvent.click(screen.getByText('City General Hospital'));
    await userEvent.click(screen.getByText('Close'));
    expect(screen.getByText('Nearby Hospitals')).toBeInTheDocument();
    expect(screen.getByText('Mercy Medical Center')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    renderHospitalList();
    await userEvent.click(screen.getByText('Back to Donors'));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
