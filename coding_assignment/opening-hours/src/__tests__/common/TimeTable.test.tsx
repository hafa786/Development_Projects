import React from 'react';
import { render, screen } from '@testing-library/react';
import TimeTable from '../../components/TimeTable/TimeTable';

test('renders the TimeTable component', () => {
	render(<TimeTable />);
	const linkElement = screen.getByText(/Opening hours/i);
	expect(linkElement).toBeInTheDocument();
});
