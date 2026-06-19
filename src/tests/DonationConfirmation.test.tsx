import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DonationConfirmation } from '../components/DonationConfirmation';

const mockHospital = {
  _id: '1',
  name: 'City General Hospital',
  bloodUnits: { 'A+': 10, 'B+': 5 },
};

const mockOnClose = vi.fn();
const mockOnConfirm = vi.fn();

const renderComponent = (units = 2) =>
  render(
    <DonationConfirmation
      hospital={mockHospital}
      units={units}
      onClose={mockOnClose}
      onConfirm={mockOnConfirm}
    />
  );

describe('DonationConfirmation', () => {
  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnConfirm.mockClear();
  });

  it('renders hospital name and units in the message', () => {
    renderComponent();
    expect(screen.getByText(/City General Hospital/)).toBeInTheDocument();
    expect(screen.getByText(/2 unit\(s\)/)).toBeInTheDocument();
  });

  it('renders the OTP input field', () => {
    renderComponent();
    expect(screen.getByLabelText('Enter OTP')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', async () => {
    renderComponent();
    await userEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when X button is clicked', async () => {
    renderComponent();
    const closeButtons = screen.getAllByRole('button');
    await userEvent.click(closeButtons[0]);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm with the entered OTP on submit', async () => {
    renderComponent();
    await userEvent.type(screen.getByLabelText('Enter OTP'), '1234');
    await userEvent.click(screen.getByRole('button', { name: 'Confirm Donation' }));
    expect(mockOnConfirm).toHaveBeenCalledWith('1234');
  });

  it('does not call onConfirm when OTP is empty', async () => {
    renderComponent();
    await userEvent.click(screen.getByRole('button', { name: 'Confirm Donation' }));
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });
});
