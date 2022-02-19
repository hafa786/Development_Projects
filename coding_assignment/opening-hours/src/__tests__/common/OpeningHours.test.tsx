import React from 'react';
import { render, screen } from '@testing-library/react';
import OpeningHours from '../../views/OpeningHours';

test('renders OpeningHourse component', async () => {
	await render(<OpeningHours />);
	const linkElement = screen.getByText(/Opening hours/i);
	expect(linkElement).toBeInTheDocument();
});
