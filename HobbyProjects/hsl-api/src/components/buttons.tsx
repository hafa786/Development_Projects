import React from 'react';
import { motion } from 'framer-motion';
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
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`stylish-button ${variant}`}
        onClick={onClick}
      >
        {text}
      </motion.button>
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
