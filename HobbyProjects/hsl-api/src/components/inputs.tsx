import React from 'react';
import '../styles/global.scss'; // Import SCSS file

interface TextInputProps {
  lable: string;
  type: string;
  placeholder: string;
  required: boolean;
}
export const TextInput: React.FC<TextInputProps> = ({
  lable,
  type,
  placeholder,
  required = false,
}) => {
  return (
    <div className="text-input">
      <div className="input-container">
        <input
          type={type}
          id="styledInput"
          placeholder={placeholder}
          required={required}
        />
        <label htmlFor="styledInput">{lable}</label>
      </div>
    </div>
  );
};
