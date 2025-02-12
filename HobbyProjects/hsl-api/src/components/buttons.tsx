import React from 'react';
import '../styles/global.scss'; // Import SCSS file

interface PrimaryButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  text,
  onClick,
  variant = 'primary',
}) => {
  return (
    <div className="primary-button">
      <button className={`stylish-button ${variant}`} onClick={onClick}>
        {text}
      </button>
    </div>
  );
};

interface TextButtonProps {
  text: string;
  onClick?: () => void;
}
export const TextButton: React.FC<TextButtonProps> = ({ text, onClick }) => {
  return (
    <div className={`text-button`} onClick={onClick}>
      {text}
    </div>
  );
};
