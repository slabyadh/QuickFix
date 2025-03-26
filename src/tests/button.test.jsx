import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Button Component', () => {
  it('renders the button with the correct label', () => {
    render(<button onClick={() => {}}>Click Me</button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls the onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<button onClick={handleClick}>Click Me</button>);
    await userEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});