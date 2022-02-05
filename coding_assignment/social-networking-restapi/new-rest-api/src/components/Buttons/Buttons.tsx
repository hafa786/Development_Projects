import React from 'react';

import './Buttons.css';

type ButtonsProps = {
    action: React.MouseEventHandler<HTMLButtonElement>,
    text: string,
}

export const PrimaryButton = ({ action, text} : ButtonsProps) => {
	return (
		<button onClick={action} className="primary-button">{text}</button>
	);
};