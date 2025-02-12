import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Maturity } from 'clo-ui';

import { FilterKind } from '../../../types';
import Section from './Section';

const mockOnChange = jest.fn();

const defaultProps = {
  section: {
    name: FilterKind.Maturity,
    title: 'Maturity level',
    filters: [
      { name: Maturity.graduated, label: 'Graduated' },
      { name: Maturity.incubating, label: 'Incubating' },
      { name: Maturity.sandbox, label: 'Sandbox' },
    ],
  },
  activeFilters: [],
  onChange: mockOnChange,
  device: 'test',
};

describe('Section', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates snapshot', () => {
    const { asFragment } = render(<Section {...defaultProps} />);

    expect(asFragment()).toMatchSnapshot();
  });

  describe('Render', () => {
    it('renders Section', () => {
      render(<Section {...defaultProps} />);

      expect(screen.getByText('Maturity level')).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: 'Graduated' })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: 'Incubating' })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: 'Sandbox' })).toBeInTheDocument();
    });

    it('renders Section with selected options', () => {
      render(<Section {...defaultProps} activeFilters={['incubating', 'sandbox']} />);

      expect(screen.getByRole('checkbox', { name: 'Incubating' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Sandbox' })).toBeChecked();
    });

    it('calls onChange to click filter', async () => {
      render(<Section {...defaultProps} />);

      const check = screen.getByRole('checkbox', { name: 'Incubating' });

      expect(check).not.toBeChecked();

      await userEvent.click(check);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('maturity', 'incubating', true);
    });

    it('calls onChange to click selected filter', async () => {
      render(<Section {...defaultProps} activeFilters={['graduated']} />);

      const check = screen.getByRole('checkbox', { name: 'Graduated' });

      expect(check).toBeChecked();

      await userEvent.click(check);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith('maturity', 'graduated', false);
    });
  });
});
